import { Hero } from '../components/Hero';
import { StatsStrip } from '../components/StatsStrip';
import { About } from '../components/About';
import { News } from '../components/News';
import { Faculty } from '../components/Faculty';
import { TeamLeaders } from '../components/TeamLeaders';
import { Partners } from '../components/Partners';
import { FAQ } from '../components/FAQ';
import { CallToAction } from '../components/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <About />
      <News />
      <Faculty />
      <TeamLeaders />
      <Partners />
      <FAQ />
      <CallToAction />
    </>
  );
}
