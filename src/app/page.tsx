import { Architecture } from '@/sections/Architecture';
import { Audiences } from '@/sections/Audiences';
import { EarlyAccessSection } from '@/sections/EarlyAccessSection';
import { Faq } from '@/sections/Faq';
import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks';
import { Problem } from '@/sections/Problem';
import { Roadmap } from '@/sections/Roadmap';
import { WhatYouGet } from '@/sections/WhatYouGet';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <WhatYouGet />
      <Audiences />
      <Architecture />
      <Roadmap />
      <EarlyAccessSection />
      <Faq />
    </>
  );
}
