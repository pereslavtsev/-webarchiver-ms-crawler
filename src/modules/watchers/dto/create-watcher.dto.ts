import type { watchers } from '@pereslavtsev/webarchiver-protoc';
import { PickType } from '@nestjs/mapped-types';
import { Watcher } from '../models';

export class CreateWatcherDto
  extends PickType(Watcher, ['name'] as const)
  implements watchers.CreateWatcherRequest
{
  readonly initialQuery: string;
}
