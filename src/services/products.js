import { supabase } from '../lib/supabase';
import product1Img from '../assets/products/product_1.jpg';
import product2Img from '../assets/products/product_2.jpg';
import product3Img from '../assets/products/product_3.jpg';

const MOCK_PRODUCTS = [
  {
    id: '55555555-5555-5555-5555-555555555551',
    parent_category_id: '11111111-1111-1111-1111-111111111111',
    child_category_id: '33333333-3333-3333-3333-333333333332',
    name: 'Sachin Gems Mixed Chain',
    slug: 'sachin-gems-mixed-chain',
    product_code: 'SJ-GOLD-001',
    purity: '22K',
    weight_value: 12.45,
    weight_unit: 'g',
    huid: 'ABC123XY',
    is_featured: true,
    price_type: 'Approx. Price',
    product_images: [{ image_url: product1Img, is_primary: true }]
  },
  {
    id: '55555555-5555-5555-5555-555555555552',
    parent_category_id: '11111111-1111-1111-1111-111111111111',
    child_category_id: '33333333-3333-3333-3333-333333333331',
    name: 'Classic Gold Ring',
    slug: 'classic-gold-ring',
    product_code: 'SJ-GOLD-002',
    purity: '22K',
    weight_value: 4.5,
    weight_unit: 'g',
    is_featured: true,
    price_type: 'Price on Request',
    product_images: [{ image_url: product2Img, is_primary: true }]
  },
  {
    id: '55555555-5555-5555-5555-555555555553',
    parent_category_id: '22222222-2222-2222-2222-222222222222',
    child_category_id: '44444444-4444-4444-4444-444444444441',
    name: 'Elegant Silver Ring',
    slug: 'elegant-silver-ring',
    product_code: 'SJ-SILV-001',
    purity: '92.5',
    weight_value: 5.0,
    weight_unit: 'g',
    is_featured: false,
    price_type: 'Approx. Price',
    product_images: [{ image_url: product3Img, is_primary: true }]
  }
];

export async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true });
      
    if (error) throw error;
    
    // Sort images to ensure primary is first
    return processProductsImages(data || []);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return MOCK_PRODUCTS.filter(p => p.is_featured);
  }
}

export async function getProducts({ parentCategoryId, childCategoryId, searchQuery, sort } = {}) {
  try {
    let query = supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('is_published', true);
      
    if (parentCategoryId) {
      query = query.eq('parent_category_id', parentCategoryId);
    }
    
    if (childCategoryId) {
      query = query.eq('child_category_id', childCategoryId);
    }
    
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,product_code.ilike.%${searchQuery}%,collection_name.ilike.%${searchQuery}%`);
    }
    
    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'featured':
          query = query.order('is_featured', { ascending: false }).order('display_order', { ascending: true });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-asc':
          // Need to specify nulls first/last for price on request
          query = query.order('base_price', { ascending: true, nullsFirst: false });
          break;
        case 'price-desc':
          query = query.order('base_price', { ascending: false, nullsFirst: false });
          break;
        case 'name-asc':
          query = query.order('name', { ascending: true });
          break;
        default:
          query = query.order('display_order', { ascending: true });
      }
    } else {
      query = query.order('display_order', { ascending: true });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return processProductsImages(data || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    let mock = [...MOCK_PRODUCTS];
    if (parentCategoryId) mock = mock.filter(p => p.parent_category_id === parentCategoryId);
    if (childCategoryId) mock = mock.filter(p => p.child_category_id === childCategoryId);
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      mock = mock.filter(p => p.name.toLowerCase().includes(lower) || p.product_code.toLowerCase().includes(lower));
    }
    if (sort) {
      if (sort === 'name-asc') mock.sort((a,b) => a.name.localeCompare(b.name));
      if (sort === 'featured') mock.sort((a,b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }
    return mock;
  }
}

export async function getProductBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, parent_categories(name), child_categories(name), product_images(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
      
    if (error) throw error;
    
    // ensure images are sorted
    if (data && data.product_images) {
      data.product_images.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order);
    }
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    const mock = MOCK_PRODUCTS.find(p => p.slug === slug);
    if (mock) {
      return {
        ...mock,
        parent_categories: { name: mock.parent_category_id === '11111111-1111-1111-1111-111111111111' ? 'Gold' : 'Silver' },
        child_categories: { name: 'Rings' } // Mock simplified
      };
    }
    return null;
  }
}

function processProductsImages(products) {
  return products.map(product => {
    if (product.product_images) {
      product.product_images.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.display_order - b.display_order);
    }
    return product;
  });
}
