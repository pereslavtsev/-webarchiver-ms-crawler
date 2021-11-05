import { Module, OnModuleInit } from '@nestjs/common';
import { WatchersModule } from './watchers';
import { InjectBot } from 'nest-mwn';
import { mwn } from 'mwn';
import { SharedModule } from './shared';

@Module({
  imports: [WatchersModule, SharedModule],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectBot()
    private bot: mwn,
  ) {}

  async onModuleInit() {
    await this.bot.login();
  }
}
