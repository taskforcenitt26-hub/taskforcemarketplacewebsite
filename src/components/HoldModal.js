// Importing React and useState hook for managing state
import React, { useState } from 'react';
// Importing icons from lucide-react
import { X, Clock } from 'lucide-react';
// Importing custom loader component for showing loading state
import { InlineLoader } from './SimpleLoaders';

// HoldModal component - shows a modal popup when user wants to hold a cycle
// Props: cycle (cycle data), onClose (function to close modal), onSubmit (function to handle form submission)
const HoldModal = ({ cycle, onClose, onSubmit }) => {
  // State for form data (user details)
  const [formData, setFormData] = useState({
    name: '',             // Full name input
    email: '',            // Email address input
    phone: '',            // Phone number input
    allotmentNumber: ''   // Provisional allotment number input
  });

  // State for tracking loading status during submission
  const [loading, setLoading] = useState(false);

  // Function to update form data when user types in input fields
  const handleChange = (e) => {
    setFormData({
      ...formData, // Keep existing values
      [e.target.name]: e.target.value // Update only the field being typed into
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload on form submit
    setLoading(true);   // Show loading state

    try {
      // Call the onSubmit function passed as a prop with form data
      await onSubmit(formData);

      // Request notification permission from the browser
      if ('Notification' in window) {
        // Ask permission if not already granted or denied
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }

        // If notifications are allowed
        if (Notification.permission === 'granted') {
          // Schedule a notification after 18 minutes (2 min before hold expiry)
          setTimeout(() => {
            new Notification('Hold Expiring Soon!', {
              body: `Your hold on ${cycle.name} will expire in 2 minutes. Complete your purchase now!`,
              icon: '/favicon.ico', // small icon for notification
              tag: 'hold-expiry'    // unique tag so it doesn't duplicate
            });
          }, 18 * 60 * 1000); // 18 minutes in milliseconds
        }
      }
    } finally {
      setLoading(false); // Stop loading after request finishes
    }
  };

  return (
    // Modal background overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content container */}
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header Section of modal */}
        <div className="flex items-center justify-between p-6 border-b">
          {/* Title with clock icon */}
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold">Hold Cycle</h2>
          </div>
          {/* Close button (X icon) */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cycle Information section */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex space-x-4">
            {/* Show cycle image if available */}
            {cycle.image_url && (
              <img
                src={cycle.image_url}
                alt={cycle.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            {/* Cycle details (name, brand, model) */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{cycle.name}</h3>
              <p className="text-sm text-gray-600">{cycle.brand} - {cycle.model}</p>
            </div>
          </div>
        </div>

        {/* Hold Information Section */}
        <div className="p-6 border-b">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            {/* Hold duration notice */}
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Clock size={16} className="mr-2" />
              <span>Hold duration: 20 minutes</span>
            </div>
            {/* Extra note for user */}
            <p className="text-sm text-gray-600 mb-6">
              This will reserve the cycle for 20 minutes. Please complete your purchase within this time.
            </p>
          </div>
        </div>

        {/* Form Section for user details */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Allotment Number Input */}
            <div>
              <label htmlFor="allotmentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Provisional Allotment Number *
              </label>
              <input
                type="text"
                id="allotmentNumber"
                name="allotmentNumber"
                value={formData.allotmentNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter provisional allotment number"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3 mt-6">
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 
                         rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className="flex-1 px-4 py-2 bg-yellow-600 text-black rounded-md 
                         hover:bg-yellow-700 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed font-semibold"
            >
              {/* Show loader when submitting else show text */}
              {loading ? (
                <InlineLoader message="Processing..." textColor="text-black" />
              ) : (
                'Hold Cycle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Exporting component for use in other files
export default HoldModal;
