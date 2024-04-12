import { type JSONNode, type JSONRecord } from '@redneckz/json-op';
import path from 'path/posix';
import type { FileAPI, FilePath, FileQuery } from './api/FileAPI';
import { FileStorageAPI, type FileStorageOptions } from './api/FileStorageAPI';
import { FileSystemAPI } from './api/FileSystemAPI';
import { isFileExists } from './fs/isFileExists';
import { type TransformationOptions } from './transformJSONContent/TransformationOptions';
import { transformJSONDocContent } from './transformJSONContent/transformJSONDocContent';

export const PAGE_EXT = '.page.json';

export type Slug = string[];

export type ContentPageRepositoryOptions = TransformationOptions &
  FileStorageOptions & {
    pageExt?: string;
  };

export class ContentPageRepository implements FileAPI {
  public static readonly inst = new ContentPageRepository();

  get pageExt(): string {
    return this.options.pageExt ?? PAGE_EXT;
  }

  constructor(
    private readonly options: ContentPageRepositoryOptions = {
      contentDir: 'content',
      publicDir: 'public'
    },
    private readonly storageAPI = new FileStorageAPI(options)
  ) {}

  async listFiles(options: { dir?: string; ext?: string } & FileQuery): Promise<FilePath[]> {
    return (
      await Promise.allSettled([FileSystemAPI.inst.listFiles(options), this.storageAPI.listFiles(options)])
    ).flatMap(result => (result.status === 'fulfilled' ? result.value : []));
  }

  async countFiles(options: { dir?: string; ext?: string } & FileQuery): Promise<number> {
    return (await Promise.allSettled([FileSystemAPI.inst.countFiles(options), this.storageAPI.countFiles(options)]))
      .flatMap(result => (result.status === 'fulfilled' ? result.value : 0))
      .reduce((a, b) => a + b);
  }

  async readJSON<T extends JSONNode = JSONNode>(relativePath: FilePath): Promise<T> {
    const filePath = relativePath.startsWith(this.options.contentDir)
      ? relativePath
      : path.join(this.options.contentDir, relativePath);
    try {
      return isFileExists(filePath) ? FileSystemAPI.inst.readJSON(filePath) : this.storageAPI.readJSON(filePath);
    } catch (ex) {
      console.warn(ex instanceof Error ? ex.message : ex);
    }
    return {} as T;
  }

  async listAllSlugs(): Promise<Slug[]> {
    const contentFiles = await this.listFiles({ dir: this.options.contentDir, ext: this.pageExt });

    const isErrorPage = ([first, second, ...tail]: Slug) =>
      [first, second].some(_ => _ && /^\d+$/.test(_)) && tail.length === 0;

    return contentFiles.map(_ => this.toSlug(_)).filter(_ => !isErrorPage(_));
  }

  generatePage(slug: Slug, options?: Partial<TransformationOptions>): Promise<JSONRecord> {
    return transformJSONDocContent(this)(this.toFilePath(slug), { ...this.options, ...options });
  }

  toSlug(filePath: string): Slug {
    if (filePath.endsWith(this.pageExt)) {
      return this.toSlug(filePath.slice(0, -this.pageExt.length));
    }
    const [root, ...slug] = filePath.split('/').filter(Boolean);
    return root === this.options.contentDir ? slug : [root, ...slug];
  }

  toFilePath(slug: Slug): string {
    const pathname = path.join(this.options.contentDir, ...slug);
    const indexFilePath = path.join(pathname, `index${this.pageExt}`);
    return isFileExists(indexFilePath) ? indexFilePath : `${pathname}${this.pageExt}`;
  }
}
