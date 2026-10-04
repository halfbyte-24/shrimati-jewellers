import React from 'react';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../common/ImageWithFallback';
import './CollectionMarquee.css';

// Import all specific category images
import goldRings from '../../assets/categories/cat_gold_rings.jpg';
import goldEarrings from '../../assets/categories/cat_gold_earrings.jpg';
import goldNecklaces from '../../assets/categories/cat_gold_necklaces.jpg';
import goldChains from '../../assets/categories/cat_gold_chains.jpg';
import goldBangles from '../../assets/categories/cat_gold_bangles.jpg';
import goldAnklets from '../../assets/categories/cat_gold_anklets.jpg';

import silverRings from '../../assets/categories/cat_silver_rings.jpg';
import silverEarrings from '../../assets/categories/cat_silver_earrings.jpg';
import silverNecklaces from '../../assets/categories/cat_silver_necklaces.jpg';
import silverChains from '../../assets/categories/cat_silver_chains.jpg';
import silverBangles from '../../assets/categories/cat_silver_bangles.jpg';
import silverAnklets from '../../assets/categories/cat_silver_anklets.jpg';

// Generic fallbacks
import product1Img from '../../assets/products/product_1.jpg';
import product2Img from '../../assets/products/product_2.jpg';
import product3Img from '../../assets/products/product_3.jpg';

export default function CollectionMarquee({ categories }) {
  // We duplicate the categories array to create a seamless infinite loop
  const marqueeItems = [...categories, ...categories];

  const imageMap = {
    'gold-rings': goldRings,
    'gold-earrings': goldEarrings,
    'gold-necklaces': goldNecklaces,
    'gold-chains': goldChains,
    'gold-bangles': goldBangles,
    'gold-anklets': goldAnklets,
    'silver-rings': silverRings,
    'silver-earrings': silverEarrings,
    'silver-necklaces': silverNecklaces,
    'silver-chains': silverChains,
    'silver-bangles': silverBangles,
    'silver-anklets': silverAnklets,
  };

  const getCategoryImage = (category, idx) => {
    // If Supabase already provided an explicitly mapped image URL, use it
    if (category.image_url) return category.image_url;
    
    // Otherwise try to map our generated campaign images
    const key = `${category.parentSlug}-${category.slug}`.toLowerCase();
    
    // Check exact match (e.g., 'gold-rings')
    if (imageMap[key]) return imageMap[key];
    
    // Fuzzy matching for similar slugs (e.g., 'gold-chain' vs 'gold-chains')
    const fuzzyKey = Object.keys(imageMap).find(k => k.includes(category.slug) || category.slug.includes(k.split('-')[1]));
    if (fuzzyKey && fuzzyKey.startsWith(category.parentSlug)) return imageMap[fuzzyKey];

    // Final fallback
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
                src={getCategoryImage(category, index)}
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
