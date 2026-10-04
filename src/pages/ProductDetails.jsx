import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductBySlug } from '../services/products';
import { generateWhatsAppLink } from '../services/enquiries';
import './ProductDetails.css';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadProduct() {
      setLoading(true);
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
        setMainImage(data.product_images?.[0]?.image_url || 'https://via.placeholder.com/800x1000?text=No+Image');
      }
      setLoading(false);
    }
    loadProduct();
  }, [slug]);

  if (loading) return <div className="page-product pt-4xl text-center"><p className="text-muted">Loading product details...</p></div>;
  
  if (!product) return (
    <div className="page-product pt-4xl text-center">
      <h2 className="text-3xl mb-md">Product Not Found</h2>
      <Link to="/collections" className="btn btn-primary">Back to Collections</Link>
    </div>
  );

  return (
    <div className="page-product pt-3xl">
      <div className="container mt-xl mb-3xl">
        {/* Breadcrumb */}
        <div className="breadcrumb mb-xl text-sm text-muted">
          <Link to="/">Home</Link> / <Link to="/collections">Collections</Link> / <Link to={`/collections/${product.parent_categories?.name?.toLowerCase()}`}>{product.parent_categories?.name}</Link> / <span>{product.name}</span>
        </div>

        <div className="product-details-grid">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="main-image-wrap">
              <img src={mainImage} alt={product.name} className="main-image" />
            </div>
            {product.product_images && product.product_images.length > 1 && (
              <div className="thumbnails flex gap-sm mt-md">
                {product.product_images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumbnail-btn ${mainImage === img.image_url ? 'active' : ''}`}
                    onClick={() => setMainImage(img.image_url)}
                  >
                    <img src={img.image_url} alt={`${product.name} view ${idx + 1}`} className="thumbnail-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info-wrap">
            <span className="text-secondary tracking-wider text-xs uppercase font-medium">
              {product.parent_categories?.name} 
              {product.child_categories?.name ? ` • ${product.child_categories.name}` : ''}
              {product.sub_categories?.name ? ` • ${product.sub_categories.name}` : ''}
            </span>
            <h1 className="text-2xl mt-sm mb-md text-primary font-serif" style={{color: 'var(--burgundy-deep)', fontSize: '2.2rem', lineHeight: '1.2'}}>{product.name}</h1>
            {product.product_code && <p className="text-xs text-muted mb-lg" style={{color: '#6d5b50'}}>Code: {product.product_code}</p>}
            
            {product.description && (
              <p className="product-description mb-lg text-sm text-muted leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="product-attributes mb-xl mt-lg">
              <h4 className="font-sans text-xs tracking-wider uppercase mb-md border-b pb-sm" style={{color: 'var(--burgundy-deep)'}}>Details</h4>
              <ul className="attribute-list">
                {product.collection_name && <li><span className="attr-label">Collection:</span> <span className="attr-val">{product.collection_name}</span></li>}
                {product.design_name && <li><span className="attr-label">Design:</span> <span className="attr-val">{product.design_name}</span></li>}
                {product.finish && <li><span className="attr-label">Finish:</span> <span className="attr-val">{product.finish}</span></li>}
                {product.purity && <li><span className="attr-label">Purity:</span> <span className="attr-val">{product.purity}</span></li>}
                {product.weight_value && <li><span className="attr-label">Weight:</span> <span className="attr-val">{product.weight_value} {product.weight_unit}</span></li>}
                {product.huid && <li><span className="attr-label">HUID:</span> <span className="attr-val">{product.huid}</span></li>}
              </ul>
            </div>

            <div className="product-actions mt-2xl pt-xl border-t">
              {product.price_type && <p className="text-md font-medium mb-sm" style={{color: 'var(--burgundy-deep)'}}>{product.price_type}</p>}
              <a 
                href={generateWhatsAppLink(product)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-enquire-product"
              >
                Enquire via WhatsApp &rarr;
              </a>
              <p className="text-xs mt-md" style={{color: '#6d5b50'}}>Contact us via WhatsApp for precise pricing and availability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
