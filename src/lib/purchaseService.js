import { supabase } from './supabase';

/**
 * Save a purchase to the database
 * @param {Object} purchaseData - The purchase data to save
 * @returns {Promise<{data: any, error: any}>} - The result of the database operation
 */
export const savePurchase = async (purchaseData) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select();

    if (error) {
      console.error('Error saving purchase:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error saving purchase:', error);
    return { data: null, error };
  }
};

/**
 * Get all purchases for a specific user
 * @param {string} userId - The user ID to get purchases for
 * @returns {Promise<{data: any[], error: any}>} - The purchases data
 */
export const getUserPurchases = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        cycles (
          id,
          name,
          brand,
          model,
          type,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user purchases:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching user purchases:', error);
    return { data: [], error };
  }
};

/**
 * Get all purchases (admin function)
 * @returns {Promise<{data: any[], error: any}>} - All purchases data
 */
export const getAllPurchases = async () => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        cycles (
          id,
          name,
          brand,
          model,
          type,
          image_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all purchases:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching all purchases:', error);
    return { data: [], error };
  }
};

/**
 * Get a purchase by bill number (order_id)
 * @param {string} billNumber
 * @returns {Promise<{data: any, error: any}>}
 */
export const getPurchaseByBillNumber = async (billNumber) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        cycles (
          id,
          name,
          brand,
          model,
          image_url,
          computedPrice,
          price
        )
      `)
      .eq('bill_number', billNumber)
      .single();
    if (error) return { data: null, error };
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Update purchase status
 * @param {string} purchaseId - The purchase ID to update
 * @param {string} status - The new status
 * @returns {Promise<{data: any, error: any}>} - The result of the update operation
 */
export const updatePurchaseStatus = async (purchaseId, status) => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', purchaseId)
      .select();

    if (error) {
      console.error('Error updating purchase status:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating purchase status:', error);
    return { data: null, error };
  }
};