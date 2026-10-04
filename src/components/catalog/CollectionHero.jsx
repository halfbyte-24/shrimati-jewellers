import React from 'react';
import './CollectionHero.css';

export default function CollectionHero() {
  return (
    <div className="collection-hero">
      <div className="collection-hero-bg"></div>
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl text-primary-dark font-serif mb-sm">Our Collections</h1>
        <p className="text-muted text-base max-w-2xl mx-auto">
          Discover pieces crafted to become part of your story.
        </p>
        <div className="hero-divider mt-md mb-md">
          <span className="hero-divider-line"></span>
          <span className="hero-divider-icon">✦</span>
          <span className="hero-divider-line"></span>
        </div>
        <p className="text-sm tracking-wider uppercase text-secondary-dark">
          Gold • Silver • Fine Jewelry
        </p>
      </div>
    </div>
  );
}
