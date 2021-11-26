import { Watcher } from './models/watcher.model';
import { categoryMembersQuery, includeInQuery } from './api.helpers';

export const WATCHERS: Partial<Watcher>[] = [
  {
    name: 'test_cat',
    initialQuery: categoryMembersQuery('Программное обеспечение по алфавиту'),
  },
  {
    name: 'cite-web watcher',
    initialQuery: includeInQuery('cite web'),
  },
  {
    name: 'cite-news watcher',
    initialQuery: includeInQuery('cite news'),
  },
];
