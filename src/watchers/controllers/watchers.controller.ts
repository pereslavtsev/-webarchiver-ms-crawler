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
    console.log(5435435)
    return this.watchersService.findById(id);
  }

  updateWatcher({ id, ...data }: UpdateWatcherRequest): Promise<Watcher> {
    return this.watchersService.update(id, data);
  }
}
