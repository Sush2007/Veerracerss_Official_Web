import type { Metadata } from 'next';
import { AchievementsView } from './AchievementsView';

export const metadata: Metadata = {
  title: 'Competitive Achievements & Hall of Fame | Formula Bharat & Imperial',
  description: 'Explore the awards, national podiums, and racing milestones achieved by VeerRacerss Electric, including P3 at Formula Imperial (Buddh International Circuit) and Best Business Plan at Formula Bharat.',
  keywords: [
    'VeerRacerss achievements',
    'Formula Bharat awards VSSUT',
    'Formula Imperial podium Buddh International Circuit',
    'Electric formula student podium India',
    'Best Business Plan Formula Bharat',
    'Lightweight design award formula student'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://veerracerss-official-web.vercel.app/achievements',
  },
  openGraph: {
    title: 'Competitive Achievements & Hall of Fame | VeerRacerss Electric',
    description: 'National podiums and awards won by VeerRacerss Electric across Formula Bharat, Formula Imperial, and SAE India.',
    url: 'https://veerracerss-official-web.vercel.app/achievements',
    images: [{ url: 'https://veerracerss-official-web.vercel.app/og-image.png', width: 1200, height: 630, alt: 'VeerRacerss Hall of Fame' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Competitive Achievements & Hall of Fame | VeerRacerss Electric',
    description: 'National podiums and awards won by VeerRacerss Electric across Formula Bharat, Formula Imperial, and SAE India.',
    images: ['https://veerracerss-official-web.vercel.app/og-image.png'],
  }
};

export default function AchievementsPage() {
  const achievementsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://veerracerss-official-web.vercel.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Hall of Fame",
            "item": "https://veerracerss-official-web.vercel.app/achievements"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(achievementsSchema) }}
      />
      <AchievementsView />
    </>
  );
}
