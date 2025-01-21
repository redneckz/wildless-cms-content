import { JSONPath, fp, type JSONRecord } from '@redneckz/json-op';
import { fork } from 'child_process';
import { dirname } from 'path';
import path from 'path/posix';
import { fileURLToPath } from 'url';
import { isFileStorageId } from '../api/isFileStorageId';
import { entryValueTransform, type JSONEntryTransformPrecondition } from './JSONEntryTransform';
import { type Picture } from './Picture';
import { type TransformationOptions } from './TransformationOptions';
import { hasField } from './hasField';
import { isAttachment } from './isAttachment';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const IMAGE_EXT_LIST = ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heif', '.avif', '.svg'];

const isImgSource = (path: JSONPath.JSONPath) => path.includes('sources');
const isPicture = hasField('src', isAttachment(IMAGE_EXT_LIST));

interface ImageProcessorResponse {
  success: boolean;
  output?: string;
  error?: string;
}

async function processImageInChild(src: string, output: string, options: TransformationOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = fork(path.resolve(__dirname, './imageProcessor.js'));

    child.on('message', (message: ImageProcessorResponse) => {
      if (message.success) {
        resolve();
      } else {
        reject(new Error(message.error));
      }
    });

    child.on('error', reject);

    child.send({ src, output, options });
  });
}

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

    const transformedImgPath = path.join(options.publicDir, picture.src!);

    await processImageInChild(picture.src!, transformedImgPath, options);

    const sources = picture.sources ?? [];
    const transformedSources = await Promise.all(
      sources.map(async source => {
        const outputPath = path.join(options.publicDir, source.src!);
        await processImageInChild(source.src!, outputPath, options);

        return outputPath;
      })
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
