import axios from 'axios';
import robotsParser from 'robots-parser';

/**
 * Checks if a given domain allows crawling.
 * @param {string} domain - The domain to check.
 * @returns {Promise<Object>} - The parsed robots.txt rules or a default rule allowing all crawling if not found.
 */
export const checkRobotsTxt = async (domain) => {
  const robotsUrl = `${domain}/robots.txt`;

  try {
    const { data } = await axios.get(robotsUrl);
    return robotsParser(robotsUrl, data); // Parse and return rules if robots.txt exists
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.warn(`No robots.txt found for ${domain}. Defaulting to allow crawling.`);
      // Return a default rule object that allows all crawling
      return {
        isAllowed: () => true,
      };
    }
    // Log and rethrow for other errors
    console.error(`Error fetching robots.txt for ${domain}: ${err.message}`);
    throw err;
  }
};

