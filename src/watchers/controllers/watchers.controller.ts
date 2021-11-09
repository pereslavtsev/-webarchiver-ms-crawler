import { Controller } from '@nestjs/common';
import {
  CreateWatcherRequest,
  GetWatcherRequest,
  ListWatchersRequest,
  ListWatchersResponse,
  PageInfo,
  SubscribeWatcherResponse,
  PauseAllRequest,
  PauseAllResponse,
  UpdateWatcherRequest,
  Watcher,
  WatchersServiceController,
  WatchersServiceControllerMethods,
} from '@webarchiver/protoc/dist/crawler';
import { WatchersService } from '../services';
import type { Metadata, ServerReadableStream } from '@grpc/grpc-js';
import { CoreProvider } from '@crawler/shared';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { Observable, Subject } from 'rxjs';
import { OnEvent } from '@nestjs/event-emitter';
import type { ApiPage, ApiResponse } from 'mwn';

@Controller('watchers')
@WatchersServiceControllerMethods()
export class WatchersController
  extends CoreProvider
  implements WatchersServiceController
{
  protected readonly subscriptions: Map<
    Watcher['id'],
    Subject<SubscribeWatcherResponse>
  > = new Map();

  constructor(
    @RootLogger() rootLogger: Bunyan,
    private watchersService: WatchersService,
  ) {
    super(rootLogger);
  }

  @OnEvent('watcher.data')
  async handleWatcherData({
    watcher,
    data,
  }: {
    watcher: Watcher;
    data: ApiResponse;
  }): Promise<void> {
    const receivedPages = data?.query?.pages as ApiPage[];

    if (!this.subscriptions.has(watcher.id)) {
      return;
    }

    const subject = this.subscriptions.get(watcher.id);
    const pages = receivedPages.map<PageInfo>((page) => ({
      id: page.pageid,
      ns: page.ns,
      title: page.title,
      contentModel: page['contentmodel'],
      pageLanguage: page['pagelanguage'],
      pageLanguageHtmlCode: page['pagelanguagehtmlcode'],
      pageLanguageDir: page['pagelanguagedir'],
      touched: page['touched'],
      lastRevId: page['lastrevid'],
      length: page['length'],
      fullUrl: page['fullurl'],
      editUrl: page['editurl'],
      canonicalUrl: page['canonicalurl'],
    }));
    subject.next({ pages });
  }

  subscribeWatcher(
    { id }: GetWatcherRequest,
    metadata?: Metadata,
    call?: ServerReadableStream<GetWatcherRequest, any>,
  ): Observable<SubscribeWatcherResponse> {
    const log = this.log.child({ reqId: metadata.get('x-correlation-id') });
    log.debug(`subscribing on watcher ${id} from ${call.getPeer()}...`);

    call
      .on('end', () => console.log('end'))
      .on('close', () => console.log('close'))
      .on('finish', () => console.log('finish'));

    if (!this.subscriptions.has(id)) {
      const subject = new Subject<SubscribeWatcherResponse>();
      this.subscriptions.set(id, subject);
    }

    const subject = this.subscriptions.get(id);
    return subject.asObservable();
  }

  async listWatchers(
    { pageSize, pageToken, orderBy }: ListWatchersRequest,
    metadata?: Metadata,
  ): Promise<ListWatchersResponse> {
    try {
      const { data, cursor } = await this.watchersService.findAll({
        pageSize,
        pageToken,
        orderBy,
      });
      return {
        data,
        nextPageToken: cursor.afterCursor,
      };
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  createWatcher(
    { name }: CreateWatcherRequest,
    metadata: Metadata,
  ): Promise<Watcher> {
    try {
      return this.watchersService.create(name, {});
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async getWatcher(
    { id }: GetWatcherRequest,
    metadata: Metadata,
  ): Promise<Watcher> {
    try {
      return await this.watchersService.findById(id);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async updateWatcher(
    { id, ...data }: UpdateWatcherRequest,
    metadata: Metadata,
  ): Promise<Watcher> {
    try {
      return await this.watchersService.update(id, data);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async runWatcher(
    { id }: GetWatcherRequest,
    metadata: Metadata,
  ): Promise<void> {
    try {
      return await this.watchersService.run(id);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async stopWatcher(
    { id }: GetWatcherRequest,
    metadata: Metadata,
  ): Promise<void> {
    try {
      return await this.watchersService.stop(id);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  async pauseWatcher(
    { id }: GetWatcherRequest,
    metadata: Metadata,
  ): Promise<void> {
    try {
      return this.watchersService.pause(id);
    } catch (error) {
      this.exceptionFilter(error, metadata);
    }
  }

  pauseAll(
    request: PauseAllRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<PauseAllResponse> {
    return [] as any;
  }
}
