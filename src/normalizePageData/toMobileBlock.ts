import { isJSONRecord, type JSONNode, type JSONRecord } from '@redneckz/json-op';
import { isBlock } from './isBlock';

export const toMobileBlock = <B extends JSONNode>(block: B = {} as B): B => {
  if (!isBlock(block)) {
    return block;
  }

  const { mobile, ...desktop } = block as JSONRecord;
  return {
    ...desktop,
    ...(isJSONRecord(mobile) && mobile.style ? { style: mobile.style } : {}),
    ...(isJSONRecord(mobile) && mobile.content ? { content: mobile.content } : {})
  } as B;
};
