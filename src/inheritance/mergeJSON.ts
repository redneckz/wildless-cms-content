import { leafs, merge, type JSONRecord } from '@redneckz/json-op';
import { box } from './JSONContentBox';

export const mergeJSON = <C extends JSONRecord>(parent: C, child: C): C => merge(box(parent), leafs(box(child))) as C;
