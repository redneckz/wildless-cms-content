import { JSONPath, fp, type JSONRecord } from '@redneckz/json-op';
import { fork, type ChildProcess } from 'child_process';
import pLimit from 'p-limit';
import { dirname } from 'path';
import path from 'path/posix';
import { fileURLToPath } from 'url';
import { isFileStorageId } from '../api/isFileStorageId';
import { type ImgSize } from './ImgSize';
import { entryValueTransform, type JSONEntryTransformPrecondition } from './JSONEntryTransform';
import { type Picture } from './Picture';
import { type TransformationOptions } from './TransformationOptions';
import { hasField } from './hasField';
import { isAttachment } from './isAttachment';
import { type TransformImgOptions } from './transformImg';

const limit = pLimit(100);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    const { output, containerSize } = await limit(processImage, picture.src!, { ...options, ...picture });

    const sources = picture.sources ?? [];
    const transformedSources = await Promise.all(
      sources.filter(_ => _.src).map(_ => limit(processImage, _.src!, { ...options, ..._, containerSize }))
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

let imageProcessor: ChildProcess;

async function processImage(
  src: string,
  options: TransformImgOptions
): Promise<{ output: string; containerSize?: ImgSize }> {
  initImageProcessor();
  const result = await new Promise<{ output: string; containerSize?: ImgSize }>(resolve => {
    const defaultResult = () => resolve({ output: src });
    const handle = (message: { src: string; output: string; containerSize?: ImgSize; error?: string }) => {
      if (src === message.src) {
        imageProcessor.off('message', handle);
        message.output ? resolve(message) : defaultResult();
      }
    };
    imageProcessor.on('message', handle);
    if (!imageProcessor.send({ src, options })) {
      defaultResult();
    }
  });

  return result;
}

const initImageProcessor = () => {
  if (!imageProcessor) {
    imageProcessor = fork(path.resolve(__dirname, './imageProcessor.js'), [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      cwd: process.cwd()
    });

    imageProcessor.stdout?.pipe(process.stdout);
    imageProcessor.stderr?.pipe(process.stderr);
    imageProcessor.setMaxListeners(0);
  }
};
