import fs from 'fs';
import path from 'path/posix';
import util from 'util';

const mkdir = util.promisify(fs.mkdir);
const copy = util.promisify(fs.copyFile);

export async function copyFile(input: string, output: string) {
  await mkdir(path.dirname(output), { recursive: true });
  await copy(input, output);
}
