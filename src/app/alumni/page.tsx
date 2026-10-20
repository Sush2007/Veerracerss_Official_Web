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
  alternates: {
    canonical: 'https://veerracerss-official-web.vercel.app/alumni',
  },
  openGraph: {
    title: 'Alumni Network & Industry Mentors | VeerRacerss Electric',
    description: 'VeerRacerss alumni leading engineering across Ather Energy, Tata Motors EV, Mahindra Racing, and Ola Electric.',
    url: 'https://veerracerss-official-web.vercel.app/alumni',
    images: [{ url: 'https://veerracerss-official-web.vercel.app/og-image.png', width: 1200, height: 630, alt: 'VeerRacerss Alumni' }]
  }
};

export default function AlumniPage() {
  return <AlumniView />;
}
