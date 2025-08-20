// Import necessary React hooks and dependencies
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // For navigation + accessing route state
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'; // Icons for status display
import { getPaymentRequestById } from '../lib/paymentRequestService'; // API to fetch payment request details
import { supabase } from '../lib/supabase'; // Supabase client
import { getPurchaseByBillNumber } from '../lib/purchaseService'; // API to fetch purchase details

const PaymentProcessing = () => {
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to access route state
  const { requestId } = location.state || {}; // Extract requestId passed from Payment page

  // Track payment status → 'pending', 'approved', or 'failed'
  const [status, setStatus] = useState('pending'); 
  // Track error messages during polling
  const [error, setError] = useState(null);

  // Polling effect → keeps checking the payment status until approved/failed
  useEffect(() => {
    // If no requestId found, redirect to browse cycles page
    if (!requestId) {
      navigate('/browse-cycles');
      return;
    }

    let timer; // Holds the interval timer for polling

    // Function to poll payment status from backend
    const poll = async () => {
      try {
        // Fetch payment request by ID
        const { data, error } = await getPaymentRequestById(requestId);
        if (error) throw error; // Throw error if API fails

        if (data) {
          // Update status with current backend status
          setStatus(data.status);

          // If approved → handle redirection to success
          if (data.status === 'approved') {
            let cycle = null;

            // Try fetching cycle details (needed for receipt)
            try {
              const { data: cycleRow } = await supabase
                .from('cycles')
                .select('*')
                .eq('id', data.cycle_id) // Match by cycle_id
                .single(); // Expect single result
              cycle = cycleRow || null;
            } catch (_) {
              cycle = null; // If fetch fails, leave cycle as null
            }

            // Wait for purchase row to persist in DB before redirect (important for receipt/bill)
            const waitForPurchase = async (billNumber, attempts = 12, delayMs = 500) => {
              for (let i = 0; i < attempts; i++) {
                try {
                  const { data: p } = await getPurchaseByBillNumber(billNumber);
                  if (p) return p; // If purchase exists, return it
                } catch (_) {}
                // Wait before retrying
                await new Promise(r => setTimeout(r, delayMs));
              }
              return null; // Return null if not found after retries
            };

            // Wait for purchase by order_id
            const purchase = await waitForPurchase(data.order_id);

            // Decide lock inclusion → prefer purchase row if available
            const includeLockFinal = purchase ? !!purchase.lock_included : !!data.lock_included;

            // Decide plan details → prefer purchase row, fallback to request data
            const selectedPlanFinal = purchase && (purchase.plan_label || purchase.plan_key) ? {
              key: purchase.plan_key || null,
              label: purchase.plan_label || null,
              rent: purchase.plan_rent ?? null,
              deposit: purchase.plan_deposit ?? null,
            } : (data.plan_label || data.plan_key ? {
              key: data.plan_key || null,
              label: data.plan_label || null,
              rent: data.plan_rent ?? null,
              deposit: data.plan_deposit ?? null,
            } : null);

            // Use purchase’s cycle if available, otherwise fallback
            const cycleFinal = purchase?.cycles || cycle;
            // Use purchase’s amount if available, otherwise fallback
            const paidAmountFinal = purchase?.amount ?? data.amount;

            // Redirect to success page with all details
            navigate('/payment-success', {
              replace: true, // Replace history so user can’t go back here
              state: {
                orderNumber: data.order_id,
                paidAmount: paidAmountFinal,
                paymentMethod: data.method === 'upi' ? 'UPI' : 'Cash on Pickup',
                cycle: cycleFinal,
                includeLock: includeLockFinal,
                selectedPlan: selectedPlanFinal,
                purchaseId: purchase?.id || null,
              },
            });

            clearInterval(timer); // Stop polling once approved
          } 
          // If failed → stop polling
          else if (data.status === 'failed') {
            clearInterval(timer);
          }
        }
      } catch (e) {
        // If API fails, show retrying message but continue polling
        setError('Unable to check payment status. Retrying...');
      }
    };

    // Run immediately once, then poll every 3s
    poll();
    timer = setInterval(poll, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [requestId, navigate]);

  // Helper → navigate home
  const goHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center border border-yellow-200">

        {/* Pending state UI */}
        {status === 'pending' && (
          <>
            <Loader2 className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing payment</h1>
            <p className="text-gray-600">Waiting for admin approval. This may take a moment...</p>
            {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          </>
        )}

        {/* Approved state UI */}
        {status === 'approved' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment processed</h1>
            <p className="text-gray-600 mb-6">Redirecting to your receipt...</p>
          </>
        )}

        {/* Failed state UI */}
        {status === 'failed' && (
          <>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment failed</h1>
            <p className="text-gray-600 mb-6">Your request was not approved. Please try a different method or contact support.</p>
            <button 
              onClick={goHome} 
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessing;
