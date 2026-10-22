import type { Metadata } from 'next';
import { GalleryView } from './GalleryView';

export const metadata: Metadata = {
  title: 'Track Moments & Workshop Gallery | VeerRacerss Electric',
  description: 'Yearwise visual archive and video reels of VeerRacerss Electric on track at Formula Imperial and Formula Bharat, along with in-house workshop fabrication.',
  keywords: [
    'VeerRacerss gallery',
    'Formula Student track moments',
    'VSSUT electric racecar photos',
    'Formula Imperial racing footage',
    'Formula Bharat EV testing videos'
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
    canonical: 'https://veerracerss-official-web.vercel.app/gallery',
  },
  openGraph: {
    title: 'Track Moments & Workshop Gallery | VeerRacerss Electric',
    description: 'Yearwise visual archive of VeerRacerss Electric Formula Student racing team.',
    url: 'https://veerracerss-official-web.vercel.app/gallery',
    images: [{ url: 'https://veerracerss-official-web.vercel.app/og-image.png', width: 1200, height: 630, alt: 'VeerRacerss Gallery' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track Moments & Workshop Gallery | VeerRacerss Electric',
    description: 'Yearwise visual archive and video reels of VeerRacerss Electric on track at Formula Imperial and Formula Bharat.',
    images: ['https://veerracerss-official-web.vercel.app/og-image.png'],
  }
};

export default function GalleryPage() {
  const gallerySchema = {
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
            "name": "Gallery",
            "item": "https://veerracerss-official-web.vercel.app/gallery"
          }
        ]
      },
      {
        "@type": "ImageGallery",
        "name": "VeerRacerss Track Moments & Workshop Gallery",
        "description": "Visual archive of VeerRacerss Electric Formula Student racing team.",
        "url": "https://veerracerss-official-web.vercel.app/gallery"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <GalleryView />
    </>
  );
}
