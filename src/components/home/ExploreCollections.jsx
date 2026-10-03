import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getParentCategories } from '../../services/categories';
import product1Img from '../../assets/products/product_1.jpg';
import product2Img from '../../assets/products/product_2.jpg';
import product3Img from '../../assets/products/product_3.jpg';
import './ExploreCollections.css';

export default function ExploreCollections() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const data = await getParentCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  return (
    <section className="section explore-collections">
      <div className="container">
        <div className="flex justify-between items-center mb-xl flex-wrap gap-md">
          <div>
            <span className="text-sm uppercase tracking-wider text-black">Explore Our</span>
            <h2 className="text-5xl mt-sm text-black">Collections</h2>
          </div>
          <Link to="/collections" className="btn btn-outline border-black text-black hidden-md">
            View All Collections &rarr;
          </Link>
        </div>

        <div className="collections-grid">
          {categories.map(category => (
            <Link 
              key={category.id} 
              to={`/collections/${category.slug}`} 
              className="collection-card"
            >
              <div className="collection-img-wrap">
                <img 
                  src={category.slug === 'gold' ? product2Img : product3Img}
                  alt={category.name}
                  className="collection-img"
                  loading="lazy"
                />
              </div>
              <div className="collection-card-footer flex justify-between items-center">
                <h3 className="text-xl text-white m-0 font-serif">{category.name}</h3>
                <span className="collection-arrow text-white">&rarr;</span>
              </div>
            </Link>
          ))}
          {/* Static cards for demonstration of the layout */}
          <Link to="/collections" className="collection-card">
              <div className="collection-img-wrap">
                <img src={product1Img} alt="Diamond" className="collection-img" loading="lazy" />
              </div>
              <div className="collection-card-footer flex justify-between items-center">
                <h3 className="text-xl text-white m-0 font-serif">Diamond</h3>
                <span className="collection-arrow text-white">&rarr;</span>
              </div>
          </Link>
          <Link to="/collections" className="collection-card">
              <div className="collection-img-wrap">
                <img src={product2Img} alt="Gold + Diamond" className="collection-img" loading="lazy" />
              </div>
              <div className="collection-card-footer flex justify-between items-center">
                <h3 className="text-xl text-white m-0 font-serif">Gold + Diamond</h3>
                <span className="collection-arrow text-white">&rarr;</span>
              </div>
          </Link>
        </div>

        <div className="mt-xl text-center hidden-md-up">
          <Link to="/collections" className="btn btn-outline border-black text-black">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
