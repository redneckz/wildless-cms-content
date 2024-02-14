import { type JSONNode } from '@redneckz/json-op';
import { isBlock } from './isBlock';

export const isHiddenBlock = (_: JSONNode) => isBlock(_) && Boolean(_.hidden);
