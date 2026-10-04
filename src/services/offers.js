import { supabase } from '../lib/supabase';

export async function getActiveOffers() {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('display_order', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching active offers:', error);
    return [];
  }
}

export async function getAllOffers() {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('display_order', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all offers:', error);
    return [];
  }
}

export async function createOffer(offerData) {
  try {
    const { data, error } = await supabase
      .from('offers')
      .insert([offerData])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating offer:', error);
    throw error;
  }
}

export async function updateOffer(id, offerData) {
  try {
    const { data, error } = await supabase
      .from('offers')
      .update({ ...offerData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
}

export async function deleteOffer(id) {
  try {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
}
