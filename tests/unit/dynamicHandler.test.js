import { fetchDynamicContent } from '../../src/core/dynamicHandler.js';

test('fetchDynamicContent retrieves page content', async () => {
  const content = await fetchDynamicContent('https://example.com');
  expect(content).toContain('<html>');
});
