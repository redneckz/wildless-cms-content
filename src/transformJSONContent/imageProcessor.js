import sharp from 'sharp';
import { transformImg } from './transformImg';

async function imageProcessor({ id, src, options }) {
  try {
    const output = await transformImg(src, options);
    const containerSize = await sharp(output).metadata();

    process.send({ id, output, containerSize });
  } catch (err) {
    console.error(err);
    process.send({ id, error: err.message });
  }
}

process.on('message', async message => {
  if (message && typeof message.src === 'string' && message.options) {
    await imageProcessor(message);
  } else {
    console.warn('Invalid message format');
  }
});

process.on('SIGTERM', () => {
  process.disconnect();
  process.removeAllListeners();
  process.exitCode = 0;
});
