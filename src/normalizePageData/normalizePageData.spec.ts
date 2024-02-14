import { normalizePageData } from './normalizePageData';

describe('normalizePageData', () => {
  it('should remove hidden blocks from default slot', () => {
    expect(
      normalizePageData({
        title: 'test',
        blocks: [
          { type: 'product', content: { foo: 123 } },
          { type: 'product', hidden: true, content: { foo: 123 } }
        ]
      })
    ).toEqual({
      title: 'test',
      blocks: [{ type: 'product', content: { foo: 123 } }]
    });
  });

  it('should remove hidden blocks from named slots', () => {
    expect(
      normalizePageData({
        title: 'test',
        slots: {
          tab1: [
            { type: 'product', hidden: true, content: { foo: 123 } },
            { type: 'product', content: { foo: 123 } }
          ]
        }
      })
    ).toEqual({
      title: 'test',
      slots: {
        tab1: [{ type: 'product', content: { foo: 123 } }]
      }
    });
  });

  it('should keep only desktop content (and get rid of mobile content)', () => {
    expect(
      normalizePageData({
        title: 'test',
        slots: {
          tab1: [{ type: 'product', content: { foo: 123 }, style: ['text-white'], mobile: { style: ['text-red'] } }]
        }
      })
    ).toEqual({
      title: 'test',
      slots: {
        tab1: [{ type: 'product', content: { foo: 123 }, style: ['text-white'] }]
      }
    });
  });
});
