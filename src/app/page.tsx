import type { Metadata } from 'next';
import { Hero } from '../components/Hero';
import { TrackMoments } from '../components/TrackMoments';
import { StatsStrip } from '../components/StatsStrip';
import { CarSpotlight } from '../components/CarSpotlight';
import { About } from '../components/About';
import { AlumniNetwork } from '../components/AlumniNetwork';
import { Faculty } from '../components/Faculty';
import { TeamLeaders } from '../components/TeamLeaders';
import { Partners } from '../components/Partners';
import { FAQ } from '../components/FAQ';

export const metadata: Metadata = {
  title: 'VeerRacerss Electric | The Official Student Formula Racing Club | VSSUT Burla',
  description: 'Official website of VeerRacerss Electric, VSSUT Burla. Odisha\'s premier Formula Student EV racing team designing, manufacturing, and racing high-performance electric formula racecars in Formula Bharat & Formula Imperial.',
  alternates: {
    canonical: 'https://veerracerss-official-web.vercel.app',
  },
  openGraph: {
    title: 'VeerRacerss Electric | The Official Student Formula Racing Club | VSSUT Burla',
    description: 'Official website of VeerRacerss Electric, VSSUT Burla. Odisha\'s premier Formula Student EV racing team.',
    url: 'https://veerracerss-official-web.vercel.app',
    siteName: 'VeerRacerss Electric',
    images: [
      {
        url: 'https://veerracerss-official-web.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VeerRacerss Electric Official Flagship',
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      {/* 1. Hero Cockpit with 3D CAD Formula Model */}
      <Hero />

      {/* 2. Track & Workshop Moments: Autoplay Horizontal Reel */}
      <TrackMoments />

      {/* 3. Racing Track Record Stats */}
      <StatsStrip />

      {/* 4. Flagship Car Spotlight: AETHER */}
      <CarSpotlight />

      {/* 5. Club Origin & Engineering Legacy */}
      <About />

      {/* 6. Alumni Network & Industry Mentorship */}
      <AlumniNetwork />

      {/* 7. Academic Patronage / Faculty Advisors */}
      <Faculty />

      {/* 8. Executive Council Leadership */}
      <TeamLeaders />

      {/* 9. Official Sponsors & Technical Partners */}
      <Partners />

      {/* 10. Formula Student FAQs */}
      <FAQ />
    </>
  );
}
