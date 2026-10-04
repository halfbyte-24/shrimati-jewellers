import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import CategoryMarquee from '../components/home/CategoryMarquee';
import FeaturedProducts from '../components/home/FeaturedProducts';
import ExploreCollections from '../components/home/ExploreCollections';
import CraftsmanshipSection from '../components/home/CraftsmanshipSection';
import ScrollReveal from '../components/common/ScrollReveal';

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-home">
      <Hero />
      <div className="home-content-curtain">
        <CategoryMarquee />
        
        <ScrollReveal>
          <FeaturedProducts />
        </ScrollReveal>
        
        <ScrollReveal>
          <ExploreCollections />
        </ScrollReveal>

        <ScrollReveal>
          <CraftsmanshipSection />
        </ScrollReveal>
      </div>
    </div>
  );
}
