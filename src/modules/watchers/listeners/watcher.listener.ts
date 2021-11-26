import { Injectable } from '@nestjs/common';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { Watcher } from '@crawler/watchers/models';
import { OnWatcher } from '../decorators';
import { LoggableProvider } from '@pereslavtsev/webarchiver-misc';
import { WorkersService } from '../services';

@Injectable()
export class WatcherListener extends LoggableProvider {
  constructor(
    @RootLogger() rootLogger: Bunyan,
    private readonly workersService: WorkersService,
  ) {
    super(rootLogger);
  }

  @OnWatcher.Active()
  async handleWatcherActiveEvent(watcher: Watcher): Promise<void> {
    // check if worker already exists
    const worker = this.workersService.findById(watcher.id);
    if (!!worker) {
      this.log.debug(`worker already exists, skipped`);
    }

    // if worker doesn't exists create that
    await this.workersService.create(watcher.id);
  }

  @OnWatcher.Paused()
  async handleWatcherPausedEvent(watcher: Watcher): Promise<void> {
    // check if worker already exists
    const worker = this.workersService.findById(watcher.id);
    if (!!worker) {
      this.log.debug(`worker already exists, skipped`);
    }

    await this.workersService.terminate(watcher.id);
  }

  @OnWatcher.Stopped()
  async handleWatcherStoppedEvent(watcher: Watcher): Promise<void> {
    // check if worker already exists
    const worker = this.workersService.findById(watcher.id);
    if (!!worker) {
      this.log.debug(`worker already exists, skipped`);
    }

    await this.workersService.terminate(watcher.id);
  }
}
