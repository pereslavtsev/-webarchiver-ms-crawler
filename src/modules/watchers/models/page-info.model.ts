import type { ApiPage } from 'mwn';
import type { watchers } from '@pereslavtsev/webarchiver-protoc';
import { Expose } from 'class-transformer';

export class PageInfoModel implements ApiPage, watchers.PageInfo {
  readonly id: number;
  readonly ns: number;
  readonly title: string;
  readonly contentModel: string;
  readonly pageLanguage: string;
  readonly pageLanguageHtmlCode: string;
  readonly pageLanguageDir: string;
  readonly touched: string;
  readonly lastRevId: number;
  readonly length: number;
  readonly fullUrl: string;
  readonly editUrl: string;
  readonly canonicalUrl: string;

  @Expose({ name: 'pageId' })
  readonly pageid: number;
}
