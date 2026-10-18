import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adyapan.com';
  return {
    rules: [
      // Allow all public pages
      {
        userAgent: '*',
        allow: ['/', '/favicon.ico', '/icon-*.png', '/apple-touch-icon.png', '/site.webmanifest'],
        disallow: [
          '/admin/',
          '/superadmin/',
          '/api/',
          '/dashboard/',
          '/checkout/',
          '/auth/',
          '/login/',
          '/signup/',
          '/reset-password/',
          '/organization/',
          // Keep the public certifications landing + detail pages crawlable,
          // but block the private exam-taking route.
          '/certifications/test',
          '/passport/',
          '/assessment/',
          '/marketplace/',
          '/modal-test/',
        ],
      },
      // Block AI training bots
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
    ],
    sitemap:  `${baseUrl}/sitemap.xml`,
    host:     baseUrl,
  };
}
