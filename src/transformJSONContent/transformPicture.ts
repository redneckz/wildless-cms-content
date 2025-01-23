import path from 'node:path/posix';

import { JSONPath, fp, type JSONRecord } from '@redneckz/json-op';

import { isFileStorageId } from '../api/isFileStorageId';
import { entryValueTransform, type JSONEntryTransformPrecondition } from './JSONEntryTransform';
import { type Picture } from './Picture';
import { type TransformationOptions } from './TransformationOptions';
import { hasField } from './hasField';
import { isAttachment } from './isAttachment';
import { processImage } from './processImg';

export const IMAGE_EXT_LIST = ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heif', '.avif', '.svg'];

const isImgSource = (_: JSONPath.JSONPath) => _.includes('sources');
const isPicture = hasField('src', isAttachment(IMAGE_EXT_LIST));

export const precondition: JSONEntryTransformPrecondition = fp.Predicate.and(
  fp.t0(fp.Predicate.not(isImgSource)),
  fp.t1(isPicture)
);

export const transform = (options: TransformationOptions) =>
  entryValueTransform(async node => {
    if (!isPicture(node) || typeof node.src !== 'string' || isFileStorageId(node.src)) {
      return node;
    }

    const picture = node as Picture;

    const { output, containerSize } = await processImage(picture.src!, { ...options, ...picture });

    const sources = picture.sources ?? [];
    const transformedSources = await Promise.all(
      sources.filter(_ => _.src).map(_ => processImage(_.src!, { ...options, ..._, containerSize }))
    );

    const imgPathToSrc = (_: string) => path.join('/', path.relative(options.publicDir, _));
    const transformedPicture: JSONRecord = {
      ...(picture as JSONRecord),
      src: imgPathToSrc(output),
      sources: transformedSources.map((_, i) => ({
        ...(sources[i] as JSONRecord),
        src: imgPathToSrc(_.output)
      }))
    };

    return transformedPicture;
  });
