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
            <span className="text-sm uppercase tracking-wider text-burgundy-soft mb-sm block">Our Craft</span>
            <h2 className="text-4xl md:text-5xl text-burgundy-deep font-serif m-0 mb-md">
              Crafted by Hands,<br />
              Made to Last.
            </h2>
            <p className="text-ink opacity-80 text-lg mb-lg">
              Every piece carries the precision of skilled craftsmanship, tradition and attention to detail.
            </p>
            <Link to="/about" className="btn btn-outline-burgundy">
              DISCOVER OUR STORY <span className="btn-arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
