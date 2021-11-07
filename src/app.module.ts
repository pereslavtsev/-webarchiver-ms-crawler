import { Module } from '@nestjs/common';
import { WatchersModule } from './watchers';
import { SharedModule } from './shared';

@Module({
  imports: [WatchersModule, SharedModule],
})
export class AppModule {}
