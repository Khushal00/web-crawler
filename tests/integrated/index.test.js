import { crawlPage } from '../../src/core/crawler.js';
import { checkRobotsTxt } from '../../src/core/robotsHandler.js';
import { writeFile, mkdir } from 'fs/promises';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

// Mock necessary modules
jest.mock('../../src/core/crawler.js', () => ({
  crawlPage: jest.fn(),
}));

jest.mock('../../src/core/robotsHandler.js', () => ({
  checkRobotsTxt: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(),
  mkdir: jest.fn().mockResolvedValue(),
}));

jest.mock('axios', () => {
  const mockAxios = {
    get: jest.fn((url) => {
      if (url === 'https://example.com') {
        return Promise.resolve({
          data: `
            <html>
              <body>
                <a href="https://www.iana.org/domains/example">External Product</a>
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

describe('Integrated Tests for Web Crawler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('Integration: should crawl domain and save results to file', async () => {
    // Mock the crawlPage and checkRobotsTxt implementations
    crawlPage.mockImplementation(async (domain, base, visitedSet, productSet) => {
      productSet.add('https://www.iana.org/domains/example');
    });

    checkRobotsTxt.mockResolvedValue({
      isAllowed: () => true,
    });

    // Run the script via execAsync, but wait for it to complete
    try {
      const { stdout, stderr } = await execAsync('node ./src/index.js');
      console.log('Script stdout:', stdout);
      console.error('Script stderr:', stderr);

      console.log("before mkdir");
      // Validate mkdir call
      expect(mkdir).toHaveBeenCalledWith('./output', { recursive: true });

      console.log("before mkdir");

      // Validate writeFile was called with correct arguments
      expect(writeFile).toHaveBeenCalledWith(
        './output/product_urls.json',
        JSON.stringify(
          {
            'https://example.com': ['https://www.iana.org/domains/example'],
          },
          null,
          2
        )
      );

      // Validate logs
      expect(stdout).toContain('Processing domain: https://example.com');
      expect(stdout).toContain('Crawled URLs for https://example.com: [');
      expect(stdout).toContain('Crawling completed. Results saved to');
      expect(stderr).toBe('');
    } catch (error) {
      console.error('Test failed with error:', error);
      throw error;  // Ensure we fail the test if the script doesn't work as expected
    }
  });
});
