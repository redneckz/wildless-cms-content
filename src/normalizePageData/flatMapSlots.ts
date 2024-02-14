import { JSONBox, JSONPath, boxed, fp, type JSONBoxEntry, type JSONNode } from '@redneckz/json-op';

const { pair, Predicate } = fp;
const { or, trueF } = Predicate;

export type JSONBoxEntryFlatMapper = (entry: JSONBoxEntry) => JSONBoxEntry<JSONNode>[];
export const NO_ENTRIES: JSONBoxEntry<JSONNode>[] = [];

export const flatMapSlots = (mapper: (defaultMapper: JSONBoxEntryFlatMapper) => JSONBoxEntryFlatMapper) => {
  const transform = boxed((data: JSONBox, path: JSONPath.JSONPath = []): JSONBox => {
    const defaultMapper: JSONBoxEntryFlatMapper = ([p, box]) => [pair(p, transform(box._, [...path, p]))];
    return data.flatMap(isSlotItemPath(path) ? mapper(defaultMapper) : defaultMapper);
  });
  return transform;
};

const isSlotItemPath = or(JSONPath.endsWith(['blocks']), JSONPath.endsWith(['slots', trueF]));
