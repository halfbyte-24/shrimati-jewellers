import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../../services/products';
import ImageWithFallback from '../common/ImageWithFallback';
import './FeaturedProducts.css';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      const data = await getFeaturedProducts();
      setProducts(data);
      setLoading(false);
    }
    loadFeatured();
  }, []);

  if (loading) return <div className="section text-center">Loading featured collections...</div>;
  if (!products.length) return null;

  return (
    <section className="section bg-golden-ornate featured-products">
      {/* The watermark */}
      <img src="/src/assets/hero.png" alt="" className="watermark" aria-hidden="true" />
      
      <div className="container relative z-10">
        <div className="text-center mb-2xl">
          <span className="text-secondary-dark tracking-wider text-sm uppercase">Curated</span>
          <h2 className="text-4xl mt-sm text-primary-dark">Featured Collections</h2>
        </div>

        <div className="product-scroll-container hide-scrollbar">
          <div className="product-flex-grid">
            {products.map((product, idx) => (
              <div key={product.id} className="product-card" style={{ animationDelay: `${idx * 100}ms` }}>
                <Link to={`/product/${product.slug}`} className="product-image-wrap">
                  <ImageWithFallback
                    src={product.product_images?.[0]?.image_url} 
                    alt={product.name} 
                    className="product-img"
                    loading="lazy"
                  />
                  <div className="product-hover-overlay">
                    <span className="btn btn-outline text-white border-white">View Details</span>
                  </div>
                </Link>
                <div className="product-info mt-md">
                  <span className="text-secondary-dark text-xs uppercase tracking-wider mb-xs block">
                    {product.parent_categories?.name || 'Srimati Gems'}
                  </span>
                  <h3 className="product-name text-lg mb-xs text-primary-dark">{product.name}</h3>
                  <div className="flex justify-between items-center mt-sm">
                    <p className="text-muted text-sm">{product.purity} • {product.weight_value} {product.weight_unit}</p>
                    <span className="text-primary-dark arrow-icon">&rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
