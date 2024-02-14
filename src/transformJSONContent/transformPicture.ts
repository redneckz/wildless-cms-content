import { JSONPath, fp, type JSONRecord } from '@redneckz/json-op';
import path from 'path/posix';
import { isFileStorageId } from '../api/isFileStorageId';
import { type ImgSize } from './ImgSize';
import { entryValueTransform, type JSONEntryTransformPrecondition } from './JSONEntryTransform';
import { type Picture } from './Picture';
import { type TransformationOptions } from './TransformationOptions';
import { hasField } from './hasField';
import { isAttachment } from './isAttachment';
import { transformImg } from './transformImg';

export const IMAGE_EXT_LIST = ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heif', '.avif', '.svg'];

const isImgSource = (path: JSONPath.JSONPath) => path.includes('sources');
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

    const transformedImgPath = await transformImg(picture.src!, { ...options, ...picture });

    const containerSize: ImgSize = options.dryRun ? {} : await (await sharp())(transformedImgPath).metadata();

    const sources = picture.sources ?? [];
    const transformedSources = await Promise.all(
      sources.map(_ => transformImg(_.src!, { ...options, ..._, containerSize }))
    );

    const imgPathToSrc = (_: string) => path.join('/', path.relative(options.publicDir, _));
    const transformedPicture: JSONRecord = {
      ...(picture as JSONRecord),
      src: imgPathToSrc(transformedImgPath),
      sources: transformedSources.map((_, i) => ({
        ...(sources[i] as JSONRecord),
        src: imgPathToSrc(_)
      }))
    };

    return transformedPicture;
  });

const sharp = async () => (await import('sharp')).default;
