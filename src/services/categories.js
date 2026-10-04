import { supabase } from '../lib/supabase';

// Mock data fallback in case Supabase is not connected yet
const MOCK_CATEGORIES = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Gold', slug: 'gold' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Silver', slug: 'silver' }
];

const MOCK_CHILD_CATEGORIES = [
  { id: '33333333-3333-3333-3333-333333333331', parent_category_id: '11111111-1111-1111-1111-111111111111', name: 'Rings', slug: 'gold-rings' },
  { id: '33333333-3333-3333-3333-333333333332', parent_category_id: '11111111-1111-1111-1111-111111111111', name: 'Chains', slug: 'gold-chains' },
  { id: '44444444-4444-4444-4444-444444444441', parent_category_id: '22222222-2222-2222-2222-222222222222', name: 'Rings', slug: 'silver-rings' }
];

const MOCK_SUB_CATEGORIES = [
  { id: '55555555-5555-5555-5555-555555555551', child_category_id: '33333333-3333-3333-3333-333333333331', name: 'Engagement', slug: 'engagement' },
  { id: '55555555-5555-5555-5555-555555555552', child_category_id: '33333333-3333-3333-3333-333333333331', name: 'Cocktail', slug: 'cocktail' }
];

export async function getParentCategories() {
  try {
    const { data, error } = await supabase
      .from('parent_categories')
      .select('*')
      .order('display_order', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    return MOCK_CATEGORIES;
  }
}

export async function getChildCategories(parentCategoryId = null) {
  try {
    let query = supabase
      .from('child_categories')
      .select('*')
      .order('display_order', { ascending: true });
      
    if (parentCategoryId) {
      query = query.eq('parent_category_id', parentCategoryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching child categories:', error);
    if (parentCategoryId) {
      return MOCK_CHILD_CATEGORIES.filter(c => c.parent_category_id === parentCategoryId);
    }
    return MOCK_CHILD_CATEGORIES;
  }
}

export async function getSubCategories(childCategoryId = null) {
  try {
    let query = supabase
      .from('sub_categories')
      .select('*')
      .order('display_order', { ascending: true });
      
    if (childCategoryId) {
      query = query.eq('child_category_id', childCategoryId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sub categories:', error);
    if (childCategoryId) {
      return MOCK_SUB_CATEGORIES.filter(c => c.child_category_id === childCategoryId);
    }
    return MOCK_SUB_CATEGORIES;
  }
}
