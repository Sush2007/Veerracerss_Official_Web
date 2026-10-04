import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Allow bots to crawl and read the 'noindex' meta tag and X-Robots-Tag header so they drop the site from search indexes
        allow: '/',
        disallow: ['/admin/', '/admin/dashboard', '/admin/login'],
      },
      {
        // Disallow all AI & training crawlers from scraping the temporary data
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot',
          'CCBot',
          'cohere-ai'
        ],
        disallow: ['/'],
      }
    ],
  };
}
