import { Injectable } from '@nestjs/common';
import { CoreProvider } from '@crawler/shared';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { WatchersService } from './services';
import { OnEvent } from '@nestjs/event-emitter';
import { Watcher } from '@crawler/watchers/models';
import type { ApiPage, ApiResponse } from 'mwn';
import colorizeJson from 'json-colorizer';

@Injectable()
export class WatchersListener extends CoreProvider {
  constructor(
    @RootLogger() rootLogger: Bunyan,
    private readonly watchersService: WatchersService,
  ) {
    super(rootLogger);
  }

  /**
   * Emitted when the watcher thread has started
   */
  @OnEvent('watcher.started')
  async handleWatcherStared(payload: { watcher: Watcher }): Promise<void> {
    const { watcher } = payload;
    this.log.debug(
      `watcher ${watcher.name} has been started with query`,
      colorizeJson(JSON.stringify(watcher.query)),
    );
    await this.watchersService.setActive(watcher.id);
  }

  @OnEvent('watcher.finished')
  async handleWatcherFinished(payload): Promise<void> {
    const { watcher } = payload;
    this.log.debug(`watcher ${watcher.name} was finished`);
    await this.watchersService.setInactive(watcher.id);
  }

  @OnEvent('watcher.failed')
  async handleWatcherFailed(error: Error, payload): Promise<void> {
    const { watcher } = payload;
    this.log.error(error, `watcher ${watcher.name} was failed`);
    await this.watchersService.setInactive(watcher.id);
  }

  @OnEvent('watcher.data')
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
