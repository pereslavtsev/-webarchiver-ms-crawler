/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import Long from 'long';
import _m0 from 'protobufjs/minimal';
import { Observable } from 'rxjs';

export const protobufPackage = 'crawler';

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
}

export const CRAWLER_PACKAGE_NAME = 'crawler';

export interface WatchersServiceClient {
  getWatcher(request: GetWatcherRequest): Observable<Watcher>;

  createWatcher(request: CreateWatcherRequest): Observable<Watcher>;

  updateWatcher(request: UpdateWatcherRequest): Observable<Watcher>;
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
}

export function WatchersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getWatcher',
      'createWatcher',
      'updateWatcher',
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
