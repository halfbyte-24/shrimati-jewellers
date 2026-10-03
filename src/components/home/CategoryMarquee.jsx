import React, { useEffect, useState } from 'react';
import { getParentCategories, getChildCategories } from '../../services/categories';
import { useNavigate } from 'react-router-dom';
import './CategoryMarquee.css';

export default function CategoryMarquee() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCategories() {
      // Fetch both parents and some children to make the marquee rich
      const parents = await getParentCategories();
      const children = await getChildCategories(parents[0]?.id); // Just grab some children
      
      const allNames = [
        ...parents.map(p => ({ name: p.name, slug: p.slug, type: 'parent' })),
        ...(children || []).map(c => ({ name: c.name, slug: c.slug, type: 'child' }))
      ];
      
      // Fallback if DB is empty
      if (allNames.length === 0) {
        setCategories([
          {name: 'GOLD', slug: 'gold'}, 
          {name: 'SILVER', slug: 'silver'}, 
          {name: 'RINGS', slug: 'rings'}, 
          {name: 'EARRINGS', slug: 'earrings'}, 
          {name: 'CHAINS', slug: 'chains'},
          {name: 'NECKLACES', slug: 'necklaces'},
          {name: 'BANGLES', slug: 'bangles'},
          {name: 'PENDANTS', slug: 'pendants'}
        ]);
        return;
      }
      
      setCategories(allNames);
    }
    loadCategories();
  }, []);

  if (categories.length === 0) return null;

  // Duplicate for seamless infinite loop
  const repeatedCategories = [...categories, ...categories, ...categories, ...categories];

  const handleCategoryClick = (cat) => {
    navigate(`/collections/${cat.slug}`);
  };

  return (
    <div className="category-marquee-container">
      <div className="marquee-track">
        {repeatedCategories.map((cat, idx) => (
          <React.Fragment key={`${cat.slug}-${idx}`}>
            <span 
              className="marquee-item" 
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.name.toUpperCase()}
            </span>
            <span className="marquee-separator">✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
