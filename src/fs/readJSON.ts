import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);

export const readJSON = async (src: string) => JSON.parse(await readFile(src, 'utf-8'));
