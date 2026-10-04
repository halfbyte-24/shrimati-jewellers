import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../common/ImageWithFallback';
import product1Img from '../../assets/products/product_1.jpg';
import product2Img from '../../assets/products/product_2.jpg';
import product3Img from '../../assets/products/product_3.jpg';
import './CollectionMarquee.css';

export default function CollectionMarquee({ categories }) {
  // We duplicate the categories array to create a seamless infinite loop
  const marqueeItems = [...categories, ...categories];

  const getFallbackImage = (idx) => {
    const images = [product1Img, product2Img, product3Img];
    return images[idx % images.length];
  };

  return (
    <div className="collection-marquee-container">
      <div className="collection-marquee-track">
        {marqueeItems.map((category, index) => (
          <Link 
            key={`${category.id}-${index}`} 
            to={`/collections/${category.parentSlug}/${category.slug}`}
            className="marquee-card"
          >
            <div className="marquee-img-wrap">
              <ImageWithFallback 
                src={category.image_url || getFallbackImage(index)}
                alt={`${category.parentName} ${category.name}`}
                className="marquee-img"
              />
              <div className="marquee-overlay"></div>
            </div>
            <div className="marquee-content">
              <span className="marquee-parent text-xs tracking-wider uppercase">{category.parentName}</span>
              <div className="marquee-footer">
                <h3 className="marquee-title font-serif">{category.name}</h3>
                <span className="marquee-arrow">&rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
