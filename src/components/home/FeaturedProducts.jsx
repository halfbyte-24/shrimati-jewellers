import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../../services/products';
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
    <section className="section featured-products">
      <div className="container">
        <div className="text-center mb-2xl">
          <span className="text-secondary tracking-wider text-sm uppercase">Curated</span>
          <h2 className="text-4xl mt-sm">Featured Collections</h2>
        </div>

        <div className="product-scroll-container hide-scrollbar">
          <div className="product-flex-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.slug}`} className="product-image-wrap">
                  <img 
                    src={product.product_images?.[0]?.image_url || 'https://via.placeholder.com/400x500?text=No+Image'} 
                    alt={product.name} 
                    className="product-img"
                    loading="lazy"
                  />
                  <div className="product-hover-overlay">
                    <span className="btn btn-outline text-white border-white">View Details</span>
                  </div>
                </Link>
                <div className="product-info mt-md text-center">
                  <h3 className="product-name text-lg mb-xs">{product.name}</h3>
                  <p className="text-muted text-sm">{product.purity} • {product.weight_value} {product.weight_unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
