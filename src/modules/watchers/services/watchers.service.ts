import { Injectable } from '@nestjs/common';
import { Watcher } from '../models/watcher.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiParams } from 'mwn';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { watchers } from '@pereslavtsev/webarchiver-protoc';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggableProvider } from '@pereslavtsev/webarchiver-misc';
import { plainToClass } from 'class-transformer';

@Injectable()
export class WatchersService extends LoggableProvider {
  constructor(
    @RootLogger() rootLogger: Bunyan,
    @InjectRepository(Watcher)
    private watchersRepository: Repository<Watcher>,
    private eventEmitter: EventEmitter2,
  ) {
    super(rootLogger);
  }

  findAll({ pageSize, pageToken }: watchers.ListWatchersRequest) {
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

  async create(
    name: Watcher['name'],
    initialQuery: Watcher['initialQuery'],
  ): Promise<Watcher> {
    const watcher = await this.watchersRepository.save({
      name,
      initialQuery,
    });
    this.eventEmitter.emit('watcher.created', watcher);
    return plainToClass(Watcher, watcher);
  }

  async updateById(
    id: Watcher['id'],
    data: Partial<Watcher>,
  ): Promise<Watcher> {
    const watcher = await this.findById(id);
    const updatedWatcher = await this.watchersRepository.save({
      ...watcher,
      ...data,
    });
    return plainToClass(Watcher, updatedWatcher);
  }

  findById(id: Watcher['id']): Promise<Watcher> {
    return this.watchersRepository.findOneOrFail(id);
  }

  setContinueQuery(watcherId: Watcher['id'], continueQuery: ApiParams | null) {
    return this.watchersRepository.update(watcherId, { continueQuery });
  }

  protected setStatus(
    watcherId: Watcher['id'],
    status: Watcher['status'],
  ): Promise<Watcher> {
    return this.updateById(watcherId, { status });
  }

  async active(watcherId: Watcher['id']): Promise<Watcher> {
    const watcher = await this.setStatus(watcherId, Watcher.Status.ACTIVE);
    this.eventEmitter.emit('watcher.active', watcher);
    return watcher;
  }

  async pause(watcherId: Watcher['id']): Promise<Watcher> {
    const watcher = await this.setStatus(watcherId, Watcher.Status.PAUSED);
    this.eventEmitter.emit('watcher.paused', watcher);
    return watcher;
  }

  async pauseAll(): Promise<void> {
    await this.watchersRepository.update({}, { status: Watcher.Status.PAUSED });
  }

  async stop(watcherId: Watcher['id']): Promise<Watcher> {
    const watcher = await this.setStatus(watcherId, Watcher.Status.PENDING);
    await this.watchersRepository.update(watcherId, { continueQuery: null });
    this.eventEmitter.emit('watcher.stopped', watcher);
    return watcher;
  }
}
