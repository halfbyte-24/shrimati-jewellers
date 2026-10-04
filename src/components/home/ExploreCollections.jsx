import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getParentCategories, getChildCategories } from '../../services/categories';
import CollectionMarquee from './CollectionMarquee';
import './ExploreCollections.css';

export default function ExploreCollections() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const pCats = await getParentCategories();
      const cCats = await getChildCategories(); // gets all child categories

      const displayableCategories = cCats.map(child => {
        const parent = pCats.find(p => p.id === child.parent_category_id);
        return {
          ...child,
          parentSlug: parent?.slug || 'gold',
          parentName: parent?.name || 'Gold'
        };
      });

      setCategories(displayableCategories);
    }
    loadCategories();
  }, []);

  return (
    <section className="section explore-collections">
      <div className="container">
        {/* Header */}
        <div className="explore-header flex justify-between items-end flex-wrap gap-md mb-xl">
          <div>
            <span className="text-sm uppercase tracking-wider text-gold mb-xs block">Explore Our</span>
            <h2 className="text-4xl md:text-5xl text-burgundy-deep font-serif m-0">Collections</h2>
          </div>
          <Link to="/collections" className="btn btn-outline-burgundy hidden-md">
            VIEW ALL COLLECTIONS <span className="btn-arrow">&rarr;</span>
          </Link>
        </div>

        {/* Carousel */}
        <div className="carousel-block-full">
          {categories.length > 0 ? (
            <CollectionMarquee categories={categories} />
          ) : (
            <div className="text-center text-burgundy-deep opacity-60 py-2xl">
              Loading collections...
            </div>
          )}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-xl text-center hidden-md-up">
          <Link to="/collections" className="btn btn-outline-burgundy">
            VIEW ALL COLLECTIONS <span className="btn-arrow">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
