// src/core/utils.js

/**
 * Checks if a URL matches product URL patterns.
 * @param {string} url - The URL to check.
 * @returns {boolean} - True if the URL matches a product pattern.
 */
  
  /**
   * Resolves a relative URL to an absolute URL.
   * @param {string} href - The relative URL.
   * @param {string} domain - The base domain.
   * @returns {string|null} - The resolved absolute URL or null on failure.
   */
  export const resolveUrl = (href, domain) => {
    try {
      return new URL(href, domain).href;
    } catch (err) {
      console.error(`Invalid URL: ${href}`);
      return null;
    }
  };
  