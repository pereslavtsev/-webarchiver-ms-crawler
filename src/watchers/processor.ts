import { NestFactory } from '@nestjs/core';
import { mwn } from 'mwn';
import { MwnConstants } from 'nest-mwn';
import { isMainThread, parentPort, workerData } from 'worker_threads';
import { SharedModule } from '@crawler/shared';
import { Watcher } from './models/watcher.model';
import { WatcherPayload } from './interfaces';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SharedModule);
  const bot = app.get<mwn>(MwnConstants.MWN_INSTANCE);
  const { id, query, ...watcher } = workerData.watcher as Watcher;
  const continuedQuery = {
    ...query,
    ...watcher.continue,
  };

  for await (const json of bot.continuedQueryGen(continuedQuery)) {
    parentPort.postMessage({
      cmd: 'data',
      watcherId: id,
      data: json,
    } as WatcherPayload);
  }
  parentPort.postMessage({
    cmd: 'finished',
    watcherId: id,
  } as WatcherPayload);
}

if (!isMainThread) {
  bootstrap();
}
