import { type JSONNode } from '@redneckz/json-op';
import glob from 'glob';
import path from 'path/posix';
import { promisify } from 'util';
import { readJSON } from '../fs/readJSON';
import type { FileAPI, FilePath } from './FileAPI';

const find = promisify(glob);

export class FileSystemAPI implements FileAPI {
  public static readonly inst: FileAPI = new FileSystemAPI();

  async listFiles({ dir, ext }: { dir?: string; ext?: string }): Promise<FilePath[]> {
    const files: string[] = await find(`*${ext}`, { cwd: dir, matchBase: true });
    return files.map(_ => (dir ? path.join(dir, _) : _));
  }

  async readJSON<T extends JSONNode = JSONNode>(filePath: FilePath): Promise<T> {
    return readJSON(filePath);
  }
}
