import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import ExploreCollections from '../components/home/ExploreCollections';
import BrandStory from '../components/home/BrandStory';

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-home">
      <Hero />
      <div className="home-content-curtain">
        <FeaturedProducts />
        <ExploreCollections />
        <BrandStory />
      </div>
    </div>
  );
}
