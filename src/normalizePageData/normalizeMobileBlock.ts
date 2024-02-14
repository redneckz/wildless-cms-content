import { fp } from '@redneckz/json-op';
import { type JSONBoxEntryFlatMapper } from './flatMapSlots';
import { toMobileBlock } from './toMobileBlock';

export const normalizeMobileBlock: JSONBoxEntryFlatMapper = ([p, { _ }]) => [fp.pair(p, toMobileBlock(_))];
