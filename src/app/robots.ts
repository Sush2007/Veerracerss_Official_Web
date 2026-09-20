import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://veerracerss-official-web.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/dashboard', '/admin/login'],
      },
      {
        // Generative & Answer Engine Optimization (GEO/AEO) Bots
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
        allow: ['/', '/about', '/cars', '/members', '/achievements', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
