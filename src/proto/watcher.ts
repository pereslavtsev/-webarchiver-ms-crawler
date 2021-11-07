/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export const protobufPackage = 'webarchiver.crawler.v1';

export interface PageInfo {
  id: number;
  ns: number;
  title: string;
  contentModel: string;
  pageLanguage: string;
  pageLanguageHtmlCode: string;
  pageLanguageDir: string;
  touched: string;
  lastRevId: number;
  length: number;
  fullUrl: string;
  editUrl: string;
  canonicalUrl: string;
}

export interface SubscribeWatcherResponse {
  pages: PageInfo[];
}

export interface ListWatchersRequest {
  pageSize: number;
  pageToken: string;
  orderBy: string;
}

export interface ListWatchersResponse {
  data: Watcher[];
  nextPageToken: string;
}

export interface RunWatcherResponse {}

export interface PauseWatcherResponse {}

export interface StopWatcherResponse {}

export interface GetWatcherRequest {
  id: string;
}

export interface CreateWatcherRequest {
  id: string;
  name: string;
}

export interface UpdateWatcherRequest {
  id: string;
  name: string;
}

export interface Watcher {
  id: string;
  name: string;
  active: boolean;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
}

export const WEBARCHIVER_CRAWLER_V1_PACKAGE_NAME = 'webarchiver.crawler.v1';

export interface WatchersServiceClient {
  listWatchers(
    request: ListWatchersRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<ListWatchersResponse>;

  getWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<Watcher>;

  createWatcher(
    request: CreateWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<Watcher>;

  updateWatcher(
    request: UpdateWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<Watcher>;

  runWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<RunWatcherResponse>;

  pauseWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<PauseWatcherResponse>;

  stopWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<StopWatcherResponse>;

  subscribeWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<SubscribeWatcherResponse>;
}

export interface WatchersServiceController {
  listWatchers(
    request: ListWatchersRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<ListWatchersResponse>
    | Observable<ListWatchersResponse>
    | ListWatchersResponse;

  getWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<Watcher> | Observable<Watcher> | Watcher;

  createWatcher(
    request: CreateWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<Watcher> | Observable<Watcher> | Watcher;

  updateWatcher(
    request: UpdateWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<Watcher> | Observable<Watcher> | Watcher;

  runWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<RunWatcherResponse>
    | Observable<RunWatcherResponse>
    | RunWatcherResponse;

  pauseWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<PauseWatcherResponse>
    | Observable<PauseWatcherResponse>
    | PauseWatcherResponse;

  stopWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<StopWatcherResponse>
    | Observable<StopWatcherResponse>
    | StopWatcherResponse;

  subscribeWatcher(
    request: GetWatcherRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<SubscribeWatcherResponse>;
}

export function WatchersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'listWatchers',
      'getWatcher',
      'createWatcher',
      'updateWatcher',
      'runWatcher',
      'pauseWatcher',
      'stopWatcher',
      'subscribeWatcher',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('WatchersService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('WatchersService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const WATCHERS_SERVICE_NAME = 'WatchersService';

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
