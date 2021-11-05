/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import { Observable } from 'rxjs';

export const protobufPackage = 'webarchiver.crawler.v1';

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
  getWatcher(request: GetWatcherRequest): Observable<Watcher>;

  createWatcher(request: CreateWatcherRequest): Observable<Watcher>;

  updateWatcher(request: UpdateWatcherRequest): Observable<Watcher>;

  runWatcher(request: GetWatcherRequest): Observable<RunWatcherResponse>;

  pauseWatcher(request: GetWatcherRequest): Observable<PauseWatcherResponse>;

  stopWatcher(request: GetWatcherRequest): Observable<StopWatcherResponse>;
}

export interface WatchersServiceController {
  getWatcher(
    request: GetWatcherRequest,
  ): Promise<Watcher> | Observable<Watcher> | Watcher;

  createWatcher(
    request: CreateWatcherRequest,
  ): Promise<Watcher> | Observable<Watcher> | Watcher;

  updateWatcher(
    request: UpdateWatcherRequest,
  ): Promise<Watcher> | Observable<Watcher> | Watcher;

  runWatcher(
    request: GetWatcherRequest,
  ):
    | Promise<RunWatcherResponse>
    | Observable<RunWatcherResponse>
    | RunWatcherResponse;

  pauseWatcher(
    request: GetWatcherRequest,
  ):
    | Promise<PauseWatcherResponse>
    | Observable<PauseWatcherResponse>
    | PauseWatcherResponse;

  stopWatcher(
    request: GetWatcherRequest,
  ):
    | Promise<StopWatcherResponse>
    | Observable<StopWatcherResponse>
    | StopWatcherResponse;
}

export function WatchersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getWatcher',
      'createWatcher',
      'updateWatcher',
      'runWatcher',
      'pauseWatcher',
      'stopWatcher',
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
