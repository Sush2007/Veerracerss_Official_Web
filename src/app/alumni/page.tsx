import type { Metadata } from 'next';
import { AlumniView } from './AlumniView';

export const metadata: Metadata = {
  title: 'Alumni Network & Industry Mentors | VeerRacerss Electric',
  description: 'Connect with VeerRacerss alumni leading engineering and innovation across Ather Energy, Tata Motors EV, Mahindra Racing, and Ola Electric.',
  keywords: [
    'VeerRacerss alumni',
    'VSSUT formula student alumni',
    'EV engineers alumni India',
    'Formula Student career paths',
    'Motorsport engineering mentors'
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
    canonical: 'https://veerracerss-official-web.vercel.app/alumni',
  },
  openGraph: {
    title: 'Alumni Network & Industry Mentors | VeerRacerss Electric',
    description: 'VeerRacerss alumni leading engineering across Ather Energy, Tata Motors EV, Mahindra Racing, and Ola Electric.',
    url: 'https://veerracerss-official-web.vercel.app/alumni',
    images: [{ url: 'https://veerracerss-official-web.vercel.app/og-image.png', width: 1200, height: 630, alt: 'VeerRacerss Alumni' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alumni Network & Industry Mentors | VeerRacerss Electric',
    description: 'Connect with VeerRacerss alumni leading engineering and innovation across Ather Energy, Tata Motors EV, Mahindra Racing, and Ola Electric.',
    images: ['https://veerracerss-official-web.vercel.app/og-image.png'],
  }
};

export default function AlumniPage() {
  const alumniSchema = {
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
            "name": "Alumni Network",
            "item": "https://veerracerss-official-web.vercel.app/alumni"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(alumniSchema) }}
      />
      <AlumniView />
    </>
  );
}
