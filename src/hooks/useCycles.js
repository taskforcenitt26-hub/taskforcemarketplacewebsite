import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCycles = () => {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toDriveDirectUrl = (url) => {
    if (!url) return '';
    try {
      const match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]{10,})/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cycles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const normalized = (data || []).map(c => ({
        ...c,
        image_url: toDriveDirectUrl(c.image_url),
      }));
      setCycles(normalized);
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
      // Upsert by unique Serial Number (name)
      const { data, error } = await supabase
        .from('cycles')
        .upsert([cycleData], { onConflict: 'name' })
        .select()
        .single();

      if (error) throw error;
      const normalized = { ...data, image_url: toDriveDirectUrl(data.image_url) };
      setCycles(prev => {
        const exists = prev.some(c => c.id === normalized.id);
        return exists ? prev.map(c => (c.id === normalized.id ? normalized : c)) : [normalized, ...prev];
      });
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
      const normalized = { ...data, image_url: toDriveDirectUrl(data.image_url) };
      setCycles(prev => prev.map(cycle => cycle.id === id ? normalized : cycle));
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