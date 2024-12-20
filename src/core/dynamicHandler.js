// src/core/dynamicHandler.js
import puppeteer from 'puppeteer';

/**
 * Fetches the dynamically rendered content of a webpage.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string>} - The HTML content of the page.
 */
export const fetchDynamicContent = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();
  await browser.close();
  return content;
};
