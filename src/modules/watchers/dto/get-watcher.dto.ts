import type { watchers } from '@pereslavtsev/webarchiver-protoc';
import { PickType } from '@nestjs/mapped-types';
import { Watcher } from '../models';

export class GetWatcherDto
  extends PickType(Watcher, ['id'] as const)
  implements watchers.GetWatcherRequest {}
