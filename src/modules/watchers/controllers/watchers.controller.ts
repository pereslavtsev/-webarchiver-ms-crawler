import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { watchers } from '@pereslavtsev/webarchiver-protoc';
import { WatchersService } from '../services';
import { Bunyan, RootLogger } from '@eropple/nestjs-bunyan';
import { Observable, Subject } from 'rxjs';
import type { ApiPage, ApiResponse } from 'mwn';
import { OnWorker } from '../decorators';
import { Watcher } from '../models';
import { LoggableProvider } from '@pereslavtsev/webarchiver-misc';
import {
  CreateWatcherDto,
  GetWatcherDto,
  ListWatchersDto,
  UpdateWatcherDto,
} from '../dto';

const { WatchersServiceControllerMethods } = watchers;

type SubscriptionsMap = Map<
  Watcher['id'],
  Subject<watchers.WatcherStreamResponse>
>;

@Controller('watchers')
@WatchersServiceControllerMethods()
export class WatchersController
  extends LoggableProvider
  implements watchers.WatchersServiceController
{
  protected readonly subscriptions: SubscriptionsMap = new Map();

  constructor(
    @RootLogger() rootLogger: Bunyan,
    private watchersService: WatchersService,
  ) {
    super(rootLogger);
  }

  @OnWorker.Data()
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
    const pages = receivedPages.map<watchers.PageInfo>((page) => ({
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

  @UsePipes(new ValidationPipe())
  watcherStream({
    id,
  }: GetWatcherDto): Observable<watchers.WatcherStreamResponse> {
    if (!this.subscriptions.has(id)) {
      const subject = new Subject<watchers.WatcherStreamResponse>();
      this.subscriptions.set(id, subject);
    }

    const subject = this.subscriptions.get(id);
    return subject.asObservable();
  }

  @UsePipes(new ValidationPipe())
  async listWatchers({
    pageSize,
    pageToken,
    orderBy,
  }: ListWatchersDto): Promise<watchers.ListWatchersResponse> {
    const { data, cursor } = await this.watchersService.findAll({
      pageSize,
      pageToken,
      orderBy,
    });
    return {
      data,
      nextPageToken: cursor.afterCursor,
    };
  }

  @UsePipes(new ValidationPipe())
  createWatcher({ name, initialQuery }: CreateWatcherDto): Promise<Watcher> {
    return this.watchersService.create(name, initialQuery);
  }

  @UsePipes(new ValidationPipe())
  getWatcher({ id }: GetWatcherDto): Promise<Watcher> {
    return this.watchersService.findById(id);
  }

  @UsePipes(new ValidationPipe())
  updateWatcher({ id, ...data }: UpdateWatcherDto): Promise<Watcher> {
    return this.watchersService.updateById(id, data);
  }

  @UsePipes(new ValidationPipe())
  runWatcher({ id }: GetWatcherDto): Promise<Watcher> {
    return this.watchersService.active(id);
  }

  @UsePipes(new ValidationPipe())
  stopWatcher({ id }: GetWatcherDto): Promise<Watcher> {
    return this.watchersService.stop(id);
  }

  @UsePipes(new ValidationPipe())
  pauseWatcher({ id }: GetWatcherDto): Promise<Watcher> {
    return this.watchersService.pause(id);
  }

  @UsePipes(new ValidationPipe())
  pauseAllWatchers(): Promise<watchers.PauseAllWatchersResponse> {
    // TODO: !
    return [] as any;
  }
}
