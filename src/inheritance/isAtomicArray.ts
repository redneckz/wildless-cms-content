import { isJSONArray, JSONArray, type JSONNode } from '@redneckz/json-op';
import { nodeId } from './nodeId';

export const isAtomicArray = (node: JSONNode | undefined): node is JSONArray => isJSONArray(node) && !node.some(nodeId);
