import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

const SellerCodeModal = ({ cycle, onClose, onVerified }) => {
  const [sellerCode, setSellerCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // For now, using a simple seller code. In production, this would be validated against a database
    const validSellerCode = '1234';

    if (sellerCode !== validSellerCode) {
      setError('Invalid seller code. Please contact the seller for the correct code.');
      setLoading(false);
      return;
    }

    // If code is valid, proceed to payment
    onVerified();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Seller Verification</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">{cycle.name}</h3>
            <p className="text-blue-700 text-sm">
              {cycle.brand} {cycle.model} - ₹{cycle.price}
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            To proceed with the purchase, please enter the unique verification code provided by our taskforce team. 
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="sellerCode" className="block text-sm font-medium text-gray-700 mb-2">
              Seller Code *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="sellerCode"
                value={sellerCode}
                onChange={(e) => setSellerCode(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter seller code"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Contact the taskforce team for the above code
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !sellerCode.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SellerCodeModal;