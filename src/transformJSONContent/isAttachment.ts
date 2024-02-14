import { isString } from '@redneckz/json-op';
import { isLocalFileURL, isURL } from '../utils/url';

export const isAttachment =
  (exts: string[] = []) =>
  (src: unknown) =>
    isLocalPath(src) && (!exts.length || exts.some(ext => src.toLowerCase().endsWith(ext)));

const isLocalPath = (_: unknown): _ is string =>
  Boolean(_ && isString(_) && _.length < 1024 && (!isURL(_) || isLocalFileURL(_)));
