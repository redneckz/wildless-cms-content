import fs from 'fs';
import path from 'path/posix';
import type { FormatEnum, Sharp } from 'sharp';
import util from 'util';
import { type TransformationOptions } from './TransformationOptions';
import { computeImgOutputPath } from './computeImgOutputPath';
import { isImgSizeEmpty, type ImgSize } from './ImgSize';
import { type ImgSource } from './Picture';
import { resizeImg } from './resizeImg';

const mkdir = util.promisify(fs.mkdir);
const copyFile = util.promisify(fs.copyFile);

type ImgOutputPath = string;
type TransformationTasksCache = Map<ImgOutputPath, Promise<ImgOutputPath>>;

type TransformImgOptions = TransformationOptions &
  ImgSource & { containerSize?: ImgSize; cache?: TransformationTasksCache };

const defaultTransformationCache: TransformationTasksCache = new Map();

const isNilTransform = ({ size, containerSize, format }: TransformImgOptions) =>
  isImgSizeEmpty(size) && isImgSizeEmpty(containerSize) && !format;

const isVectorInput = (input: string) =>
  ['.svg', '.eps', '.epsf', '.epsi', '.pdf'].some(ext => input.toLowerCase().endsWith(ext));

export async function transformImg(src: string, options: TransformImgOptions): Promise<ImgOutputPath> {
  if (!src) {
    return src;
  }

  const withoutTransform = isNilTransform(options) || isVectorInput(src);
  const output = computeImgOutputPath(src, options, withoutTransform);
  const { cache = defaultTransformationCache, dryRun } = options;

  if (dryRun) {
    return output;
  }

  const cachedResult = cache.get(output);
  if (cachedResult) {
    return cachedResult;
  }

  const result = (async () => {
    try {
      await mkdir(path.dirname(output), { recursive: true });
      if (withoutTransform) {
        await copyFile(src, output);
      } else {
        const sharp = (await import('sharp')).default;
        const chain = await transformImgWithSharp(options)(sharp(src));
        await chain.toFile(output);
      }
    } catch (e) {
      console.info(`No "${src}" image found`);
    }

    return output;
  })();

  cache.set(output, result);

  return result;
}

const transformImgWithSharp = ({ size, containerSize, format, options }: TransformImgOptions) =>
  pipe(resizeImg(isImgSizeEmpty(size) ? containerSize : size), sharp =>
    format ? sharp.toFormat(format as keyof FormatEnum, { ...options, lossless: true }) : sharp
  );

const pipe = (...operations: Array<(chain: Sharp) => Promise<Sharp> | Sharp>) =>
  operations.reduce((a, b) => async (chain: Sharp) => b(await a(chain)));
