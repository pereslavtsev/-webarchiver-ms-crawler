import { Controller } from '@nestjs/common';
import {
  GetWatcherRequest,
  CreateWatcherRequest,
  Watcher,
  WatchersServiceController,
  WatchersServiceControllerMethods,
  UpdateWatcherRequest,
} from '@crawler/proto/watcher';
import { WatchersService } from '../services';
import { Metadata } from '@grpc/grpc-js';
import { CoreProvider } from '@crawler/shared';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';

@Controller('watchers')
@WatchersServiceControllerMethods()
export class WatchersController
  extends CoreProvider
  implements WatchersServiceController
{
  constructor(
    @RootLogger() rootLogger: Bunyan,
    private watchersService: WatchersService,
  ) {
    super(rootLogger);
  }

  createWatcher({ name }: CreateWatcherRequest): Promise<Watcher> {
    return this.watchersService.create(name, {});
  }

  async getWatcher(
    { id }: GetWatcherRequest,
    metadata: Metadata,
  ): Promise<Watcher> {
    try {
      return await this.watchersService.findById(id);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async updateWatcher(
    { id, ...data }: UpdateWatcherRequest,
    metadata: Metadata,
  ): Promise<Watcher> {
    try {
      return await this.watchersService.update(id, data);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async runWatcher(
    { id }: GetWatcherRequest,
    metadata: Metadata,
  ): Promise<void> {
    try {
      return await this.watchersService.run(id);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async stopWatcher(
    { id }: GetWatcherRequest,
    metadata: Metadata,
  ): Promise<void> {
    try {
      return await this.watchersService.stop(id);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async pauseWatcher(
    { id }: GetWatcherRequest,
    metadata: Metadata,
  ): Promise<void> {
    try {
      return this.watchersService.pause(id);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }
}
