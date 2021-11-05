import { Controller } from '@nestjs/common';
import {
  GetWatcherRequest,
  CreateWatcherRequest,
  Watcher,
  WatchersServiceController,
  WatchersServiceControllerMethods,
  UpdateWatcherRequest,
} from './watcher';
import { WatchersService } from '../services';

@Controller('watchers')
@WatchersServiceControllerMethods()
export class WatchersController implements WatchersServiceController {
  constructor(private watchersService: WatchersService) {}

  createWatcher({ name }: CreateWatcherRequest): Promise<Watcher> {
    return this.watchersService.create(name, {});
  }

  getWatcher({ id }: GetWatcherRequest): Promise<Watcher> {
    return this.watchersService.findById(id);
  }

  updateWatcher({ id, ...data }: UpdateWatcherRequest): Promise<Watcher> {
    return this.watchersService.update(id, data);
  }

  runWatcher({ id }: GetWatcherRequest): Promise<void> {
    return this.watchersService.run(id);
  }

  stopWatcher({ id }: GetWatcherRequest): Promise<void> {
    return this.watchersService.stop(id);
  }

  pauseWatcher({ id }: GetWatcherRequest): Promise<void> {
    return this.watchersService.pause(id);
  }
}
