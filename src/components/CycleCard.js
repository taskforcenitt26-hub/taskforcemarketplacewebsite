import React, { useState } from 'react';
import { Clock, ShoppingCart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HoldModal from './HoldModal';
import SellerCodeModal from './SellerCodeModal';

const CycleCard = ({ cycle, onHold, showHoldButton = true }) => {
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [showSellerCodeModal, setShowSellerCodeModal] = useState(false);
  const navigate = useNavigate();

  const handleHoldClick = () => {
    setShowHoldModal(true);
  };

  const handleBuyNowClick = () => {
    setShowSellerCodeModal(true);
  };

  const handleSellerCodeVerified = () => {
    setShowSellerCodeModal(false);
    navigate('/payment', { state: { cycle } });
  };

  const handleHoldSubmit = async (customerInfo) => {
    if (onHold) {
      const result = await onHold(cycle.id, customerInfo);
      if (result.error) {
        showNotification('Hold Failed', result.error, 'error');
      } else {
        showNotification('Hold Confirmed!', `Cycle has been put on hold for 20 minutes!`, 'success');
        setShowHoldModal(false);
      }
    }
  };

  const showNotification = (title, message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-slide-up ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-1">
          <h4 class="font-semibold mb-1">${title}</h4>
          <p class="text-sm opacity-90">${message}</p>
        </div>
        <button class="ml-4 text-white hover:opacity-70" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {cycle.image_url ? (
            <img
              src={cycle.image_url}
              alt={cycle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <ShoppingCart size={48} className="mx-auto mb-2 opacity-30" />
                <span className="text-sm font-medium">No Image Available</span>
              </div>
            </div>
          )}
          {!cycle.is_available && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Brand */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
              {cycle.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              SN: {cycle.serial_number} • {cycle.model}
            </p>
          </div>

          {/* Type and Price */}
          <div className="flex justify-between items-center mb-4">
            {cycle.planLabel && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">
                {cycle.planLabel.split(' ')[0]} Plan
              </span>
            )}
            <span className="text-2xl font-extrabold text-yellow-400">
              {formatPrice(cycle.computedPrice || cycle.price)}
            </span>
          </div>

          {/* Deposit Info */}
          {cycle.computedPrice && (
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <Info size={14} className="mr-1" /> Includes refundable deposit of ₹1,000
            </div>
          )}

          {/* Description */}
          {cycle.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {cycle.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            {showHoldButton && cycle.is_available && (
              <button
                onClick={handleHoldClick}
                className="flex-1 bg-black text-yellow-400 px-4 py-3 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-yellow-400/40 transform hover:-translate-y-0.5"
              >
                <Clock size={20} className="animate-pulse" />
                <span>Hold 20 Mins</span>
              </button>
            )}
            <button
              onClick={handleBuyNowClick}
              className="flex-1 bg-yellow-400 text-black px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/40 hover:shadow-yellow-500/60 hover:shadow-2xl transform hover:-translate-y-0.5 disabled:transform-none animate-pulse hover:animate-none"
              disabled={!cycle.is_available}
            >
              <ShoppingCart size={18} />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hold Modal */}
      {showHoldModal && (
        <HoldModal
          cycle={cycle}
          onClose={() => setShowHoldModal(false)}
          onSubmit={handleHoldSubmit}
        />
      )}

      {/* Seller Code Modal */}
      {showSellerCodeModal && (
        <SellerCodeModal
          cycle={cycle}
          onClose={() => setShowSellerCodeModal(false)}
          onVerified={handleSellerCodeVerified}
        />
      )}
    </>
  );
};

export default CycleCard;