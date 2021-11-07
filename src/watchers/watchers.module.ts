import { Module, OnModuleInit } from '@nestjs/common';
import { WatchersService } from './services';
import { Watcher } from './models/watcher.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WATCHERS } from './watchers.mock';
import { WatchersController } from './controllers';
import { WatchersListener } from './watchers.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Watcher])],
  providers: [WatchersService, WatchersListener],
  controllers: [WatchersController],
})
export class WatchersModule implements OnModuleInit {
  constructor(private watchersService: WatchersService) {}

  async onModuleInit() {
    // const [citeWebWatcher, citeNews] = await Promise.all(
    //   WATCHERS.map((watcher) =>
    //     this.watchersService.create(watcher.name, watcher.query),
    //   ),
    // );
    // console.log('citeWebWatcher', citeWebWatcher);
    // await this.watchersService.run(citeWebWatcher.id);
    // //await this.watchersService.run(citeNews.id);
    // setTimeout(async () => {
    //   await this.watchersService.pause(citeWebWatcher.id);
    //   console.log('stopped');
    //   await this.watchersService.run(citeWebWatcher.id);
    // }, 10000);
  }
}
