import type { Watcher } from '../models';

export interface WatcherPayload {
  cmd: string;
  data?: unknown;
  watcherId: Watcher['id'];
}
