import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://veerracerss-official-web.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/dashboard', '/admin/login', '/api/'],
      },
      {
        // Generative Engine Optimization (GEO) & Answer Engine Optimization (AEO) Bots
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot',
          'CCBot',
          'cohere-ai',
          'OAI-SearchBot',
          'Meta-ExternalAgent'
        ],
        allow: [
          '/',
          '/cars',
          '/members',
          '/achievements',
          '/alumni',
          '/gallery',
          '/recruitment',
          '/about',
          '/llms.txt',
          '/llms-full.txt'
        ],
        disallow: ['/admin/', '/api/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
