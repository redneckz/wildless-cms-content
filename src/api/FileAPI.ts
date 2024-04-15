import { type JSONNode } from '@redneckz/json-op';

export type FilePath = string;
export type FileQuery = Record<string, string>;
export type ListFilesOptions = { dir?: string; ext?: string } & FileQuery;

export interface FileAPI {
  listFiles(options: ListFilesOptions): Promise<FilePath[]>;
  downloadFiles(options: ListFilesOptions): Promise<[FilePath, JSONNode][]>;
  countFiles(options: ListFilesOptions): Promise<number>;
  readJSON<T extends JSONNode = JSONNode>(filePath: FilePath): Promise<T>;
}
