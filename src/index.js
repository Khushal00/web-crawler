import { crawlPage } from './core/crawler.js';
import { checkRobotsTxt } from './core/robotsHandler.js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

(async () => {
  try {
    const domains = ['https://books.toscrape.com'];
    const results = {};
    const outputDir = './output';
    const outputFile = path.join(outputDir, 'product_urls.json');

    // Ensure the output directory exists
    console.log("Before mkdir call");
    await mkdir(outputDir, { recursive: true });
    console.log("After mkdir call");

    console.log(`Output directory ensured: ${outputDir}`);

    for (const domain of domains) {
      console.log(`Processing domain: ${domain}`);
      try {
        // Check robots.txt
        const robots = await checkRobotsTxt(domain);
        if (robots && !robots.isAllowed(domain)) {
          console.log(`Skipping ${domain} (disallowed by robots.txt)`);
          continue;
        }

        // Crawl domain
        const visited = new Set();
        const productUrls = new Set();
        await crawlPage(domain, domain, visited, productUrls);

        results[domain] = Array.from(productUrls);
        console.log(`Crawled URLs for ${domain}:`, results[domain]);
      } catch (err) {
        console.error(`Error processing domain ${domain}: ${err.message}`);
      }
    }

    // Save results to file
    try {
      await writeFile(outputFile, JSON.stringify(results, null, 2));
      console.log(`Crawling completed. Results saved to ${outputFile}`);
    } catch (err) {
      console.error(`Error writing to file ${outputFile}: ${err.message}`);
    }
  } catch (err) {
    console.error(`Critical error: ${err.message}`);
  }
})();
