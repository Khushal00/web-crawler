import { crawlPage } from '../../src/core/crawler.js';

// Mock the settings
jest.mock('../../src/config/settings.js', () => ({
  settings: {
    timeout: 5000,
    productPatterns: ['/mock-product/', '/test-item/', '/special-item/'],
  },
}));


// Properly mock axios
jest.mock('axios', () => {
  const mockAxios = {
    get: jest.fn((url) => {
      if (url === 'http://example.com') {
        return Promise.resolve({
          data: `
            <html>
              <body>
                <a href="/mock-product/123">Product 1</a>
                <a href="/test-item/456">Product 2</a>
                <a href="http://anotherdomain.com/special-item/789">External Product</a>
              </body>
            </html>
          `,
        });
      }
      return Promise.reject(new Error(`404 Not Found for ${url}`));
    }),
    create: jest.fn(() => mockAxios),
  };
  return mockAxios;
});


test('crawlPage collects product URLs', async () => {
  const visited = new Set();
  const productUrls = new Set();

  await crawlPage('http://example.com', 'http://example.com', visited, productUrls);

  expect(productUrls.size).toBeGreaterThan(0);
  expect(productUrls).toContain('http://example.com/mock-product/123');
  expect(productUrls).toContain('http://example.com/test-item/456');
});
