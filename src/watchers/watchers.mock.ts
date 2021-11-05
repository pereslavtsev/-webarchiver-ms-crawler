import { Watcher } from './models/watcher.model';

export const WATCHERS: Partial<Watcher>[] = [
  {
    id: '439d4ce4-7251-42d0-a946-cee44feecf31',
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
    id: '979fd06f-4c99-44a8-bc9f-fa737aee7c05',
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
    id: 'dabc9622-3ce3-494d-a1c4-8cc8f129d02c',
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
