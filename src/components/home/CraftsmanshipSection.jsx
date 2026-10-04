import React from 'react';
import { Link } from 'react-router-dom';
import goldsmithImg from '../../assets/goldsmith.jpg';
import './CraftsmanshipSection.css';

export default function CraftsmanshipSection() {
  return (
    <section className="section craftsmanship-section">
      <div className="container">
        <div className="craftsmanship-layout">
          <div className="craftsmanship-image-col">
            <div className="goldsmith-img-wrap">
              <img 
                src={goldsmithImg} 
                alt="Srimati Goldsmith Crafting Jewelry" 
                className="goldsmith-img"
                loading="lazy"
              />
            </div>
          </div>
          <div className="craftsmanship-content-col">
            <span className="text-xs uppercase tracking-wider text-burgundy-soft mb-xs block">Our Craft</span>
            <h2 className="text-3xl md:text-4xl text-burgundy-deep font-serif m-0 mb-sm">
              Crafted by Hands,<br />
              Made to Last.
            </h2>
            <p className="text-ink opacity-80 text-md mb-md">
              Every piece carries the precision of skilled craftsmanship, tradition and attention to detail.
            </p>
            <Link to="/about" className="btn btn-outline-burgundy" style={{ height: '42px', padding: '0 24px', fontSize: '11px' }}>
              DISCOVER OUR STORY <span className="btn-arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
