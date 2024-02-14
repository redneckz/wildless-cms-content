import { JSONBoxDefault, JSONPath, isJSONArray, type JSONBox, type JSONNode, type JSONRecord } from '@redneckz/json-op';
import { isAtomicArray } from './isAtomicArray';
import { nodeId } from './nodeId';

const ID_PREFIX = 'id:';

export const box = (_: JSONNode | undefined): JSONBox => new JSONContentBox(_);

export class JSONContentBox extends JSONBoxDefault {
  size(): number {
    return isAtomicArray(this._) ? 0 : super.size();
  }

  entries(): Array<[p: JSONPath.JSONPathElement, child: JSONBox]> {
    if (isAtomicArray(this._)) {
      return [];
    } else if (isJSONArray(this._)) {
      return this._.map((node, i) => [nodeId(node) ? idToKey(nodeId(node)) : i, new JSONContentBox(node)]);
    } else {
      return super.entries();
    }
  }

  get(p?: JSONPath.JSONPathElement): JSONBox {
    const id = keyToId(p);

    return super.get(id ? findIndexById(this._, id) : p);
  }

  set(p: JSONPath.JSONPathElement | undefined, child: JSONNode): JSONBox {
    const id = keyToId(p);
    const index = findIndexById(this._, id);
    const adjustedIndex = index >= 0 ? index : this.size();

    return super.set(id ? adjustedIndex : p, id ? { ...(child as JSONRecord), __id: id } : child);
  }
}

const keyToId = (p: JSONPath.JSONPathElement | undefined): string | undefined =>
  typeof p === 'string' && p.startsWith(ID_PREFIX) ? p.substring(ID_PREFIX.length) : undefined;
const idToKey = (id: string | undefined): JSONPath.JSONPathElement => `${ID_PREFIX}${id}`;

const findIndexById = (_: JSONNode | undefined, id: string | undefined): number | -1 =>
  id && isJSONArray(_) ? _.findIndex(node => id === nodeId(node)) : -1;
