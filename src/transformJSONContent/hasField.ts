import { fp, isJSONRecord, type JSONNode, type JSONRecord } from '@redneckz/json-op';

export const hasField =
  <K extends string>(key: K, valuePredicate: (_: unknown) => boolean = fp.Predicate.trueF) =>
  (_: JSONNode | undefined): _ is JSONRecord =>
    Boolean(isJSONRecord(_) && key in _ && valuePredicate(_[key]));
