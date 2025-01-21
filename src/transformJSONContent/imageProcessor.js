import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const VECTOR_EXTENSIONS = ['.svg', '.eps', '.epsf', '.epsi', '.pdf'];

/**
 * Checks if the input file is a vector format.
 */
function isVectorInput(input) {
  return VECTOR_EXTENSIONS.some(ext => input.toLowerCase().endsWith(ext));
}

/**
 * Applies transformations to the image using sharp.
 */
async function processImage({ src, output, options }) {
  const { size, containerSize, format, formatOptions } = options;

  const shouldSkip = (!size && !containerSize && !format) || isVectorInput(src);

  if (shouldSkip) {
    await copyFile(src, output);
    process.send({ success: true, output });
    return;
  }

  try {
    const chain = sharp(src);

    if (size || containerSize) {
      const targetSize = size || containerSize;
      chain.resize(targetSize.width, targetSize.height);
    }

    if (format) {
      chain.toFormat(format, { ...formatOptions, lossless: true });
    }

    await chain.toFile(output);

    process.send({ success: true, output });
  } catch (err) {
    process.send({ success: false, error: err.message });
  }
}

/**
 * Utility to copy a file.
 */
async function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  await fs.mkdir(destDir, { recursive: true });
  await fs.copyFile(src, dest);
}

process.on('message', async message => {
  await processImage(message);
});
