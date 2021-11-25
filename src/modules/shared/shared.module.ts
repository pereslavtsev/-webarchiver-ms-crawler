import {
  BeforeApplicationShutdown,
  Global,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { InjectBot, MwnModule } from 'nest-mwn';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MwnConfigService, TypeOrmConfigService } from './services';
import { LoggingModule } from '@eropple/nestjs-bunyan';
import { LOGGER } from './logger';
import * as config from './config';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { mwn } from 'mwn';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    LoggingModule.forRoot(LOGGER, {
      skipRequestInterceptor: true,
    }),
    ConfigModule.forRoot({
      load: [...Object.values(config)],
      isGlobal: true,
    }),
    MwnModule.forRootAsync({
      useClass: MwnConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  exports: [MwnModule, TypeOrmModule],
})
export class SharedModule implements OnModuleInit, BeforeApplicationShutdown {
  constructor(
    @InjectBot()
    private bot: mwn,
  ) {}

  async onModuleInit() {
    await this.bot.login();
  }

  async beforeApplicationShutdown() {
    await this.bot.logout();
  }
}
