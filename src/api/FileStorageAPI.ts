import { type JSONNode } from '@redneckz/json-op';
import type { FileAPI, FilePath } from './FileAPI';

const API_BASE_PATH = '/api/v1/wcms-file-storage';

export interface FileMeta {
  publicId: string;
  revision: number;
  name: string;
}

export interface FileStorageOptions {
  projectId?: string;
  baseURL?: string;
}

export class FileStorageAPI implements FileAPI {
  get projectId(): string {
    return this.options.projectId ?? '';
  }

  get baseURL(): string {
    return this.options.baseURL ?? '';
  }

  constructor(private readonly options: FileStorageOptions = {}) {}

  async listFiles(options: { dir?: string; ext?: string }): Promise<FilePath[]> {
    if (!this.projectId) {
      return [];
    }

    let pageItems: FileMeta[] = [];
    let items: FileMeta[] = [];
    do {
      const maxRevision = pageItems.length ? pageItems[pageItems.length - 1].revision : 0;
      pageItems = await this.fetchProjectDocs(options, maxRevision);
      items = items.concat(pageItems);
    } while (pageItems.length > 0);
    return items.map(({ publicId, name }) => name || publicId);
  }

  async readJSON<T extends JSONNode = JSONNode>(filePath: FilePath): Promise<T> {
    if (!this.projectId) {
      return {} as T;
    }

    const response = await fetch(
      `${this.baseURL}${API_BASE_PATH}/project/${this.projectId}/file/${encodeURIComponent(filePath)}`
    );
    return (await response.json()) as T;
  }

  private async fetchProjectDocs({ dir, ext }: { dir?: string; ext?: string } = {}, from = 0): Promise<FileMeta[]> {
    const params = new URLSearchParams({
      ...(dir ? { dir } : {}),
      ...(ext ? { ext } : {}),
      from: String(from ?? 0)
    });
    const response = await fetch(`${this.baseURL}${API_BASE_PATH}/project/${this.projectId}/doc?${params}`);
    return parseNDJSON(await response.text());
  }
}

const parseNDJSON = <T>(_: string): T[] =>
  _.split('\n')
    .filter(Boolean)
    .map(_ => JSON.parse(_));
