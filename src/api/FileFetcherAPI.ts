import { JSONNode } from '@redneckz/json-op';
import { trimStart } from '../utils/trimStart';
import { type FileReaderAPI } from './FileAPI';

export class FileFetcherAPI implements FileReaderAPI {
  constructor(private readonly baseURL: string) {}

  async readJSON<T extends JSONNode = JSONNode>(filePath: string): Promise<T> {
    const response = await fetch(`${this.baseURL}/${normalizeFilePath(filePath)}`);
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      throw new Error(`Failed to read "${filePath}"`);
    }
  }
}

const normalizeFilePath = trimStart('/');
