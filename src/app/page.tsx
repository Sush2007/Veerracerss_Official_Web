import { Hero } from '../components/Hero';
import { StatsStrip } from '../components/StatsStrip';
import { CarSpotlight } from '../components/CarSpotlight';
import { About } from '../components/About';
import { AlumniNetwork } from '../components/AlumniNetwork';
import { Faculty } from '../components/Faculty';
import { TeamLeaders } from '../components/TeamLeaders';
import { Partners } from '../components/Partners';
import { FAQ } from '../components/FAQ';
import { CallToAction } from '../components/CallToAction';

export default function Home() {
  return (
    <>
      {/* 1. Hero Cockpit HUD with 3D CAD Formula Model */}
      <Hero />

      {/* 2. Formula Timing Board Paddock Stats */}
      <StatsStrip />

      {/* 3. Flagship Car Spotlight: AETHER 2024-25 */}
      <CarSpotlight />

      {/* 4. Club Origin & Engineering Legacy */}
      <About />

      {/* 5. Alumni Network & Industry Mentorship */}
      <AlumniNetwork />

      {/* 7. Academic Patronage / Faculty Advisors */}
      <Faculty />

      {/* 8. Executive Council Leadership */}
      <TeamLeaders />

      {/* 9. Official Sponsors & Technical Partners */}
      <Partners />

      {/* 10. Formula Student FAQs */}
      <FAQ />

      {/* 11. Recruitment & Paddock Call to Action */}
      <CallToAction />
    </>
  );
}
