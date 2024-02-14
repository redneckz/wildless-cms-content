import { type ImgSize } from './ImgSize';

export interface Img {
  src?: string;
}

export interface ImgSource {
  src?: string;
  format?: string;
  options?: Record<string, any>;
  size?: ImgSize;
}

export interface Picture extends Img, ImgSource {
  sources?: ImgSource[];
}
