import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import heroImg from '../../assets/Hero.jpeg';
export default function Hero() {
  return (
    <section className="hero bg-burgundy">
      <div className="hero-background">
        <img 
          src={heroImg} 
          alt="Srimati Jewelers Collection" 
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content text-center">
        <div className="hero-actions flex justify-center gap-md">
          <Link to="/collections" className="btn btn-primary bg-secondary text-black hover-opacity">Explore Collections</Link>
          <Link to="/contact" className="btn btn-outline text-white border-white">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
