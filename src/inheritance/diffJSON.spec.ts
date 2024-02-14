import { type JSONRecord } from '@redneckz/json-op';
import { diffJSON } from './diffJSON';

describe('diffJSON', () => {
  it('should return an empty object if there are no changes', () => {
    const parent: JSONRecord = { a: 1, b: 2 };
    const child: JSONRecord = { a: 1, b: 2 };

    expect(diffJSON(parent, child)).toEqual({});
  });

  it('should detect simple changes in objects', () => {
    const parent: JSONRecord = { a: 1, b: 2 };
    const child: JSONRecord = { a: 1, b: 3 };

    expect(diffJSON(parent, child)).toEqual({ b: 3 });
  });

  it('should detect changes in nested objects', () => {
    const parent: JSONRecord = { a: { x: 1, y: 2 } };
    const child: JSONRecord = { a: { x: 1, y: 3 } };

    expect(diffJSON(parent, child)).toEqual({ a: { y: 3 } });
  });

  it('should replace arrays if at least one element has changes', () => {
    const parent: JSONRecord = { a: [{ b: 1 }, { b: 2 }, { b: 3 }] };
    const child: JSONRecord = { a: [{ b: 1 }, { b: 5 }, { b: 3 }] };

    expect(diffJSON(parent, child)).toEqual({
      a: [{ b: 1 }, { b: 5 }, { b: 3 }]
    });
  });

  it('should handle arrays of objects with __id', () => {
    const parent: JSONRecord = {
      items: [
        { __id: 'a', value: 1 },
        { __id: 'b', value: 2, data: '123' }
      ]
    };
    const child: JSONRecord = {
      items: [
        { __id: 'a', value: 1 },
        { __id: 'b', value: 3, data: '123' }
      ]
    };

    expect(diffJSON(parent, child)).toEqual({
      items: [{ __id: 'b', value: 3 }]
    });
  });

  it('should append new objects in arrays of objects with __id', () => {
    const parent: JSONRecord = {
      items: [{ __id: 'a', value: 1 }]
    };
    const child: JSONRecord = {
      items: [
        { __id: 'a', value: 1 },
        { __id: 'b', value: 3 }
      ]
    };

    expect(diffJSON(parent, child)).toEqual({
      items: [{ __id: 'b', value: 3 }]
    });
  });
});
