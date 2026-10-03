import React from 'react';
import './ParentCategoryTabs.css';

export default function ParentCategoryTabs({ categories, activeSlug, onSelect }) {
  return (
    <div className="parent-category-tabs hide-scrollbar">
      <button
        className={`parent-tab-btn ${activeSlug === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        ALL
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`parent-tab-btn ${activeSlug === cat.slug ? 'active' : ''}`}
          onClick={() => onSelect(cat.slug)}
        >
          {cat.name.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
