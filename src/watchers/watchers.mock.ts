import { Watcher } from './models/watcher.model';
import { categoryMembersQuery, includeInQuery } from './api.helpers';

export const WATCHERS: Partial<Watcher>[] = [
  {
    name: 'test_cat',
    query: categoryMembersQuery('Программное обеспечение по алфавиту'),
  },
  {
    name: 'cite-web watcher',
    query: includeInQuery('cite web'),
  },
  {
    name: 'cite-news watcher',
    query: includeInQuery('cite news'),
  },
];
