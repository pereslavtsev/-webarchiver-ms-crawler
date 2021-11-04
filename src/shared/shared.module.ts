import { Global, Module } from '@nestjs/common';
import { MwnModule } from 'nest-mwn';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MwnConfigService, TypeOrmConfigService } from './services';
import { LoggingModule } from '@eropple/nestjs-bunyan';
import { LOGGER } from './logger';
import * as config from './config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    LoggingModule.forRoot(LOGGER, {}),
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
export class SharedModule {}
