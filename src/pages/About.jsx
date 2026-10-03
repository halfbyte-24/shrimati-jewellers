import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-about pt-4xl">
      <div className="container mt-2xl mb-4xl">
        <div className="text-center max-w-2xl mx-auto mb-4xl">
          <span className="text-secondary tracking-wider text-sm uppercase">About Us</span>
          <h1 className="text-5xl mt-sm mb-lg text-primary">Our Heritage</h1>
          <p className="text-lg text-muted">
            For generations, Srimati Jewelers has been a symbol of trust, purity, and unparalleled craftsmanship. 
            Located in the heart of Uluberia, we bring you jewelry that tells a story.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4xl items-center mb-4xl">
          <div className="about-img-wrap" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000" alt="Craftsmanship" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '4/5' }} />
          </div>
          <div>
            <h2 className="text-3xl mb-md">The Art of Fine Jewelry</h2>
            <p className="text-muted mb-md">
              Our master artisans dedicate countless hours to handcrafting pieces that transcend time. We believe that true luxury lies in the details—the precision of the cut, the purity of the metal, and the harmony of the design.
            </p>
            <p className="text-muted">
              Whether you are looking for a statement piece for a grand occasion or an elegant everyday wear, Srimati Jewelers offers a diverse collection that caters to every taste and tradition.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4xl items-center mb-4xl" style={{ direction: 'rtl' }}>
          <div className="about-img-wrap" style={{ borderRadius: '12px', overflow: 'hidden', direction: 'ltr' }}>
            <img src="https://images.unsplash.com/photo-1599643478524-fb66f7ca065b?auto=format&fit=crop&q=80&w=1000" alt="Store" style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '4/5' }} />
          </div>
          <div style={{ direction: 'ltr' }}>
            <h2 className="text-3xl mb-md">Trust & Purity</h2>
            <p className="text-muted mb-md">
              Purity is not just a standard for our gold; it is the foundation of our relationship with you. Every piece of Srimati gold jewelry is hallmarked, ensuring you receive only the finest quality.
            </p>
            <p className="text-muted mb-lg">
              Visit our showroom to experience the warmth of our hospitality and the brilliance of our collections.
            </p>
            <Link to="/contact" className="btn btn-primary">Visit Our Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
