import React, { useState, useRef, useEffect } from 'react';
import './SortDropdown.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' }
];

export default function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button 
        className={`sort-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="sort-label">Sort by {activeOption.label}</span>
        <span className="sort-chevron">▼</span>
      </button>

      {isOpen && (
        <ul className="sort-menu" role="listbox">
          {SORT_OPTIONS.map((opt) => (
            <li 
              key={opt.value}
              className={`sort-option ${value === opt.value ? 'active' : ''}`}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              <span className="sort-option-check">{value === opt.value ? '✓' : ''}</span>
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
