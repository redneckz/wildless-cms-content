import { box } from '@redneckz/json-op';
import { flatMapSlots, NO_ENTRIES } from './flatMapSlots';
import { isHiddenBlock } from './isHiddenBlock';
import { toMobileBlock } from './toMobileBlock';

export const normalizeMobilePageData = flatMapSlots(
  defaultMapper =>
    ([p, { _ }]) =>
      isHiddenBlock(_) ? NO_ENTRIES : defaultMapper([p, box(toMobileBlock(_))])
);
