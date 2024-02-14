import { isJSONRecord, type JSONNode } from '@redneckz/json-op';

export const nodeId = (node: JSONNode | undefined): string | undefined =>
  isJSONRecord(node) && '__id' in node ? (node.__id as string) : undefined;
