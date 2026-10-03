import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandStory() {
  return (
    <section className="section bg-burgundy">
      <div className="container">
        <div className="grid grid-cols-2 gap-4xl items-center">
          <div className="story-image hidden-md" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img 
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000" 
              alt="Craftsmanship" 
              className="w-full h-auto"
              style={{ display: 'block', width: '100%', aspectRatio: '4/5', objectFit: 'cover' }}
            />
          </div>
          <div className="story-content text-center md:text-left">
            <span className="text-secondary-light tracking-wider text-sm uppercase">Our Story</span>
            <h2 className="text-4xl lg:text-5xl mt-sm mb-lg text-white font-serif">A Legacy of Fine Craftsmanship</h2>
            <p className="text-cream opacity-80 text-lg mb-md">
              At Srimati Jewelers, we believe that jewelry is more than just an accessory; it is a reflection of heritage, art, and emotion. 
              Our commitment to purity and perfection has made us a trusted name in fine jewelry.
            </p>
            <p className="text-cream opacity-80 text-lg mb-xl">
              Every piece in our collection is thoughtfully designed to blend traditional artistry with modern elegance, ensuring that you shine on every occasion.
            </p>
            <Link to="/about" className="btn btn-outline border-white text-white">Read Our Full Story</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
