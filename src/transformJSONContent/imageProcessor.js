import sharp from 'sharp';
import { transformImg } from './transformImg';

let timerId;

async function imageProcessor({ src, options }) {
  try {
    const output = await transformImg(src, options);
    const containerSize = await sharp(output).metadata();

    process.send({ src, output, containerSize });
  } catch (err) {
    console.error(err);
    process.send({ src, error: err.message });
  }
}

process.on('message', async message => {
  clearTimeout(timerId);

  if (message && typeof message.src === 'string' && message.options) {
    await imageProcessor(message);
  } else {
    console.warn('Invalid message format');
  }

  timerId = setTimeout(() => {
    process.exit(0);
  }, 10_000);
});
