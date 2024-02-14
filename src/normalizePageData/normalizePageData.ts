import { box } from '@redneckz/json-op';
import { flatMapSlots, NO_ENTRIES } from './flatMapSlots';
import { isHiddenBlock } from './isHiddenBlock';
import { toDesktopBlock } from './toDesktopBlock';

export const normalizePageData = flatMapSlots(
  defaultMapper =>
    ([p, { _ }]) =>
      isHiddenBlock(_) ? NO_ENTRIES : defaultMapper([p, box(toDesktopBlock(_))])
);
