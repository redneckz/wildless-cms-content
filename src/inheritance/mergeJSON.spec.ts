import { type JSONRecord } from '@redneckz/json-op';
import { mergeJSON } from './mergeJSON';

describe('mergeJSON', () => {
  it('should merge two simple JSON objects', () => {
    const parent: JSONRecord = { a: 1, b: 2 };
    const child: JSONRecord = { b: 3, c: 4 };

    expect(mergeJSON(parent, child)).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should merge nested JSON objects', () => {
    const parent: JSONRecord = {
      a: 1,
      b: { c: 2 },
      e: 10
    };
    const child: JSONRecord = {
      a: 2,
      b: { c: 3, d: 4 }
    };

    expect(mergeJSON(parent, child)).toEqual({
      a: 2,
      b: { c: 3, d: 4 },
      e: 10
    });
  });

  it('should merge objects in array by __id', () => {
    const parent: JSONRecord = {
      items: [
        { __id: 'a', value: 1 },
        { __id: 'b', value: 2, data: '123' }
      ]
    };
    const child: JSONRecord = {
      items: [
        { __id: 'a', slots: { s: [{ __id: 's', value: 1 }] } },
        { __id: 'b', value: 3 }
      ]
    };

    expect(mergeJSON(parent, child)).toEqual({
      items: [
        { __id: 'a', value: 1, slots: { s: [{ __id: 's', value: 1 }] } },
        { __id: 'b', value: 3, data: '123' }
      ]
    });
  });

  it('should append items not listed in original array with __id', () => {
    const parent: JSONRecord = {
      items: [{ __id: 'a', value: 1 }]
    };
    const child: JSONRecord = {
      items: [{ __id: 'b', value: 3 }]
    };

    expect(mergeJSON(parent, child)).toEqual({
      items: [
        { __id: 'a', value: 1 },
        { __id: 'b', value: 3 }
      ]
    });
  });
});
