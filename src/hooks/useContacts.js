import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all contact submissions (admin only)
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit a new contact form
  const submitContact = async (contactData) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone || null,
            subject: contactData.subject || null,
            message: contactData.message,
            status: 'unread'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the contacts list if we're displaying it
      if (contacts.length > 0) {
        await fetchContacts();
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Error submitting contact:', err);
      return { success: false, error: err.message };
    }
  };

  // Update contact status
  const updateContactStatus = async (contactId, status, adminNotes = null) => {
    try {
      const updateData = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (adminNotes !== null) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? { ...contact, ...updateData } : contact
      ));
      
      return { success: true, data };
    } catch (err) {
      console.error('Error updating contact:', err);
      return { success: false, error: err.message };
    }
  };

  // Delete contact submission
  const deleteContact = async (contactId) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      
      // Update local state
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting contact:', err);
      return { success: false, error: err.message };
    }
  };

  // Get contact statistics
  const getContactStats = () => {
    const total = contacts.length;
    const unread = contacts.filter(c => c.status === 'unread').length;
    const read = contacts.filter(c => c.status === 'read').length;
    const responded = contacts.filter(c => c.status === 'responded').length;
    
    return { total, unread, read, responded };
  };

  useEffect(() => {
    // Only fetch contacts if user is likely an admin (has access)
    // This will be controlled by the component using this hook
  }, []);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    submitContact,
    updateContactStatus,
    deleteContact,
    getContactStats
  };
};

export default useContacts;