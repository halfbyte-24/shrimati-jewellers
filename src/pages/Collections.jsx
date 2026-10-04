import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getParentCategories, getChildCategories } from '../services/categories';
import { getProducts } from '../services/products';
import ProductGrid from '../components/catalog/ProductGrid';
import CollectionHero from '../components/catalog/CollectionHero';
import ParentCategoryTabs from '../components/catalog/ParentCategoryTabs';
import ChildCategoryChips from '../components/catalog/ChildCategoryChips';
import CatalogToolbar from '../components/catalog/CatalogToolbar';
import ScrollReveal from '../components/common/ScrollReveal';
import './Collections.css';

export default function Collections() {
  const { parentSlug, childSlug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortValue, setSortValue] = useState(searchParams.get('sort') || 'featured');

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
  }, [activeParent, activeChild, searchQuery, sortValue]);

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
      searchQuery: searchQuery,
      sort: sortValue
    });
    setProducts(data);
    setLoading(false);
  }

  const handleParentSelect = (slug) => {
    if (slug === 'all') {
      navigate('/collections' + window.location.search);
    } else {
      navigate(`/collections/${slug}` + window.location.search);
    }
  };

  const handleChildSelect = (slug) => {
    if (slug === 'all') {
      navigate(`/collections/${parentSlug}` + window.location.search);
    } else {
      navigate(`/collections/${parentSlug}/${slug}` + window.location.search);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchParams(prev => {
      if (query) prev.set('q', query);
      else prev.delete('q');
      return prev;
    });
  };

  const handleSortChange = (newSort) => {
    setSortValue(newSort);
    setSearchParams(prev => {
      if (newSort !== 'featured') prev.set('sort', newSort);
      else prev.delete('sort');
      return prev;
    });
  };

  return (
    <div className="page-collections bg-ivory min-h-screen">
      <CollectionHero />

      <div className="container mt-xl pb-3xl mb-xl">
        <ScrollReveal>
          <div className="catalog-navigation-section">
            <ParentCategoryTabs 
              categories={parentCategories} 
              activeSlug={parentSlug || 'all'}
              onSelect={handleParentSelect}
            />

            {parentSlug && childCategories.length > 0 && (
              <ChildCategoryChips 
                categories={childCategories} 
                activeSlug={childSlug || 'all'}
                onSelect={handleChildSelect}
              />
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <CatalogToolbar 
            onSearch={handleSearch} 
            sortValue={sortValue} 
            onSortChange={handleSortChange} 
            totalCount={products.length}
          />
        </ScrollReveal>

        <ScrollReveal>
          <div className="catalog-results">
            <ProductGrid products={products} loading={loading} />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
