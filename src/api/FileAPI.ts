import { type JSONNode } from '@redneckz/json-op';

export type FilePath = string;
export interface ListFilesOptions {
  dir?: string;
  ext?: string;
  size?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface FileReaderAPI {
  readJSON<T extends JSONNode = JSONNode>(filePath: FilePath): Promise<T>;
}

export interface FileAPI extends FileReaderAPI {
  listFiles(options: ListFilesOptions): Promise<FilePath[]>;
  downloadFiles(options: ListFilesOptions): Promise<[FilePath, JSONNode][]>;
  countFiles(options: ListFilesOptions): Promise<number>;
}
