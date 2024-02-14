import { JSONPath, fp } from '@redneckz/json-op';
import { entryValueTransform, type JSONEntryTransformPrecondition } from './JSONEntryTransform';
import { type TransformationOptions } from './TransformationOptions';
import { copyAttachment } from './copyAttachment';
import { isAttachment } from './isAttachment';

export const precondition: JSONEntryTransformPrecondition = fp.Predicate.and(
  fp.t0(JSONPath.endsWith(['href'])),
  fp.t1(isAttachment())
);

export const transform = (options: TransformationOptions) =>
  entryValueTransform(href => (href && typeof href === 'string' ? copyAttachment(href, options) : href));
