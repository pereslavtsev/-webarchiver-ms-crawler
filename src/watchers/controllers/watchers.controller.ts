import { Controller } from '@nestjs/common';
import {
  CreateWatcherRequest,
  GetWatcherRequest,
  ListWatchersRequest,
  ListWatchersResponse,
  SubscribeWatcherResponse,
  UpdateWatcherRequest,
  Watcher,
  WatchersServiceController,
  WatchersServiceControllerMethods,
} from '@crawler/proto/watcher';
import { WatchersService } from '../services';
import { Metadata, ServerReadableStream } from '@grpc/grpc-js';
import { CoreProvider } from '@crawler/shared';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { Observable, Subject } from 'rxjs';

@Controller('watchers')
@WatchersServiceControllerMethods()
export class WatchersController
  extends CoreProvider
  implements WatchersServiceController
{
  private readonly subscriptions: Subject<SubscribeWatcherResponse>[];

  constructor(
    @RootLogger() rootLogger: Bunyan,
    private watchersService: WatchersService,
  ) {
    super(rootLogger);
  }

  subscribeWatcher(
    { id }: GetWatcherRequest,
    metadata?: Metadata,
    call?: ServerReadableStream<GetWatcherRequest, any>,
  ): Observable<SubscribeWatcherResponse> {
    const log = this.log.child({ reqId: metadata.get('x-correlation-id') });
    const subject = new Subject<SubscribeWatcherResponse>();
    log.debug(`subscribing on watcher ${id} from ${call.getPeer()}...`);
    const worker = this.watchersService.findWorker(id);
    call
      .on('end', () => console.log('end'))
      .on('close', () => {
        console.log('close');
        subject.complete();
      })
      .on('finish', () => {
        console.log('finish');
        subject.complete();
      });

    worker
      .on('message', ({ data }) => {
        const receivedPages = data?.query?.pages;
        if (receivedPages) {
          console.log(
            'receivedPages',
            receivedPages.map((page) => page.title)[0],
          );
          const pages = receivedPages.map((page) => ({
            id: page.pageid,
            title: page.title,
          }));
          subject.next({
            pages,
          });
        }
      })
      .on('exit', () => {
        subject.complete();
        this.log.debug(`stream has been finished`);
      });

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
}
