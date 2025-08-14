import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { InlineLoader } from './SimpleLoaders';

const HoldModal = ({ cycle, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    allotmentNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      
      // Request notification permission and set up 20-minute timer
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
        
        if (Notification.permission === 'granted') {
          // Set notification for 18 minutes (2 minutes before expiry)
          setTimeout(() => {
            new Notification('Hold Expiring Soon!', {
              body: `Your hold on ${cycle.name} will expire in 2 minutes. Complete your purchase now!`,
              icon: '/favicon.ico',
              tag: 'hold-expiry'
            });
          }, 18 * 60 * 1000); // 18 minutes
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold">Hold Cycle</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cycle Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex space-x-4">
            {cycle.image_url && (
              <img
                src={cycle.image_url}
                alt={cycle.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{cycle.name}</h3>
              <p className="text-sm text-gray-600">{cycle.brand} - {cycle.model}</p>
              <p className="text-lg font-bold text-green-600 mt-1">
                {formatPrice(cycle.price)}
              </p>
            </div>
          </div>
        </div>

        {/* Hold Info */}
        <div className="p-6 border-b">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Clock size={16} className="mr-2" />
              <span>Hold duration: 20 minutes</span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will reserve the cycle for 20 minutes. Please complete your purchase within this time.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter provisional allotment number"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-black rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
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

export default HoldModal;