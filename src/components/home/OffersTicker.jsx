import React, { useEffect, useState } from 'react';
import { getActiveOffers } from '../../services/offers';
import './OffersTicker.css';

export default function OffersTicker() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        const data = await getActiveOffers();
        setOffers(data);
      } catch (error) {
        console.error('Failed to load offers:', error);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  if (loading || offers.length === 0) return null;

  const renderOffers = () => (
    <>
      {offers.map((offer, index) => (
        <React.Fragment key={offer.id}>
          <span className="offers-ticker-text">{offer.display_text}</span>
          <span className="offers-ticker-separator">✦</span>
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div className="offers-ticker-wrapper">
      <div className="offers-ticker-container">
        <div className="offers-ticker-track">
          <div className="offers-ticker-item">
            {renderOffers()}
          </div>
          <div className="offers-ticker-item">
            {renderOffers()}
          </div>
        </div>
      </div>
    </div>
  );
}
