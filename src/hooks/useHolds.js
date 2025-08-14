import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useHolds = () => {
  const [holds, setHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHolds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cycle_holds')
        .select(`
          *,
          cycles (
            id,
            name,
            brand,
            model,
            price,
            image_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHolds(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolds();
    
    // Set up real-time subscription for holds
    const subscription = supabase
      .channel('cycle_holds_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cycle_holds' },
        () => {
          fetchHolds();
        }
      )
      .subscribe();

    // Auto-refresh every minute to check for expired holds
    const interval = setInterval(() => {
      expireOldHolds();
      fetchHolds();
    }, 60000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const createHold = async (cycleId, customerInfo) => {
    try {
      // First check if cycle is already on hold
      const { data: existingHold } = await supabase
        .from('cycle_holds')
        .select('id')
        .eq('cycle_id', cycleId)
        .eq('is_active', true)
        .single();

      if (existingHold) {
        return { data: null, error: 'This cycle is already on hold' };
      }

      const holdEndTime = new Date();
      holdEndTime.setMinutes(holdEndTime.getMinutes() + 20);

      const { data, error } = await supabase
        .from('cycle_holds')
        .insert([{
          cycle_id: cycleId,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          hold_end_time: holdEndTime.toISOString()
        }])
        .select(`
          *,
          cycles (
            id,
            name,
            brand,
            model,
            price,
            image_url
          )
        `)
        .single();

      if (error) throw error;
      setHolds(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const releaseHold = async (holdId) => {
    try {
      const { error } = await supabase
        .from('cycle_holds')
        .update({ is_active: false })
        .eq('id', holdId);

      if (error) throw error;
      setHolds(prev => prev.filter(hold => hold.id !== holdId));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  const expireOldHolds = async () => {
    try {
      await supabase.rpc('expire_holds');
    } catch (err) {
      console.error('Error expiring holds:', err);
    }
  };

  const getRemainingTime = (holdEndTime) => {
    const now = new Date();
    const endTime = new Date(holdEndTime);
    const diff = endTime - now;
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    holds,
    loading,
    error,
    fetchHolds,
    createHold,
    releaseHold,
    getRemainingTime
  };
};