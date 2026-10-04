import React, { useState } from 'react';
import SortDropdown from './SortDropdown';
import './CatalogToolbar.css';

export default function CatalogToolbar({ onSearch, sortValue, onSortChange, totalCount }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <div className="catalog-toolbar">
      <div className="toolbar-left">
        <form className="catalog-search" onSubmit={handleSearchSubmit}>
          <button type="submit" className="search-icon" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <input 
            type="text" 
            placeholder="Search jewellery, collection..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      <div className="toolbar-center desktop-only">
        <span className="results-count">Showing {totalCount} piece{totalCount !== 1 ? 's' : ''}</span>
      </div>

      <div className="toolbar-right">
        <SortDropdown value={sortValue} onChange={onSortChange} />
      </div>
    </div>
  );
}
