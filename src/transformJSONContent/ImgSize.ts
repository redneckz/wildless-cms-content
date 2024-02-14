export interface ImgSize {
  width?: number;
  height?: number;
}

export const isImgSizeEmpty = (size: ImgSize | undefined): boolean => !size?.width && !size?.height;
