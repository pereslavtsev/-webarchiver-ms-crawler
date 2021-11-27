import type { ApiPage } from 'mwn';
import type { watchers } from '@pereslavtsev/webarchiver-protoc';
import { Expose } from 'class-transformer';
import { TransformDate } from '@crawler/shared';

export class PageInfo implements Omit<ApiPage, 'pageid'>, watchers.PageInfo {
  @Expose({ name: 'pageid' })
  readonly id: ApiPage['pageid'];

  readonly ns: number;

  readonly title: string;

  @Expose({ name: 'contentmodel', groups: ['mediawiki'] })
  readonly contentModel: string;

  @Expose({ name: 'pagelanguage', groups: ['mediawiki'] })
  readonly pageLanguage: string;

  @Expose({ name: 'pagelanguagehtmlcode', groups: ['mediawiki'] })
  readonly pageLanguageHtmlCode: string;

  @Expose({ name: 'pagelanguagedir', groups: ['mediawiki'] })
  readonly pageLanguageDir: string;

  @Expose({ name: 'touched', groups: ['mediawiki'] })
  @TransformDate()
  readonly touchedAt: Date;

  @Expose({ name: 'lastrevid', groups: ['mediawiki'] })
  readonly lastRevId: number;

  readonly length: number;

  @Expose({ name: 'fullurl', groups: ['mediawiki'] })
  readonly fullUrl: string;

  @Expose({ name: 'editurl', groups: ['mediawiki'] })
  readonly editUrl: string;

  @Expose({ name: 'canonicalurl', groups: ['mediawiki'] })
  readonly canonicalUrl: string;
}
