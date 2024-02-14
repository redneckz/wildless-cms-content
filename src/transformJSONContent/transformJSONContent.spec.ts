import { type TransformationOptions } from './TransformationOptions';
import { transformJSONContent } from './transformJSONContent';
import { copyFile } from '../fs/copyFile';

jest.mock('../fs/copyFile', () => ({ copyFile: jest.fn() }));
jest.mock('../fs/getFileSize', () => ({ getFileSize: () => 0 }));
jest.mock('../fs/isFileExists', () => ({ isFileExists: jest.fn(() => true) }));

jest.mock('rehype-parse', () => ({}));
jest.mock('rehype-sanitize', () => ({ defaultSchema: {} }));
jest.mock('rehype-stringify', () => ({}));

jest.mock('unified', () => {
  const unified = () => ({
    use: unified,
    process: jest.fn(_ => _.replaceAll(/#\s+([^\r\n]+)/g, '<h1>$1</h1>'))
  });
  return { unified };
});
jest.mock('remark-html', () => ({}));
jest.mock('remark-parse', () => ({}));

jest.mock('sharp', () => () => ({ metadata: () => ({ width: 100, height: 100 }) }));

const options: TransformationOptions = {
  contentDir: 'content',
  publicDir: 'public'
};

describe('transformContent', () => {
  it('should return provided content as is if no special fields is provided', async () => {
    expect.assertions(1);

    expect(await transformJSONContent({ title: 'test', bar: [1, 2, 3] }, options)).toEqual({
      title: 'test',
      bar: [1, 2, 3]
    });
  });

  describe('of "__md" fields', () => {
    it('should transform markdown fields to HTML', async () => {
      expect.assertions(1);

      expect(await transformJSONContent({ title: 'test', bar: { __md: '# 123\n' } }, options)).toEqual({
        title: 'test',
        bar: { __md: '<p class="h1">123</p>\n' }
      });
    });
  });

  describe('of "__html" fields', () => {
    it('should normalize HTML fields', async () => {
      expect.assertions(1);

      expect(await transformJSONContent({ title: 'test', bar: { __html: '<h1>123</h1>\n' } }, options)).toEqual({
        title: 'test',
        bar: { __html: '<p class="h1">123</p>\n' }
      });
    });
  });

  describe('of attachment fields', () => {
    it('should replace attachment href with path relative to content dir', async () => {
      expect.assertions(1);

      expect(await transformJSONContent({ title: 'test', bar: { href: 'file://content/baz.pdf' } }, options)).toEqual({
        title: 'test',
        bar: { href: '/baz.pdf' }
      });
    });

    it('should copy attachments from content dir to public dir', async () => {
      expect.assertions(1);

      await transformJSONContent({ title: 'test', bar: { href: 'file://content/baz.pdf' } }, options);
      expect(copyFile as jest.Mock).toHaveBeenCalledWith('content/baz.pdf', 'public/baz.pdf');
    });

    it('should replace attachment src with path relative to content dir and inject fileSize field with corresponding value', async () => {
      expect.assertions(1);

      expect(await transformJSONContent({ title: 'test', bar: { src: 'content/baz.docx' } }, options)).toEqual({
        title: 'test',
        bar: { src: '/baz.docx', fileSize: 0 }
      });
    });

    it('should copy attached docs from content dir to public dir', async () => {
      expect.assertions(1);

      await transformJSONContent({ title: 'test', bar: { src: 'content/baz.docx' } }, options);
      expect(copyFile as jest.Mock).toHaveBeenCalledWith('content/baz.docx', 'public/baz.docx');
    });
  });

  describe('of picture fields', () => {
    it('should replace picture src with path relative to content dir', async () => {
      expect.assertions(1);

      expect(
        await transformJSONContent({ title: 'test', bar: { src: 'content/foo/picture.png', sources: [] } }, options)
      ).toEqual({
        title: 'test',
        bar: { src: '/foo/picture.png', sources: [] }
      });
    });

    it('should transform picture sources according to provided format and size', async () => {
      expect.assertions(1);

      expect(
        await transformJSONContent(
          {
            title: 'test',
            bar: {
              src: 'content/foo/picture.png',
              sources: [{ src: 'content/foo/alt.png', format: 'webp', size: { width: 100, height: 100 } }]
            }
          },
          options
        )
      ).toEqual({
        title: 'test',
        bar: {
          src: '/foo/picture.png',
          sources: [{ src: '/foo/alt-100-100.webp', format: 'webp', size: { width: 100, height: 100 } }]
        }
      });
    });
  });
});
