import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCycles = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCycles(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const addCycle = async (cycleData) => {
    try {
      const { data, error } = await supabase
        .from('cycles')
        .insert([cycleData])
        .select()
        .single();

      if (error) throw error;
      setCycles(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const updateCycle = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('cycles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCycles(prev => prev.map(cycle => cycle.id === id ? data : cycle));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const deleteCycle = async (id) => {
    try {
      const { error } = await supabase
        .from('cycles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCycles(prev => prev.filter(cycle => cycle.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  return {
    cycles,
    loading,
    error,
    fetchCycles,
    addCycle,
    updateCycle,
    deleteCycle
  };
};