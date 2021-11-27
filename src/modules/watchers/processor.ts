import { NestFactory } from '@nestjs/core';
import { ApiParams, mwn } from 'mwn';
import { MwnConstants } from 'nest-mwn';
import { isMainThread, parentPort, workerData } from 'worker_threads';
import { SharedModule } from '@crawler/shared';
import { Watcher } from './models';
import { WatcherPayload } from './interfaces';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SharedModule);
  const bot = app.get<mwn>(MwnConstants.MWN_INSTANCE);
  const { id, initialQuery, continueQuery } = workerData.watcher as Watcher;
  const continuedQuery = {
    ...(initialQuery as ApiParams),
    ...continueQuery,
  };

  for await (const json of bot.continuedQueryGen(continuedQuery)) {
    parentPort.postMessage({
      cmd: 'data',
      watcherId: id,
      data: json,
    } as WatcherPayload);
  }

  await app.close();
}

if (!isMainThread) {
  bootstrap();
}
