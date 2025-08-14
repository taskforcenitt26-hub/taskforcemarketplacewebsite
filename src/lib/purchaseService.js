import { supabase } from './supabase';

/**
 * Saves a purchase record to the database
 * @param {Object} purchaseData - The purchase data to save
 * @param {Object} purchaseData.user - User information
 * @param {string} purchaseData.user.id - User ID (optional)
 * @param {string} purchaseData.user.name - User's full name
 * @param {string} purchaseData.user.email - User's email
 * @param {string} purchaseData.user.phone - User's phone number (optional)
 * @param {Object} purchaseData.cycle - The cycle being purchased
 * @param {number} purchaseData.amount - Total amount paid
 * @param {string} purchaseData.paymentMethod - Payment method used
 * @param {string} purchaseData.transactionReference - Payment reference/ID
 * @param {boolean} purchaseData.includeLock - Whether a lock was included
 * @param {number} purchaseData.lockPrice - Price of the lock if included
 * @param {Object} purchaseData.billingAddress - Billing address (optional)
 * @returns {Promise<Object>} - The created purchase record or error
 */
export const savePurchase = async (purchaseData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const purchase = {
    user_id: user?.id || null,
    customer_name: purchaseData.user.name,
    customer_email: purchaseData.user.email,
    customer_phone: purchaseData.user.phone || null,
    cycle_id: purchaseData.cycle.id,
    cycle_details: {
      name: purchaseData.cycle.name,
      brand: purchaseData.cycle.brand,
      model: purchaseData.cycle.model,
      price: purchaseData.cycle.price,
      image_url: purchaseData.cycle.image_url
    },
    amount_paid: purchaseData.amount,
    payment_method: purchaseData.paymentMethod,
    payment_status: 'completed',
    transaction_reference: purchaseData.transactionReference,
    include_lock: purchaseData.includeLock,
    lock_price: purchaseData.lockPrice || 0,
    billing_address: purchaseData.billingAddress || null,
    notes: `Purchase completed via ${purchaseData.paymentMethod} on ${new Date().toISOString()}`
  };

  const { data, error } = await supabase
    .from('purchases')
    .insert([purchase])
    .select()
    .single();

  if (error) {
    console.error('Error saving purchase:', error);
    throw error;
  }

  return data;
};

/**
 * Fetches a user's purchase history
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of purchase records
 */
export const getUserPurchases = async (userId) => {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching purchases:', error);
    throw error;
  }

  return data || [];
};
