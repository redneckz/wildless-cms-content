import { type JSONNode } from '@redneckz/json-op';

export type FilePath = string;
export type FileQuery = Record<string, string>;

export interface FileAPI {
  listFiles(options: { dir?: string; ext?: string } & FileQuery): Promise<FilePath[]>;
  countFiles(options: { dir?: string; ext?: string } & FileQuery): Promise<number>;
  readJSON<T extends JSONNode = JSONNode>(filePath: FilePath): Promise<T>;
}
