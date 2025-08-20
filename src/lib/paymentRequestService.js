import { supabase } from './supabase';

// Table: payment_requests
// columns: id (uuid), user_id (uuid), cycle_id (uuid), amount (numeric), method (text),
// order_id (text), payment_ref (text), status (text: 'pending' | 'approved' | 'rejected'),
// created_at, updated_at

export const createPaymentRequest = async (payload) => {
  const { data, error } = await supabase
    .from('payment_requests')
    .insert([{ ...payload, status: 'pending' }])
    .select()
    .single();
  return { data, error };
};

export const getPaymentRequestById = async (id) => {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const listPaymentRequests = async (status) => {
  let query = supabase.from('payment_requests').select(`*, cycles(id, name, brand, model)`)
    .order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  return { data: data || [], error };
};

export const updatePaymentRequestStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('payment_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};
