import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { Watcher } from '../models/watcher.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { processorPath } from '../watcher.constants';
import { WatcherPayload } from '../interfaces';
import { ApiResponse } from 'mwn';

@Injectable()
export class WatchersService implements OnModuleInit {
  private readonly pool: Map<string, Worker> = new Map();

  constructor(
    @InjectRepository(Watcher)
    private watchersRepository: Repository<Watcher>,
  ) {}

  async onModuleInit() {
    await this.watchersRepository.delete({});
  }

  create(name: Watcher['name'], query: Watcher['query']) {
    return this.watchersRepository.save({
      name,
      query,
    });
  }

  findById(id: Watcher['id']) {
    return this.watchersRepository.findOneOrFail(id);
  }

  protected async onDataReceived(watcherId: Watcher['id'], data: ApiResponse) {
    console.log('data', watcherId, data);
    await this.watchersRepository.update(watcherId, {
      continue: data.continue ?? null,
    });
  }

  protected async onMessage(payload: WatcherPayload) {
    // console.log('payload', payload);
    const { cmd, watcherId, data } = payload;
    switch (cmd) {
      case 'data': {
        await this.onDataReceived(watcherId, data);
        break;
      }
      case 'finished': {
        await this.stop(watcherId);
      }
    }
  }

  async setActive(watcherId: Watcher['id']) {
    await this.watchersRepository.update(watcherId, { active: true });
  }

  async setInactive(watcherId: Watcher['id']) {
    await this.watchersRepository.update(watcherId, { active: false });
  }

  protected createWorker(watcher: Watcher): Worker {
    return new Worker(processorPath, {
      workerData: { watcher },
      execArgv: [...process.execArgv, '--unhandled-rejections=strict'],
    })
      .on('message', this.onMessage.bind(this))
      .on('online', async () => {
        await this.setActive(watcher.id); // event is emitted when the watcher thread has started
      })
      .on('exit', async () => {
        await this.setInactive(watcher.id);
      })
      .on('error', async (err) => {
        console.error(err);
        await this.setInactive(watcher.id);
      });
  }

  async run(watcherId: Watcher['id']) {
    const watcher = await this.findById(watcherId);
    const worker = this.createWorker(watcher);
    this.pool.set(watcher.id, worker);
  }

  protected async terminate(id: Watcher['id']) {
    const worker = this.pool.get(id);
    if (!worker) {
      throw new Error(`Worker ${id} is not found`);
    }
    await worker.terminate();
    this.pool.delete(id);
  }

  async pause(id: Watcher['id']): Promise<void> {
    await this.terminate(id);
  }

  async stop(id: Watcher['id']): Promise<void> {
    await this.terminate(id);
    await this.watchersRepository.update(id, { continue: null });
  }
}
