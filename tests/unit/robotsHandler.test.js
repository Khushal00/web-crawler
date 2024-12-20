import { checkRobotsTxt } from '../../src/core/robotsHandler.js';

test('checkRobotsTxt parses robots.txt', async () => {
  const result = await checkRobotsTxt('https://example.com');
  expect(result).toBeDefined();
});
