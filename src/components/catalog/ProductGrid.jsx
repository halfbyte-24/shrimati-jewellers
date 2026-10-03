import React from 'react';
import { Link } from 'react-router-dom';
import './ProductGrid.css';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="product-grid-empty">
        <p className="text-muted">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-empty">
        <h3 className="text-2xl mb-sm">No products found</h3>
        <p className="text-muted">We couldn't find a matching piece. Try another search or category.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="catalog-product-card">
          <Link to={`/product/${product.slug}`} className="catalog-image-wrap">
            <img 
              src={product.product_images?.[0]?.image_url || 'https://via.placeholder.com/400x500?text=No+Image'} 
              alt={product.name} 
              className="catalog-img"
              loading="lazy"
            />
            <div className="catalog-hover-overlay">
              <span className="btn btn-outline text-white border-white">View Details</span>
            </div>
          </Link>
          <div className="catalog-product-info mt-md">
            <h3 className="catalog-product-name text-lg mb-xs">{product.name}</h3>
            <p className="text-muted text-sm">
              {product.purity && <span>{product.purity}</span>}
              {product.purity && product.weight_value && <span> • </span>}
              {product.weight_value && <span>{product.weight_value} {product.weight_unit}</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
