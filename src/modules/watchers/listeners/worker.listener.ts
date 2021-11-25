import { Injectable } from '@nestjs/common';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { WatchersService } from '../services';
import { Watcher } from '@crawler/watchers/models';
import type { ApiPage, ApiResponse } from 'mwn';
import colorizeJson from 'json-colorizer';
import { OnWorker } from '../decorators';
import { LoggableProvider } from '@pereslavtsev/webarchiver-misc';

@Injectable()
export class WorkerListener extends LoggableProvider {
  constructor(
    @RootLogger() rootLogger: Bunyan,
    private readonly watchersService: WatchersService,
  ) {
    super(rootLogger);
  }

  /**
   * Emitted when the watcher thread has started
   */
  @OnWorker.Started()
  async handleWatcherStared(payload: { watcher: Watcher }): Promise<void> {
    const { watcher } = payload;
    this.log.debug(
      `watcher ${watcher.name} has been started with query`,
      colorizeJson(JSON.stringify(watcher.initialQuery)),
    );
    await this.watchersService.active(watcher.id);
  }

  @OnWorker.Finished()
  async handleWatcherFinished(payload): Promise<void> {
    const { watcher } = payload;
    this.log.debug(`watcher ${watcher.name} was finished`);
    await this.watchersService.pause(watcher.id);
  }

  @OnWorker.Failed()
  async handleWatcherFailed(error: Error, payload): Promise<void> {
    const { watcher } = payload;
    this.log.error(error, `watcher ${watcher.name} was failed`);
    await this.watchersService.stop(watcher.id);
  }

  @OnWorker.Data()
  async handleWatcherData(payload: {
    watcher: Watcher;
    data: ApiResponse;
  }): Promise<void> {
    const { watcher, data } = payload;
    const [first, ...pages] = data.query.pages as ApiPage[];
    const [last] = pages.slice().reverse();

    this.log.debug(
      `${data.query.pages.length} pages received for watcher ${watcher.name} (${first.title} - ${last.title})`,
    );

    await this.watchersService.setContinueQuery(
      watcher.id,
      data.continue ?? null,
    );
  }
}
