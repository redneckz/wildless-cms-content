import path from 'path/posix';
import { type ImgSource } from './Picture';
import { type TransformationOptions } from './TransformationOptions';

export function computeImgOutputPath(
  imgInputPath: string,
  { contentDir, publicDir, format, size }: TransformationOptions & ImgSource,
  withoutTransform = false
): string {
  const imgRelativePath = path.relative(contentDir, imgInputPath);

  const imgDir = path.dirname(imgRelativePath);

  const inputExt = path.extname(imgRelativePath);
  const fileName = path.basename(imgRelativePath, inputExt);
  const suffixParts = [size?.width, size?.height].filter(Boolean);
  const suffix = suffixParts.length && !withoutTransform ? `-${suffixParts.join('-')}` : '';
  const ext = format && !withoutTransform ? `.${format}` : inputExt;

  return path.join(publicDir, imgDir, `${fileName}${suffix}${ext}`);
}
