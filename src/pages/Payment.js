import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { savePurchase } from '../lib/purchaseService';
import { supabase } from '../lib/supabase';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cycle } = location.state || {};

  // === UPI payment parameters ===
  // Provide multiple UPI IDs to choose from
  const upiOptions = [
    { id: 'asrithadakuri-1@okaxis', label: 'UPI 1' },
    { id: 'brainzeystudios-1@okicici', label: 'UPI 2' },
    { id: '9677852057@axisbank', label: 'UPI 3' }
  ];
  const [selectedUpi, setSelectedUpi] = React.useState(upiOptions[0].id);

  // Pricing
  const baseAmount = cycle ? (cycle.computedPrice ?? cycle.price) : 0;
  const [includeLock, setIncludeLock] = React.useState(false);
  const lockPrice = 100;
  const amount = baseAmount + (includeLock ? lockPrice : 0);

  const orderId = 'ORD' + Date.now();
  // GPay often shows the `tr` field as reference and may hide `tn` if both are long.
  // We'll keep a short `tr` (12 chars) and put the readable info in `tn`.
  const txnRef = ('TXN' + Date.now()).slice(-12);

  // Build readable note (<=40 ASCII, no special chars)
  const cycleLabel = cycle?.name ? cycle.name.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 15) : 'Cycle';
  const serialPart = cycle?.serial_number ? 'SN' + cycle.serial_number.slice(-4) : '';
  const note = `${cycleLabel} ${serialPart} ${orderId}`.trim().slice(0, 40);

  const upiParams = new URLSearchParams({
    pa: selectedUpi,
    pn: 'Taskforce RECycle',
    am: amount.toFixed(2),
    cu: 'INR',
    tn: note, // readable note for apps
    tr: txnRef
  });

  const upiLink = `upi://pay?${upiParams.toString()}`;

  // ========= Helpers =========
  const isMobile = /android|iphone|ipad/i.test(navigator.userAgent);

  const [method, setMethod] = React.useState('upi'); // 'upi' or 'cash'
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handlePaymentSuccess = useCallback(async (paymentMethod) => {
    try {
      setIsProcessing(true);
      // Save purchase to Supabase
      const purchaseData = {
        user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
        cycle_id: cycle.id,
        amount: amount,
        payment_method: paymentMethod,
        status: 'completed',
        bill_number: `BILL-${Date.now()}`,
        payment_id: txnRef,
        notes: `Payment for ${cycle.name} (${cycle.serial_number})`,
        lock_included: includeLock,
        lock_price: includeLock ? lockPrice : 0
      };

      const { error } = await savePurchase(purchaseData);
      
      if (error) {
        console.error('Error saving purchase:', error);
        // Still navigate to success page even if saving fails
      }

      // Navigate to success page with order details
      navigate('/payment-success', {
        state: {
          orderId,
          amount,
          cycle,
          includeLock,
          lockPrice: includeLock ? lockPrice : 0,
          paymentMethod
        }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      // Still navigate to success page even if there's an error
      navigate('/payment-success', {
        state: {
          orderId,
          amount,
          cycle,
          includeLock,
          lockPrice: includeLock ? lockPrice : 0,
          paymentMethod: paymentMethod || 'Unknown'
        }
      });
    } finally {
      setIsProcessing(false);
    }
  }, [cycle, amount, includeLock, lockPrice, navigate, txnRef, orderId]);

  const handleCashConfirm = () => {
    handlePaymentSuccess('Cash on Pickup');
  };

  useEffect(() => {
    if (!cycle) {
      navigate('/cycles');
    }

    // Handle UPI payment success callback
    const handleMessage = async (event) => {
      // Check if this is a message from the UPI app
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === 'UPI_PAYMENT_SUCCESS') {
        await handlePaymentSuccess('UPI');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [cycle, navigate, handlePaymentSuccess]);

  if (!cycle) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Cycles
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-yellow-200">
          {/* Payment method selector */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setMethod('upi')}
              className={`px-4 py-2 rounded-lg border transition-colors ${method==='upi' ? 'bg-yellow-500 text-white border-yellow-600' : 'border-gray-300 hover:border-gray-400'}`}
            >UPI</button>
            <button
              onClick={() => setMethod('cash')}
              className={`px-4 py-2 rounded-lg border transition-colors ${method==='cash' ? 'bg-yellow-500 text-white border-yellow-600' : 'border-gray-300 hover:border-gray-400'}`}
            >Cash</button>
          </div>

          {method === 'upi' && (
            <>
              {/* UPI amount */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pay ₹{amount.toLocaleString('en-IN')}</h2>
              <p className="text-gray-600 mb-2">Use any UPI app to complete the payment</p>

              {/* UPI ID selector */}
              <div className="flex justify-center gap-3 mb-4">
                {upiOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedUpi(opt.id)}
                    className={`px-3 py-1 rounded border text-sm ${selectedUpi===opt.id ? 'bg-yellow-500 text-white border-yellow-600' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {method === 'upi' && (isMobile ? (
            <a
              href={upiLink}
              className={`inline-block ${isProcessing ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold px-6 py-3 rounded-lg transition-colors`}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay with UPI App'}
            </a>
          ) : (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiLink)}&size=220x220`}
              alt="UPI QR Code"
              className="mx-auto mb-4 shadow-md rounded"
              width={220}
              height={220}
            />
          ))}

          {method === 'cash' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pay in Cash (₹{amount.toLocaleString('en-IN')})</h2>
              <p className="text-gray-600 mb-6">You can pay the amount when you pick up the cycle.</p>
              <button
                onClick={handleCashConfirm}
                disabled={isProcessing}
                className={`inline-block ${isProcessing ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold px-6 py-3 rounded-lg transition-colors`}
              >
                {isProcessing ? 'Processing...' : 'Confirm Cash Payment'}
              </button>
            </>
          )}

          {/* Optional add-on */}
          <div className="mt-6 mb-6 flex justify-center">
            <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-yellow-600"
                checked={includeLock}
                onChange={e => setIncludeLock(e.target.checked)}
              />
              <span>Add Cycle Lock (+₹{lockPrice})</span>
            </label>
          </div>

          {method==='upi' && (
          <div className="mt-6 text-sm text-gray-500 break-all">
            <p className="font-medium">UPI ID:</p>
            <p>{selectedUpi}</p>
            <p className="mt-2">Order ID: {orderId}</p>
            {/* lock note removed as per requirement */}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;