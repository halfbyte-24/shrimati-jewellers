import React, { useState } from 'react';
import './ImageWithFallback.css';

export default function ImageWithFallback({ src, alt, className = '', ...props }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (hasError || !src) {
    return (
      <div className={`image-fallback ${className}`}>
        <div className="fallback-content">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="fallback-icon">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span className="fallback-text">Image Unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Product image"}
      className={`image-with-fallback ${isLoaded ? 'loaded' : ''} ${className}`}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
}
