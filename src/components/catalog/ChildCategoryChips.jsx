import React from 'react';
import './ChildCategoryChips.css';

export default function ChildCategoryChips({ categories, activeSlug, onSelect }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="child-category-chips hide-scrollbar">
      <button
        className={`child-chip-btn ${activeSlug === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        <span className="child-chip-name">All Pieces</span>
        <span className="child-chip-view">View &rarr;</span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`child-chip-btn ${activeSlug === cat.slug ? 'active' : ''}`}
          onClick={() => onSelect(cat.slug)}
        >
          <span className="child-chip-name">{cat.name}</span>
          <span className="child-chip-view">View &rarr;</span>
        </button>
      ))}
    </div>
  );
}
