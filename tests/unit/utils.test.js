import { settings } from '../../src/config/settings.js';
import { resolveUrl } from '../../src/core/utils.js';

describe('Utility Functions', () => {
  const productPatterns = settings.productPatterns;

  const isProductUrl = (url) => productPatterns.some((pattern) => url.includes(pattern));

  test('Detect product URLs based on settings patterns', () => {
    expect(isProductUrl('https://example.com/mock-product/123')).toBe(true); // Matches '/product/'
    expect(isProductUrl('https://example.com/about')).toBe(false);      // Does not match
    expect(isProductUrl('https://example.com/test-item/456')).toBe(true);    // Matches '/item/'
  });

  test('Resolve URLs correctly resolves relative paths', () => {
    expect(resolveUrl('/mock-product/123', 'https://example.com')).toBe('https://example.com/mock-product/123'); // Relative path
    expect(resolveUrl('https://example.com/test-item/456', 'https://example.com')).toBe('https://example.com/test-item/456'); // Absolute path
  });
});
