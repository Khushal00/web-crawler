// src/config/settings.js

// export const settings = {
//     timeout: 10000, // Request timeout in milliseconds
//     productPatterns: ['/mock-product/', '/test-item/', 'https://www.iana.org/domains/example'], // Product URL patterns
//   };
  
// src/config/settings.js

export const settings = {
  timeout: 15000, // Request timeout in milliseconds (increased for broader crawling)
  productPatterns: [
    '/catalogue/category/books/',  // Matches book category pages
    '/catalogue/',                 // Matches individual book details
  ], // Product URL patterns based on the test site's structure
};
