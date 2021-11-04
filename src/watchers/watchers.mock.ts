import { Watcher } from './models/watcher.model';

export const WATCHERS: Partial<Watcher>[] = [
  {
    name: 'test_cat',
    query: {
      action: 'query',
      generator: 'categorymembers',
      gcmlimit: 'max',
      gcmtitle: 'Категория:Программное обеспечение по алфавиту',
      gcmnamespace: 0,
      prop: 'revisions',
      rvslots: 'main',
      rvprop: ['ids', 'content'],
    },
  },
  {
    name: 'cite-web watcher',
    query: {
      action: 'query',
      titles: 'Шаблон:cite web',
      generator: 'transcludedin',
      //gtilimit: '10',
      gtinamespace: 0,
      prop: 'revisions',
      rvslots: 'main',
      rvprop: ['ids', 'content'],
    },
  },
  {
    name: 'cite-news watcher',
    query: {
      action: 'query',
      titles: 'Шаблон:cite news',
      generator: 'transcludedin',
      //gtilimit: '10',
      gtinamespace: 0,
      prop: 'revisions',
      rvslots: 'main',
      rvprop: ['ids', 'content'],
    },
  },
];
