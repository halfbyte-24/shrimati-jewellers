import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParentCategories, getChildCategories } from '../services/categories';
import { getProducts } from '../services/products';
import CategoryTabs from '../components/catalog/CategoryTabs';
import ProductGrid from '../components/catalog/ProductGrid';
import SearchBar from '../components/catalog/SearchBar';
import './Collections.css';

export default function Collections() {
  const { parentSlug, childSlug } = useParams();
  const navigate = useNavigate();
  
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Find active IDs
  const activeParent = parentCategories.find(c => c.slug === parentSlug);
  const activeChild = childCategories.find(c => c.slug === childSlug);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeParent) {
      loadChildCategories(activeParent.id);
    } else {
      setChildCategories([]);
    }
  }, [activeParent]);

  useEffect(() => {
    loadProducts();
  }, [activeParent, activeChild, searchQuery]);

  async function loadInitialData() {
    setLoading(true);
    const pCats = await getParentCategories();
    setParentCategories(pCats);
    setLoading(false);
  }

  async function loadChildCategories(parentId) {
    const cCats = await getChildCategories(parentId);
    setChildCategories(cCats);
  }

  async function loadProducts() {
    setLoading(true);
    const data = await getProducts({
      parentCategoryId: activeParent?.id,
      childCategoryId: activeChild?.id,
      searchQuery: searchQuery
    });
    setProducts(data);
    setLoading(false);
  }

  const handleParentSelect = (slug) => {
    if (slug === 'all') {
      navigate('/collections');
    } else {
      navigate(`/collections/${slug}`);
    }
  };

  const handleChildSelect = (slug) => {
    if (slug === 'all') {
      navigate(`/collections/${parentSlug}`);
    } else {
      navigate(`/collections/${parentSlug}/${slug}`);
    }
  };

  return (
    <div className="page-collections">
      <div className="collections-header bg-golden-ornate py-3xl text-center">
        <h1 className="text-5xl text-black">Our Collections</h1>
        <p className="text-black max-w-2xl mx-auto mt-md px-md">
          Explore our wide range of exquisitely crafted jewelry. Filter by category to find your perfect piece.
        </p>
      </div>

      <div className="container mt-xl mb-3xl">
        <div className="catalog-layout">
          <div className="catalog-sidebar">
            <SearchBar onSearch={setSearchQuery} />
            <div className="mt-xl">
              <h3 className="font-sans text-sm tracking-wider uppercase text-muted mb-md">Category</h3>
              <CategoryTabs 
                categories={parentCategories} 
                activeSlug={parentSlug || 'all'}
                onSelect={handleParentSelect}
                isParent={true}
              />
            </div>

            {parentSlug && childCategories.length > 0 && (
              <div className="mt-xl">
                <h3 className="font-sans text-sm tracking-wider uppercase text-muted mb-md">Type</h3>
                <CategoryTabs 
                  categories={childCategories} 
                  activeSlug={childSlug || 'all'}
                  onSelect={handleChildSelect}
                  isParent={false}
                />
              </div>
            )}
          </div>
          
          <div className="catalog-content">
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
