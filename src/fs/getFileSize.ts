import fs from 'fs';
import util from 'util';

const stat = util.promisify(fs.stat);

export async function getFileSize(_: string): Promise<number> {
  try {
    return (await stat(_)).size;
  } catch (ex) {
    return 0;
  }
}
