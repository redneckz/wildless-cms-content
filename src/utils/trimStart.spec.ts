import { trimStart } from './trimStart';

describe('trimStart', () => {
  it('should remove consequent occurances of provided char from very beginning of string', () => {
    expect(trimStart('_')('___foo')).toBe('foo');
  });
});
