import { joinPath } from './url';

describe('joinPath', () => {
  it('should join all parts with /', () => {
    expect(joinPath('foo', 'bar', 'baz')).toBe('foo/bar/baz');
  });

  it('should deduplicate / in all parts (except protocol`s part)', () => {
    expect(joinPath('foo//', '//bar', '/baz')).toBe('foo/bar/baz');
  });

  it('should ignore empty parts', () => {
    expect.assertions(2);
    expect(joinPath('foo', '', 'bar')).toBe('foo/bar');
    expect(joinPath('foo', '//', '/bar')).toBe('foo/bar');
  });

  it('should return absolute URL if protocol is provided', () => {
    expect.assertions(2);
    expect(joinPath('http:', 'some-domain', 'some-path')).toBe('http://some-domain/some-path');
    expect(joinPath('http://some-domain', 'some-path')).toBe('http://some-domain/some-path');
  });

  it.skip('should keep the last /', () => {
    expect(joinPath('foo', 'bar/')).toBe('foo/bar/');
  });
});
