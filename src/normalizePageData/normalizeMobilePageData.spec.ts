import { normalizeMobilePageData } from './normalizeMobilePageData';

describe('normalizeMobilePageData', () => {
  it('should remove hidden blocks from default slot', () => {
    expect(
      normalizeMobilePageData({
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
      normalizeMobilePageData({
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

  it('should replace desktop content and style with mobile one', () => {
    expect(
      normalizeMobilePageData({
        title: 'test',
        slots: {
          tab1: [
            {
              type: 'list',
              blocks: [
                {
                  type: 'product',
                  content: { foo: 123 },
                  style: ['text-white'],
                  mobile: { style: ['text-red'], content: { bar: 456 } }
                }
              ]
            }
          ]
        }
      })
    ).toEqual({
      title: 'test',
      slots: {
        tab1: [
          {
            type: 'list',
            blocks: [{ type: 'product', content: { bar: 456 }, style: ['text-red'] }]
          }
        ]
      }
    });
  });
});
