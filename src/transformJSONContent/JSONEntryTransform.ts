import { type JSONNode, type JSONEntry } from '@redneckz/json-op';

export type JSONEntryTransform = (entry: JSONEntry) => Promise<JSONEntry[]> | JSONEntry[];
export type JSONEntryTransformPrecondition = (entry: JSONEntry) => boolean;

export const entryValueTransform =
  (fn: (value: JSONNode) => Promise<JSONNode> | JSONNode): JSONEntryTransform =>
  async ([key, value]) =>
    [[key, await fn(value)]];
