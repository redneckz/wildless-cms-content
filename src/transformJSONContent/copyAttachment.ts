import path from 'path/posix';
import { isFileStorageId } from '../api/isFileStorageId';
import { copyFile } from '../fs/copyFile';
import { FILE_PROTO } from '../utils/url';
import { type TransformationOptions } from './TransformationOptions';

export async function copyAttachment(src: string, options: TransformationOptions) {
  if (isFileStorageId(src)) {
    return src;
  }

  const input = clearAttachmentHref(src);
  const { contentDir, publicDir, dryRun } = options;
  const docRelativePath = path.relative(contentDir, input);
  const output = path.join(publicDir, docRelativePath);

  try {
    dryRun || (await copyFile(input, output));
  } catch (e) {
    console.info(`No "${input}" attachment found`);
  }

  return path.join('/', docRelativePath);
}

/**
 * @deprecated
 * @param href
 * @returns url without file:// proto
 */
export const clearAttachmentHref = (href: string | undefined): string => href?.replace(FILE_PROTO, '') ?? '';
