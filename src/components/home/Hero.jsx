import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import heroImg from '../../assets/Hero.jpeg';

import heroImgMobile from '../../assets/Hero-mobile.png';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation slightly after mount for smooth reveal
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`hero bg-burgundy ${loaded ? 'hero-loaded' : ''}`}>
      <div className="hero-background">
        <picture>
          <source media="(max-aspect-ratio: 3/4) and (max-width: 768px)" srcSet={heroImgMobile} />
          <source media="(max-width: 480px)" srcSet={heroImgMobile} />
          <img
            src={heroImg}
            alt="Srimati Jewelers Collection"
            className="hero-image"
          />
        </picture>
        <div className="hero-overlay"></div>
      </div>

      <div className="container hero-content text-center">
      </div>
    </section>
  );
}
