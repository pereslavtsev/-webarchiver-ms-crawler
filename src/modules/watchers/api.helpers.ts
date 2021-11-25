import type { ApiParams } from 'mwn';

export function categoryMembersQuery(categoryName: string): ApiParams {
  return {
    action: 'query',
    generator: 'categorymembers',
    gcmlimit: 'max',
    gcmtitle: `Категория:${categoryName}`,
    gcmnamespace: 0,
    prop: 'info',
    inprop: ['url'],
  };
}

export function includeInQuery(templateName: string): ApiParams {
  return {
    action: 'query',
    titles: `Шаблон:${templateName}`,
    generator: 'transcludedin',
    prop: 'info',
    inprop: ['url'],
  };
}
