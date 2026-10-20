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
  alternates: {
    canonical: 'https://veerracerss-official-web.vercel.app/gallery',
  },
  openGraph: {
    title: 'Track Moments & Workshop Gallery | VeerRacerss Electric',
    description: 'Yearwise visual archive of VeerRacerss Electric Formula Student racing team.',
    url: 'https://veerracerss-official-web.vercel.app/gallery',
    images: [{ url: 'https://veerracerss-official-web.vercel.app/og-image.png', width: 1200, height: 630, alt: 'VeerRacerss Gallery' }]
  }
};

export default function GalleryPage() {
  return <GalleryView />;
}
