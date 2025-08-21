// Importing React and required hooks
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // For navigation and accessing route state
import { ArrowLeft } from 'lucide-react'; // Back arrow icon
import { createPaymentRequest } from '../lib/paymentRequestService'; // Custom function to create payment request
import { supabase } from '../lib/supabase'; // Supabase client for DB/auth

const Payment = () => {
  // Access location state (data passed from previous page)
  const location = useLocation();
  const navigate = useNavigate();

  // Extract details from state or assign defaults
  const { cycle, includeLockInitial = false, selectedPlan = null, aadharUrl = '', phoneNumber = '' } = location.state || {};

  // === Available UPI IDs (for flexibility) ===
  const upiOptions = [
    { id: '9494640814@ybl', label: 'UPI 1' },
    { id: 'brainzeystudios-1@okicici', label: 'UPI 2' },
    { id: '9677852057@axisbank', label: 'UPI 3' },
    { id: 'brainzeystudios@okaxis', label: 'UPI 4' },
  ];
  const [selectedUpi, setSelectedUpi] = React.useState(upiOptions[0].id); // Default UPI selected

  // === Pricing logic ===
  const baseAmount = cycle ? (cycle.computedPrice ?? cycle.price) : 0; // Cycle base price
  const includeLock = includeLockInitial; // Whether lock is included
  const lockPrice = 100; // Flat lock price
  const amount = baseAmount + (includeLock ? lockPrice : 0); // Final amount with/without lock

  // === Unique transaction/order identifiers ===
  const orderId = 'ORD' + Date.now(); // Unique order ID
  const txnRef = ('TXN' + Date.now()).slice(-12); // Short reference for UPI apps

  // Create short note for UPI apps (<=40 chars, no special chars)
  const cycleLabel = cycle?.name ? cycle.name.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 15) : 'Cycle';
  const modelPart = cycle?.model ? cycle.model.slice(0, 4).toUpperCase() : '';
  const note = `${cycleLabel} ${modelPart} ${orderId}`.trim().slice(0, 40);

  // === Build UPI payment params ===
  const upiParams = new URLSearchParams({
    pa: selectedUpi, // Payee UPI ID
    pn: 'Taskforce RECycle', // Payee name
    am: amount.toFixed(2), // Amount
    cu: 'INR', // Currency
    tn: note, // Transaction note
    tr: txnRef, // Transaction reference
  });

  // UPI deep link
  const upiLink = `upi://pay?${upiParams.toString()}`;

  // === Helpers ===
  const isMobile = /android|iphone|ipad/i.test(navigator.userAgent); // Detect if on mobile

  const [method, setMethod] = React.useState('upi'); // Payment method state (upi/cash)
  const [isProcessing] = React.useState(false); // Track if payment is processing
  const [isRequesting, setIsRequesting] = React.useState(false); // Track request state

  // === Handle "Request Admin Approval" ===
  const handleRequestApproval = async () => {
    try {
      setIsRequesting(true); // Show loading state

      // Get logged-in user from Supabase
      const { data: userResp } = await supabase.auth.getUser();

      // Prepare request payload
      const payload = {
        user_id: userResp?.user?.id || null, // User ID
        cycle_id: cycle.id, // Selected cycle
        amount: amount, // Total amount
        method: method === 'upi' ? 'upi' : 'cash', // Payment method
        order_id: orderId, // Unique order ID
        payment_ref: txnRef, // Transaction reference
        // Plan / add-on context
        lock_included: !!includeLock,
        lock_price: includeLock ? lockPrice : 0,
        plan_key: selectedPlan?.key ?? null,
        plan_label: selectedPlan?.label ?? null,
        plan_rent: selectedPlan?.rent ?? null,
        plan_deposit: selectedPlan?.deposit ?? null,
        aadhar_url: aadharUrl || null,
        buyer_phone: phoneNumber || null,
      };

      // Call backend service to store payment request
      const { data, error } = await createPaymentRequest(payload);
      if (error) throw error;

      // Navigate to processing screen
      navigate('/payment-processing', { state: { requestId: data.id } });
    } catch (e) {
      console.error('Failed to create payment request', e);
      alert('Could not create request. Please try again.');
    } finally {
      setIsRequesting(false); // Reset request state
    }
  };

  // Redirect back if no cycle info found
  useEffect(() => {
    if (!cycle) {
      navigate('/cycles');
    }
  }, [cycle, navigate]);

  // Return nothing if cycle is missing (prevents render errors)
  if (!cycle) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* === Back button === */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Cycles
        </button>

        {/* === Payment container === */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-yellow-200">
          
          {/* Payment method selector (UPI / Cash) */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setMethod('upi')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                method==='upi' ? 'bg-yellow-500 text-white border-yellow-600' : 'border-gray-300 hover:border-gray-400'
              }`}
            >UPI</button>
            
            <button
              onClick={() => setMethod('cash')}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                method==='cash' ? 'bg-yellow-500 text-white border-yellow-600' : 'border-gray-300 hover:border-gray-400'
              }`}
            >Cash</button>
          </div>

          {/* === UPI flow === */}
          {method === 'upi' && (
            <>
              {/* Payment amount */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pay ₹{amount.toLocaleString('en-IN')}</h2>
              <p className="text-gray-600 mb-2">Use any UPI app to complete the payment</p>

              {/* UPI ID selector */}
              <div className="flex justify-center gap-3 mb-4">
                {upiOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedUpi(opt.id)}
                    className={`px-3 py-1 rounded border text-sm ${
                      selectedUpi===opt.id ? 'bg-yellow-500 text-white border-yellow-600' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* === UPI: Mobile vs Desktop (App vs QR) === */}
          {method === 'upi' && (isMobile ? (
            <a
              href={upiLink} // Open directly in UPI app
              className={`inline-block ${isProcessing ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold px-6 py-3 rounded-lg transition-colors`}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay with UPI App'}
            </a>
          ) : (
            // Show QR code for desktop users
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=220x220`}
              alt="UPI QR Code"
              className="mx-auto mb-4 shadow-md rounded"
              width={220}
              height={220}
            />
          ))}

          {/* === Request Admin Approval (UPI flow) === */}
          {method === 'upi' && (
            <div className="mt-4">
              <button
                onClick={handleRequestApproval}
                disabled={isRequesting}
                className={`inline-block ${isRequesting ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold px-6 py-3 rounded-lg transition-colors`}
              >
                {isRequesting ? 'Requesting...' : 'Request Admin Approval'}
              </button>
            </div>
          )}

          {/* === Cash flow === */}
          {method === 'cash' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pay in Cash (₹{amount.toLocaleString('en-IN')})</h2>
              <p className="text-gray-600 mb-6">You can pay the amount when you pick up the cycle.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRequestApproval}
                  disabled={isRequesting}
                  className={`inline-block ${isRequesting ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold px-6 py-3 rounded-lg transition-colors`}
                >
                  {isRequesting ? 'Requesting...' : 'Request Admin Approval'}
                </button>
              </div>
            </>
          )}

          {/* === Extra Info (UPI only) === */}
          {method==='upi' && (
            <div className="mt-6 text-sm text-gray-500 break-all">
              <p className="font-medium">UPI ID:</p>
              <p>{selectedUpi}</p>
              <p className="mt-2">Order ID: {orderId}</p>
              {selectedPlan?.label && (
                <p className="mt-1">Plan: {selectedPlan.label}</p>
              )}
              {phoneNumber && (
                <p className="mt-1">Phone: {phoneNumber}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
