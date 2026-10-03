import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero bg-burgundy">
      <div className="hero-background">
        <img 
          src="https://images.unsplash.com/photo-1599643478524-fb66f7ca065b?auto=format&fit=crop&q=80&w=2000" 
          alt="Srimati Jewelers Collection" 
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content text-center">
        <span className="hero-eyebrow text-secondary uppercase tracking-wider text-sm mb-md block">Srimati Jewelers</span>
        <h1 className="hero-title font-bengali text-5xl md:text-6xl lg:text-7xl mb-lg">
          আভিজাত্যের<br/>নতুন সংজ্ঞাই
        </h1>
        <p className="hero-subtitle text-lg mb-xl max-w-2xl mx-auto">
          Timeless Craft. Modern Elegance.<br/>
          Discover thoughtfully crafted jewelry collections from Srimati Jewelers.
        </p>
        
        <div className="hero-actions flex justify-center gap-md">
          <Link to="/collections" className="btn btn-primary bg-secondary text-black hover-opacity">Explore Collections</Link>
          <Link to="/contact" className="btn btn-outline text-white border-white">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
