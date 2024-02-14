import { trimStart } from './trimStart';

const PROTO_SEPARATOR = '://';
export const FILE_PROTO = `file${PROTO_SEPARATOR}`;

export const isURL = (href: string | undefined): href is `${string}:${string}` =>
  Boolean(href?.includes(PROTO_SEPARATOR[0]));
export const isLocalFileURL = (href: string | undefined): href is `${typeof FILE_PROTO}${string}` =>
  Boolean(href?.startsWith(FILE_PROTO));

export const joinPath = (...path: (string | undefined | null)[]): string =>
  adjustProto(path.map(adjustPart).filter(Boolean).join('/'));

const adjustPart = (part: string | null | undefined): string => part?.replaceAll('/', '') ?? '';

const adjustProto = (url: string) => {
  const [proto, rest] = url.split(PROTO_SEPARATOR[0]);
  return proto && rest ? `${proto}${PROTO_SEPARATOR}${trimStart('/')(rest)}` : url;
};
