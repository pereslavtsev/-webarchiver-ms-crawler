import type { watchers } from '@pereslavtsev/webarchiver-protoc';
import { PickType } from '@nestjs/mapped-types';
import { Watcher } from '../models';

export class UpdateWatcherDto
  extends PickType(Watcher, ['id', 'name'] as const)
  implements watchers.UpdateWatcherRequest {}
