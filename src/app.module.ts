import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WatchersModule } from './watchers/watchers.module';
import { InjectBot } from 'nest-mwn';
import { mwn } from 'mwn';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, WatchersModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
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
