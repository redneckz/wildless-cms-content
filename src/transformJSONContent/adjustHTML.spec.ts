import { adjustHTML } from './adjustHTML';

describe('adjustHTML', () => {
  it('should replace heading tags with appropriately styled paragraphs', () => {
    expect(adjustHTML('<html><h1>123</h1></html>')).toBe('<html><p class="h1">123</p></html>');
  });

  it('should replace heading tags with paragraphs regardless of heading count', () => {
    expect(adjustHTML('<html><h1>123</h1><h2>456</h2></html>')).toBe(
      '<html><p class="h1">123</p><p class="h2">456</p></html>'
    );
  });

  it('should replace heading tags with paragraphs regardless of nesting', () => {
    expect(adjustHTML('<html><h1>123<h2>456</h2></h1></html>')).toBe(
      '<html><p class="h1">123<p class="h2">456</p></p></html>'
    );
  });
});
