import { diff, fromEntries, type JSONRecord } from '@redneckz/json-op';
import { box } from './JSONContentBox';

export const diffJSON = <C extends JSONRecord>(parent: C, child: C): C =>
  fromEntries(box({}), diff(box(parent), box(child))) as C;
