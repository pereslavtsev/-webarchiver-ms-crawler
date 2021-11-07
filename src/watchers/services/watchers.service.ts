import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { Watcher } from '../models/watcher.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { processorPath } from '../watcher.constants';
import { ApiParams } from 'mwn';
import { CoreProvider } from '@crawler/shared';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { ListWatchersRequest } from '@crawler/proto/watcher';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WatchersService extends CoreProvider implements OnModuleInit {
  private readonly pool: Map<string, Worker> = new Map();

  constructor(
    @RootLogger() rootLogger: Bunyan,
    @InjectRepository(Watcher)
    private watchersRepository: Repository<Watcher>,
    private eventEmitter: EventEmitter2,
  ) {
    super(rootLogger);
  }

  async onModuleInit() {
    //await this.watchersRepository.delete({});
  }

  findWorker(id: Watcher['id']): Worker | null {
    const worker = this.pool.get(id);
    if (!worker) {
      return null;
    }
    return worker;
  }

  findAll({ pageSize, pageToken }: ListWatchersRequest) {
    const queryBuilder = this.watchersRepository.createQueryBuilder('watcher');

    const paginator = buildPaginator({
      entity: Watcher,
      paginationKeys: ['id'],
      query: {
        limit: pageSize,
        order: 'DESC',
        afterCursor: pageToken,
      },
    });

    return paginator.paginate(queryBuilder);
  }

  create(name: Watcher['name'], query: Watcher['query']) {
    return this.watchersRepository.save({
      name,
      query,
    });
  }

  async update(
    id: Watcher['id'],
    data: Partial<Pick<Watcher, 'name' | 'query'>>,
  ) {
    const watcher = await this.findById(id);

    return this.watchersRepository.save({
      ...watcher,
      ...data,
    });
  }

  findById(id: Watcher['id']): Promise<Watcher> {
    return this.watchersRepository.findOneOrFail(id);
  }

  setContinueQuery(watcherId: Watcher['id'], continueQuery: ApiParams | null) {
    return this.watchersRepository.update(watcherId, {
      continue: continueQuery,
    });
  }

  async setActive(watcherId: Watcher['id']) {
    await this.watchersRepository.update(watcherId, { active: true });
  }

  async setInactive(watcherId: Watcher['id']) {
    await this.watchersRepository.update(watcherId, { active: false });
  }

  protected createWorker(watcher: Watcher): Worker {
    const worker = this.findWorker(watcher.id);
    if (!!worker) {
      this.log.debug(`worker already exists, skipped`);
      return worker;
    }
    return new Worker(processorPath, {
      workerData: { watcher },
      execArgv: [...process.execArgv, '--unhandled-rejections=strict'],
    })
      .on('message', ({ cmd, data }) => {
        switch (cmd) {
          case 'data': {
            this.eventEmitter.emit('watcher.data', { watcher, data });
            break;
          }
        }
      })
      .on('online', () =>
        this.eventEmitter.emit('watcher.started', { watcher }),
      )
      .on('exit', async () => {
        await this.terminate(watcher.id);
        this.eventEmitter.emit('watcher.finished', { watcher });
      })
      .on('error', (err) =>
        this.eventEmitter.emit('watcher.failed', err, { watcher }),
      );
  }

  async run(watcherId: Watcher['id']) {
    const watcher = await this.findById(watcherId);
    const worker = this.createWorker(watcher);
    this.pool.set(watcher.id, worker);
    await new Promise((resolve) => worker.on('online', resolve));
  }

  protected async terminate(id: Watcher['id']) {
    const worker = this.findWorker(id);
    if (!worker) {
      this.log.debug(`already terminated`);
      return;
    }
    await worker.terminate();
    this.pool.delete(id);
  }

  async pause(id: Watcher['id']): Promise<void> {
    await this.terminate(id);
    this.log.debug(`watcher ${id} has been paused`);
  }

  async stop(id: Watcher['id']): Promise<void> {
    await this.terminate(id);
    await this.watchersRepository.update(id, { continue: null });
    this.log.debug(`watcher ${id} has been stopped`);
  }
}
