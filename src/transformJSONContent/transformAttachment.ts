import { JSONPath, fp } from '@redneckz/json-op';
import { getFileSize } from '../fs/getFileSize';
import { type JSONEntryTransform, type JSONEntryTransformPrecondition } from './JSONEntryTransform';
import { type TransformationOptions } from './TransformationOptions';
import { copyAttachment } from './copyAttachment';
import { isAttachment } from './isAttachment';

export const DOCUMENT_EXT_LIST = [
  '.txt',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.xlsb',
  '.ppt',
  '.pptx',
  '.pdf',
  '.zip',
  '.7z'
];

export const precondition: JSONEntryTransformPrecondition = fp.Predicate.and(
  fp.t0(JSONPath.endsWith(['src'])),
  fp.t1(isAttachment(DOCUMENT_EXT_LIST))
);

export const transform =
  (options: TransformationOptions): JSONEntryTransform =>
  async ([key, src]) =>
    src && typeof src === 'string'
      ? [
          [key, await copyAttachment(src, options)],
          [[...fp.init(key), 'fileSize'], await getFileSize(src)]
        ]
      : [[key, src]];
