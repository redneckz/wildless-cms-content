import { type JSONNode } from '@redneckz/json-op';

export type FilePath = string;

export interface FileAPI {
  listFiles(options: { dir?: string; ext?: string }): Promise<FilePath[]>;
  readJSON<T extends JSONNode = JSONNode>(filePath: FilePath): Promise<T>;
}
