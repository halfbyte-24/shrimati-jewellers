import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithFallback from '../common/ImageWithFallback';
import './ProductGrid.css';

export default function ProductGrid({ products, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="product-grid">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="catalog-product-card skeleton">
            <div className="catalog-image-wrap skeleton-img"></div>
            <div className="catalog-product-info mt-md">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-meta"></div>
              <div className="skeleton-line skeleton-meta short"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-empty">
        <div className="empty-state-icon">✦</div>
        <h3 className="text-3xl mb-sm font-serif text-primary-dark">No pieces found</h3>
        <p className="text-muted text-lg max-w-md mx-auto mb-xl">
          We couldn't find any jewelry matching your exact criteria. 
          Try adjusting your filters or explore our other collections.
        </p>
        <button 
          onClick={() => {
            navigate('/collections');
            // reset all search params
          }} 
          className="btn btn-outline border-black text-burgundy-deep"
        >
          Explore All Collections
        </button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product, idx) => (
        <div key={product.id} className="catalog-product-card" style={{ animationDelay: `${idx * 70}ms` }}>
          <Link to={`/product/${product.slug}`} className="catalog-image-wrap">
            <ImageWithFallback 
              src={product.product_images?.[0]?.image_url} 
              alt={product.name} 
              className="catalog-img"
              loading="lazy"
            />
            <div className="catalog-hover-overlay">
              <span className="btn btn-outline text-white border-white">View Details</span>
            </div>
          </Link>
          <div className="catalog-product-info mt-md">
            <div className="flex justify-between items-start mb-xs">
              <span className="text-secondary-dark text-xs uppercase tracking-wider block">
                {product.parent_categories?.name || 'Srimati Gems'}
              </span>
              <button className="wishlist-btn" aria-label="Add to wishlist">♡</button>
            </div>
            
            <h3 className="catalog-product-name text-lg mb-xs text-primary-dark font-serif">{product.name}</h3>
            
            <div className="flex justify-between items-center mt-sm">
              <p className="text-muted text-sm font-sans">
                {product.purity && <span>{product.purity}</span>}
                {product.purity && product.weight_value && <span> • </span>}
                {product.weight_value && <span>{product.weight_value} {product.weight_unit}</span>}
              </p>
              <Link to={`/product/${product.slug}`} className="text-primary-dark arrow-icon font-sans uppercase text-xs tracking-wider">
                View Piece &rarr;
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
