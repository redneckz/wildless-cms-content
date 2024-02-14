import type { ResizeOptions, Sharp } from 'sharp';
import { type ImgSize } from './ImgSize';

export const resizeImg =
  (size?: ImgSize, options?: ResizeOptions) =>
  (chain: Sharp): Sharp =>
    size
      ? chain.resize(size.width ?? null, size.height ?? null, {
          /*
           * Editor behaviour with one dimension present: resize by given dimension maintaining aspect ratio. (fit: contain)
           * With two dimensions present: resize trying to fill given dimensions (fit: fill)
           */
          fit: size.width && size.height ? 'fill' : 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          ...options
        })
      : chain;
