import { BeforeApplicationShutdown, Module } from '@nestjs/common';
import { WatchersService, WorkersService } from './services';
import { Watcher } from './models/watcher.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchersController } from './controllers';
import { WatcherListener, WorkerListener } from './listeners';

@Module({
  imports: [TypeOrmModule.forFeature([Watcher])],
  providers: [WatchersService, WatcherListener, WorkerListener, WorkersService],
  controllers: [WatchersController],
})
export class WatchersModule implements BeforeApplicationShutdown {
  constructor(
    private watchersService: WatchersService,
    private workersService: WorkersService,
  ) {}

  async beforeApplicationShutdown(): Promise<void> {
    await this.workersService.terminateAll();
    await this.watchersService.pauseAll();
  }
}
