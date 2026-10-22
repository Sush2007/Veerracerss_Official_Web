import type { Metadata } from 'next';
import { AboutView } from './AboutView';

export const metadata: Metadata = {
  title: 'Inside Team VeerRacerss | Mission, Philosophy & VSSUT Burla Heritage',
  description: 'Learn the origin, engineering philosophy, mission, and pinnacle moments of VeerRacerss Electric at VSSUT Burla. Discover how 200+ students build Odisha\'s premier electric racing platform.',
  keywords: [
    'About VeerRacerss',
    'VSSUT Burla Formula Student history',
    'VeerRacerss mission and philosophy',
    'Collegiate electric vehicle engineering India',
    'Pinnacle moments VeerRacerss',
    'VSSUT motorsports club'
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
    canonical: 'https://veerracerss-official-web.vercel.app/about',
  },
  openGraph: {
    title: 'Inside Team VeerRacerss | Mission & Heritage',
    description: 'Learn about VeerRacerss Electric, our student-led engineering philosophy, and our journey at VSSUT Burla.',
    url: 'https://veerracerss-official-web.vercel.app/about',
    images: [{ url: 'https://veerracerss-official-web.vercel.app/og-image.png', width: 1200, height: 630, alt: 'About VeerRacerss' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inside Team VeerRacerss | Mission, Philosophy & Heritage',
    description: 'Learn the origin, engineering philosophy, and mission of VeerRacerss Electric at VSSUT Burla.',
    images: ['https://veerracerss-official-web.vercel.app/og-image.png'],
  }
};

export default function AboutPage() {
  const aboutSchema = {
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
            "name": "About Us",
            "item": "https://veerracerss-official-web.vercel.app/about"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutView />
    </>
  );
}
