/* eslint-disable @typescript-eslint/no-unused-vars */
import { type JSONNode, type JSONRecord } from '@redneckz/json-op';
import { isBlock } from './isBlock';

export const toDesktopBlock = <B extends JSONNode>(block: B = {} as B): B => {
  if (!isBlock(block)) {
    return block;
  }

  const { mobile, ...desktop } = block as JSONRecord;
  return desktop as B;
};
