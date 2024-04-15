import { type JSONNode } from '@redneckz/json-op';
import type { FileAPI, FilePath, ListFilesOptions } from './FileAPI';

const API_BASE_PATH = '/api/v1/wcms-file-storage';

export interface FileMeta {
  publicId: string;
  revision: number;
  name: string;
}

export interface FileMetaWithJSON extends FileMeta {
  json?: string;
}

export interface FileStorageOptions {
  projectId?: string;
  baseURL?: string;
  fetch?: typeof fetch;
}

export class FileStorageAPI implements FileAPI {
  get projectId(): string {
    return this.options.projectId ?? '';
  }

  get baseURL(): string {
    return this.options.baseURL ?? '';
  }

  constructor(private readonly options: FileStorageOptions = {}) {}

  async listFiles(options: ListFilesOptions): Promise<FilePath[]> {
    if (!this.projectId) {
      return [];
    }

    return (await this.fetchAllProjectDocs(options)).map(({ publicId, name }) => name || publicId);
  }

  async downloadFiles(options: ListFilesOptions): Promise<[FilePath, JSONNode][]> {
    if (!this.projectId) {
      return [];
    }

    return (await this.fetchAllProjectDocs({ ...options, expanded: true })).map(({ publicId, name, json }) => [
      name || publicId,
      json ? JSON.parse(json) : null
    ]);
  }

  async countFiles(options: ListFilesOptions): Promise<number> {
    const params = this.computeDocQueryParams(options);
    const response = await (this.options.fetch ?? globalThis.fetch)(
      `${this.baseURL}${API_BASE_PATH}/projects/${this.projectId}/docs?${params}`,
      { method: 'HEAD' }
    );
    return parseInt(response.headers.get('X-Total-Count') ?? '0', 10);
  }

  async readJSON<T extends JSONNode = JSONNode>(filePath: FilePath): Promise<T> {
    if (!this.projectId) {
      return {} as T;
    }

    const response = await (this.options.fetch ?? globalThis.fetch)(
      `${this.baseURL}${API_BASE_PATH}/projects/${this.projectId}/files/${encodeURIComponent(filePath)}`
    );
    return (await response.json()) as T;
  }

  private async fetchAllProjectDocs(options: ListFilesOptions = {}): Promise<FileMetaWithJSON[]> {
    let pageItems: FileMeta[] = [];
    let results: FileMeta[] = [];
    do {
      const prevRevision = pageItems.length ? pageItems[pageItems.length - 1].revision : 0;
      pageItems = await this.fetchProjectDocs(options, prevRevision);
      results = results.concat(pageItems);
    } while (pageItems.length > 0 && !options.size);
    return results;
  }

  private async fetchProjectDocs(options: ListFilesOptions = {}, fromRevision = 0): Promise<FileMetaWithJSON[]> {
    const params = this.computeDocQueryParams(options, fromRevision);
    const response = await (this.options.fetch ?? globalThis.fetch)(
      `${this.baseURL}${API_BASE_PATH}/projects/${this.projectId}/docs?${params}`
    );
    return parseNDJSON(await response.text());
  }

  private computeDocQueryParams(
    { dir, ext, size, ...query }: ListFilesOptions = {},
    fromRevision = 0
  ): URLSearchParams {
    return new URLSearchParams({
      ...(dir ? { dir } : {}),
      ...(ext ? { ext } : {}),
      ...(size ? { size: String(size) } : {}),
      from: String(fromRevision ?? 0),
      ...query
    });
  }
}

const parseNDJSON = <T>(_: string): T[] =>
  _.split('\n')
    .filter(Boolean)
    .map(_ => JSON.parse(_));
