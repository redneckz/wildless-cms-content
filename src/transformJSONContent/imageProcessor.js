import sharp from 'sharp';

process.on('message', async message => {
  const { src, options, output } = message;

  try {
    const metadata = await sharp(src).metadata();
    const size = options.resize || { width: metadata.width, height: metadata.height };

    await sharp(src)
      .resize(size.width, size.height)
      .toFormat(options.format, { ...options.formatOptions })
      .toFile(output);

    process.send({ success: true, output });
  } catch (err) {
    process.send({ success: false, error: err.message });
  } finally {
    process.exit();
  }
});
