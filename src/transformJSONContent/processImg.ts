import { fork, type ChildProcess } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import path from 'node:path/posix';
import { fileURLToPath } from 'node:url';

import pLimit from 'p-limit';

import { type ImgSize } from './ImgSize';
import { type TransformImgOptions } from './transformImg';

export interface ImageProcessorResult {
  output: string;
  containerSize?: ImgSize;
}

let imageProcessor: ChildProcess;
const processImageLimit = pLimit(10);

export const processImage = (src: string, options: TransformImgOptions) =>
  processImageLimit(async (): Promise<ImageProcessorResult> => {
    initImageProcessor();
    const result = await new Promise<ImageProcessorResult>(resolve => {
      const id = randomUUID();
      const defaultResult = { output: src };
      const handle = (message: { id: string; output: string; containerSize?: ImgSize; error?: string }) => {
        if (id === message.id) {
          imageProcessor.off('message', handle);
          resolve(message.output ? message : defaultResult);
        }
      };
      imageProcessor.on('message', handle);
      if (!imageProcessor.send({ id, src, options })) {
        resolve(defaultResult);
      }
    });

    return result;
  });

function initImageProcessor() {
  if (!imageProcessor) {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    imageProcessor = fork(path.resolve(moduleDir, './imageProcessor.js'), [], {
      stdio: [1, 2, 'ipc'],
      cwd: process.cwd()
    });

    imageProcessor.stdout?.pipe(process.stdout);
    imageProcessor.stderr?.pipe(process.stderr);
    imageProcessor.setMaxListeners(0);
  }
}

process.on('beforeExit', () => {
  if (imageProcessor) {
    imageProcessor.kill();
  }
});
