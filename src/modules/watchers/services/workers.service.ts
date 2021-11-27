import { LoggableProvider } from '@pereslavtsev/webarchiver-misc';
import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { Watcher } from '@crawler/watchers/models';
import { processorPath } from '@crawler/watchers/watcher.constants';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WatchersService } from './watchers.service';

type WorkerMap = Map<Watcher['id'], Worker>;

@Injectable()
export class WorkersService extends LoggableProvider {
  private readonly pool: WorkerMap = new Map();

  constructor(
    @RootLogger() rootLogger: Bunyan,
    private eventEmitter: EventEmitter2,
    private watchersService: WatchersService,
  ) {
    super(rootLogger);
  }

  async create(watcherId: Watcher['id']): Promise<Worker> {
    const watcher = await this.watchersService.findById(watcherId);

    const worker = new Worker(processorPath, {
      workerData: { watcher },
      execArgv: [...process.execArgv, '--unhandled-rejections=strict'],
    });
    this.pool.set(watcher.id, worker);

    return worker
      .on('message', ({ cmd, data }) => {
        switch (cmd) {
          case 'data': {
            this.eventEmitter.emit('worker.data', { watcher, data });
            break;
          }
        }
      })
      .on('online', () => this.eventEmitter.emit('worker.started', { watcher }))
      .on('exit', async () => {
        await this.terminate(watcher.id);
        this.eventEmitter.emit('worker.finished', { watcher });
      })
      .on('error', (err) =>
        this.eventEmitter.emit('worker.failed', err, { watcher }),
      );
  }

  findById(watcherId: Watcher['id']): Worker | null {
    const worker = this.pool.get(watcherId);
    // TODO: should be an exception
    if (!worker) {
      return null;
    }
    return worker;
  }

  async terminate(watcherId: Watcher['id']): Promise<void> {
    if (!this.pool.has(watcherId)) {
      return;
    }
    const worker = this.pool.get(watcherId);
    await worker.terminate();
    this.pool.delete(watcherId);
  }
}
