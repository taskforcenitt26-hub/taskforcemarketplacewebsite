import { supabase } from '../lib/supabase';

/**
 * Hook for handling contact form submissions
 * This is a standalone contact system with no admin functionality
 */
export const useContacts = () => {
  
  // Submit a new contact form using the database function
  const submitContact = async (contactData) => {
    try {
      // Use the database function for validation and insertion
      const { data, error } = await supabase.rpc('submit_contact_message', {
        p_name: contactData.name,
        p_email: contactData.email,
        p_message: contactData.message,
        p_phone: contactData.phone || null,
        p_allotment_number: contactData.allotment_number || null
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        return { success: false, error: 'Failed to submit contact message. Please try again.' };
      }

      // The function returns a JSON object with success/error info
      if (data && data.success) {
        return { success: true, data: data };
      } else {
        return { success: false, error: data?.error || 'Failed to submit contact message.' };
      }
      
    } catch (err) {
      console.error('Error submitting contact:', err);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  };

  return {
    submitContact
  };
};

export default useContacts;