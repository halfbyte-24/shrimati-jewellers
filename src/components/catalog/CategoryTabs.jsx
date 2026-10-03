import React from 'react';
import './CategoryTabs.css';

export default function CategoryTabs({ categories, activeSlug, onSelect, isParent }) {
  return (
    <div className={`category-tabs ${isParent ? 'parent-tabs' : 'child-tabs'}`}>
      <button
        className={`tab-btn ${activeSlug === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`tab-btn ${activeSlug === cat.slug ? 'active' : ''}`}
          onClick={() => onSelect(cat.slug)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
