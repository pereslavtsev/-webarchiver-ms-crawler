import { Module } from '@nestjs/common';
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
export class WatchersModule {}
