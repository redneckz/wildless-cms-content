import { type JSONNode, isJSONRecord, type JSONRecord } from '@redneckz/json-op';

export const isBlock = (node: JSONNode): node is JSONRecord & { type: string; hidden?: boolean; mobile?: JSONRecord } =>
  isJSONRecord(node) && 'type' in node;
