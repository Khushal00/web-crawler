// src/core/crawler.js
import axiosInstance from '../config/axiosInstance.js';
import * as cheerio from 'cheerio';
import { resolveUrl } from './utils.js';
import { settings } from '../config/settings.js';

/**
 * Recursively crawls a webpage to find product URLs.
 * @param {string} url - The URL to crawl.
 * @param {string} domain - The base domain for the crawl.
 * @param {Set<string>} visited - A set of visited URLs to avoid duplicates.
 * @param {Set<string>} productUrls - A set to collect product URLs.
 */
export const crawlPage = async (url, domain, visited, productUrls) => {
  if (visited.has(url)) return;
  visited.add(url);

  try {
    const { data } = await axiosInstance.get(url);
    console.log(typeof(data));
    const $ = cheerio.load(data);
    // console.log('Fetched data:', data); // Display a snippet of the fetched data


    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const fullUrl = resolveUrl(href, domain);
        if (settings.productPatterns.some((pattern) => fullUrl.includes(pattern))) {
          productUrls.add(fullUrl);
        };
        if (fullUrl.startsWith(domain)) {
          crawlPage(fullUrl, domain, visited, productUrls);
        }
      }
    });
  } catch (err) {
    console.error(`Failed to crawl ${url}: ${err.message}`);
  }
};
 
