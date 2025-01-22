import type _sharp from 'sharp';

let inst: typeof _sharp;

export const sharp = async () => {
  if (inst) {
    return inst;
  }

  inst = (await import('sharp')).default;
  inst.cache(false);

  return inst;
};
