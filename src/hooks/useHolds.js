import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export const useHolds = () => {
  const [holds, setHolds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchingRef = useRef(false);

  const fetchHolds = useCallback(async (showLoading = false) => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      if (showLoading) setLoading(true);
      
      const { data, error } = await supabase
        .from('cycle_holds')
        .select(`
          *,
          cycles (
            id,
            name,
            brand,
            model,
            image_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Only update state if data has actually changed
      setHolds(prevHolds => {
        const newData = data || [];
        if (JSON.stringify(prevHolds) !== JSON.stringify(newData)) {
          return newData;
        }
        return prevHolds;
      });
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  const expireOldHolds = useCallback(async () => {
    try {
      // Directly mark expired holds as inactive
      await supabase
        .from('cycle_holds')
        .update({ is_active: false })
        .lte('hold_end_time', new Date().toISOString())
        .eq('is_active', true);
    } catch (err) {
      console.error('Error expiring holds:', err);
    }
  }, []);

  useEffect(() => {
    fetchHolds(true); // Show loading on initial fetch
    
    // Set up real-time subscription for holds
    const subscription = supabase
      .channel('cycle_holds_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cycle_holds' },
        () => {
          fetchHolds(false); // Don't show loading for real-time updates
        }
      )
      .subscribe();

    // Auto-refresh frequently to release expired holds quickly
    const interval = setInterval(async () => {
      await expireOldHolds();
      fetchHolds(false); // Don't show loading for periodic updates
    }, 15000); // every 15s

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [fetchHolds, expireOldHolds]);

  const createHold = useCallback(async (cycleId, customerInfo) => {
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
            image_url
          )
        `)
        .single();

      if (error) throw error;
      
      // Update state optimistically
      setHolds(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      // Unique violation (only one active hold per cycle)
      const message = (err?.code === '23505' || /duplicate key value/i.test(err?.message || ''))
        ? 'This cycle is already on hold. Please try again after it is released.'
        : (err?.message || 'Failed to create hold');
      return { data: null, error: message };
    }
  }, []);

  const releaseHold = useCallback(async (holdId) => {
    try {
      const { error } = await supabase
        .from('cycle_holds')
        .update({ is_active: false })
        .eq('id', holdId);

      if (error) throw error;
      
      // Update state optimistically
      setHolds(prev => prev.filter(hold => hold.id !== holdId));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }, []);

  const getRemainingTime = useCallback((holdEndTime) => {
    const now = new Date();
    const endTime = new Date(holdEndTime);
    const diff = endTime - now;
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

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