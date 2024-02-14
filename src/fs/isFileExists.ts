import fs from 'fs';

export function isFileExists(_: string) {
  try {
    return fs.statSync(_).isFile();
  } catch (ex) {
    return false;
  }
}
