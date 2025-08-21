// Importing React and hooks
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Importing icons from lucide-react (React icon library)
import { Clock, ShoppingCart, Info } from 'lucide-react';

// Importing navigation hook from react-router-dom
import { useNavigate } from 'react-router-dom';

// Importing custom modal components
import HoldModal from './HoldModal';
import SellerCodeModal from './SellerCodeModal';

// Main CycleCard component
const CycleCard = ({ cycle, onHold, showHoldButton = true, activeHold = null }) => {
  // State to control Hold Modal visibility
  const [showHoldModal, setShowHoldModal] = useState(false);

  // State to control Seller Code Modal visibility
  const [showSellerCodeModal, setShowSellerCodeModal] = useState(false);

  // React Router navigation function
  const navigate = useNavigate();

  // State to show remaining hold time countdown
  const [holdRemaining, setHoldRemaining] = useState('');

  // Handle click for "Hold" button → opens hold modal
  const handleHoldClick = () => {
    setShowHoldModal(true);
  };

  // Handle click for "Buy Now" button → opens seller code modal
  const handleBuyNowClick = () => {
    setShowSellerCodeModal(true);
  };

  // After seller code is verified, redirect to payment page with cycle info
  const handleSellerCodeVerified = async (selectedPlan, includeLock, aadharUrl, phoneNumber) => {
    // Double-check availability on server to avoid race conditions
    try {
      const { data: latest, error } = await supabase
        .from('cycles')
        .select('id, is_available')
        .eq('id', cycle.id)
        .single();
      if (error) throw error;
      if (!latest?.is_available) {
        showNotification('Unavailable', 'Sorry, this cycle has just been sold.', 'error');
        setShowSellerCodeModal(false);
        return;
      }
    } catch (_) {
      // If check fails, proceed cautiously; UI will still block later if needed
    }

    setShowSellerCodeModal(false); // close modal
    const computedPrice = (selectedPlan?.rent || 0) + (selectedPlan?.deposit || 0); // calculate total
    navigate('/payment', { // navigate with state
      state: {
        cycle: { ...cycle, computedPrice, planLabel: selectedPlan?.label }, // pass cycle info
        includeLockInitial: !!includeLock, // lock selected?
        selectedPlan, // plan selected by buyer
        aadharUrl, // buyer’s Aadhaar card
        phoneNumber // buyer phone number
      }
    });
  };

  // Handle submission of hold form
  const handleHoldSubmit = async (customerInfo) => {
    if (onHold) {
      const result = await onHold(cycle.id, customerInfo); // call onHold from props
      if (result.error) {
        showNotification('Hold Failed', result.error, 'error'); // error notification
      } else {
        showNotification('Hold Confirmed!', `Cycle has been put on hold for 20 minutes!`, 'success'); // success message
        setShowHoldModal(false); // close modal
      }
    }
  };

  // Custom notification popup system
  const showNotification = (title, message, type = 'info') => {
    const notification = document.createElement('div'); // create div
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-slide-up ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`; // different colors for success/error/info

    // Inner HTML for notification
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

    document.body.appendChild(notification); // add to DOM

    setTimeout(() => { // auto remove after 5s
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  };

  // Format prices in Indian currency
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Convert Google Drive share links to direct view links
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

  // Convert Google Drive link into thumbnail format
  const toDriveThumbnailUrl = (url) => {
    if (!url) return '';
    try {
      const match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]{10,})/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
      }
      return url;
    } catch {
      return url;
    }
  };

  // States to handle image loading errors and retries
  const [imgSrc, setImgSrc] = useState(toDriveDirectUrl(cycle.image_url));
  const [triedThumb, setTriedThumb] = useState(false);
  const [triedProxy, setTriedProxy] = useState(false);

  // Reset image loading whenever cycle image changes
  useEffect(() => {
    setImgSrc(toDriveDirectUrl(cycle.image_url));
    setTriedThumb(false);
    setTriedProxy(false);
  }, [cycle.image_url]);

  // Live countdown timer for "Hold" feature
  useEffect(() => {
    if (!activeHold?.is_active || !activeHold?.hold_end_time) {
      setHoldRemaining('');
      return;
    }
    const update = () => {
      const diff = new Date(activeHold.hold_end_time) - new Date(); // time left
      if (diff <= 0) {
        setHoldRemaining('');
        return;
      }
      const m = Math.floor(diff / 60000); // minutes left
      const s = Math.floor((diff % 60000) / 1000); // seconds left
      setHoldRemaining(`${m}:${String(s).padStart(2, '0')}`); // format MM:SS
    };
    update();
    const id = setInterval(update, 1000); // update every second
    return () => clearInterval(id); // cleanup
  }, [activeHold]);

  return (
    <>
      {/* Cycle Card UI */}
      <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400 hover:-translate-y-1">
        
        {/* Image section */}
        <div className="relative h-56 bg-white overflow-hidden flex items-center justify-center">
          {imgSrc ? (
            <img
              src={imgSrc} // cycle image
              alt={cycle.name} // alt text
              className="w-full h-full object-contain p-2"
              loading="lazy" // lazy load
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              // Handle image errors by falling back to thumbnail or proxy
              onError={() => {
                if (!triedThumb) {
                  setImgSrc(toDriveThumbnailUrl(cycle.image_url));
                  setTriedThumb(true);
                } else if (!triedProxy) {
                  const direct = toDriveDirectUrl(cycle.image_url);
                  const urlNoProto = direct.replace(/^https?:\/\//, '');
                  setImgSrc(`https://images.weserv.nl/?url=${encodeURIComponent(urlNoProto)}&w=1200&q=85`);
                  setTriedProxy(true);
                } else {
                  setImgSrc('');
                }
              }}
            />
          ) : (
            // Fallback if no image
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <ShoppingCart size={48} className="mx-auto mb-2 opacity-30" />
                <span className="text-sm font-medium">No Image Available</span>
              </div>
            </div>
          )}
          {/* Badge if cycle is unavailable */}
          {!cycle.is_available && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Out of Stock
            </div>
          )}
          {/* Badge if cycle is on hold */}
          {activeHold?.is_active && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              On Hold{holdRemaining ? ` • ${holdRemaining}` : ''}
            </div>
          )}
        </div>

        {/* Details section */}
        <div className="p-6">
          {/* Name & Brand */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
              {cycle.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {cycle.brand} • {cycle.model}
            </p>
          </div>

          {/* Pricing */}
          <div className="flex justify-between items-center mb-4">
            {cycle.planLabel && (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">
                {cycle.planLabel.split(' ')[0]} Plan
              </span>
            )}
            <span className="text-2xl font-extrabold text-yellow-400">
              <span className="text-sm font-semibold text-gray-500 mr-2 align-middle">Starting at</span>
              {formatPrice(cycle.computedPrice || cycle.price)}
            </span>
          </div>

          {/* Deposit info */}
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

          {/* Hold countdown message */}
          {activeHold?.is_active && holdRemaining && (
            <div className="flex items-center text-xs text-yellow-900 bg-yellow-100 border border-yellow-200 rounded-md px-3 py-2 mb-3 font-medium">
              <Clock size={14} className="mr-2" /> On Hold · {holdRemaining} remaining
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-100">
            {/* Hold Button */}
            {showHoldButton && cycle.is_available && (
              <button
                onClick={handleHoldClick}
                className="flex-1 bg-black text-yellow-400 px-4 py-3 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-yellow-400/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!activeHold?.is_active} // disable if already on hold
              >
                <Clock size={20} className="animate-pulse" />
                <span>{activeHold?.is_active ? 'On Hold' : 'Hold 20 Mins'}</span>
              </button>
            )}
            {/* Buy Now Button */}
            <button
              onClick={handleBuyNowClick}
              className="flex-1 bg-yellow-400 text-black px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/40 hover:shadow-yellow-500/60 hover:shadow-2xl transform hover:-translate-y-0.5 disabled:transform-none animate-pulse hover:animate-none"
              disabled={!cycle.is_available || !!activeHold?.is_active} // disable if not available or on hold
            >
              <ShoppingCart size={18} />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Hold Modal if open */}
      {showHoldModal && (
        <HoldModal
          cycle={cycle}
          onClose={() => setShowHoldModal(false)}
          onSubmit={handleHoldSubmit}
        />
      )}

      {/* Render Seller Code Modal if open */}
      {showSellerCodeModal && (
        <SellerCodeModal
          cycle={cycle}
          onClose={() => setShowSellerCodeModal(false)}
          onVerified={(selectedPlan, includeLock, aadharUrl, phoneNumber) => handleSellerCodeVerified(selectedPlan, includeLock, aadharUrl, phoneNumber)}
        />
      )}
    </>
  );
};

// Export component
export default CycleCard;
