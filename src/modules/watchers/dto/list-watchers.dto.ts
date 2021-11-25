import type { watchers } from '@pereslavtsev/webarchiver-protoc';

export class ListWatchersDto implements watchers.ListWatchersRequest {
  readonly pageSize: number;
  readonly pageToken: string;
  readonly orderBy: string;
}
