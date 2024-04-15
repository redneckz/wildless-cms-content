import { JSONNode } from '@redneckz/json-op';
import { trimStart } from '../utils/trimStart';
import { type FileReaderAPI } from './FileAPI';

export class FileFetcherAPI implements FileReaderAPI {
  constructor(private readonly baseURL: string) {}

  async readJSON<T extends JSONNode = JSONNode>(filePath: string): Promise<T> {
    const response = await fetch(`${this.baseURL}/${normalizeFilePath(filePath)}`);
    return response.json();
  }
}

const normalizeFilePath = trimStart('/');
