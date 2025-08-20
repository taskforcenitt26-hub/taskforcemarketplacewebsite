import React, { useEffect, useState } from 'react';
import { listPaymentRequests, updatePaymentRequestStatus } from '../../lib/paymentRequestService';
import { savePurchase } from '../../lib/purchaseService';
import { Check, X, RefreshCw } from 'lucide-react';

const PaymentRequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await listPaymentRequests('pending');
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      // Fetch the request to build purchase payload if approving
      const req = requests.find(r => r.id === id);
      if (status === 'approved' && req) {
        const purchase = {
          user_id: req.user_id || null,
          cycle_id: req.cycle_id,
          amount: req.amount,
          payment_method: req.method === 'upi' ? 'upi' : 'cash',
          status: 'completed',
          bill_number: req.order_id,
          payment_id: req.payment_ref,
          notes: `Approved via admin for order ${req.order_id}`,
          lock_included: !!req.lock_included,
          lock_price: req.lock_price ?? 0,
          plan_key: req.plan_key ?? null,
          plan_label: req.plan_label ?? null,
          plan_rent: req.plan_rent ?? null,
          plan_deposit: req.plan_deposit ?? null,
          aadhar_url: req.aadhar_url ?? null
        };
        const { data, error } = await savePurchase(purchase);
        if (error || !data) {
          console.error('Failed to save purchase before approval', error);
          alert('Could not save purchase. Approval aborted. Please retry.');
          return; // do not update request status if purchase failed
        }
      }
      await updatePaymentRequestStatus(id, status);
      await load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Payment Requests</h2>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No pending requests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl border">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="p-3">Order</th>
                <th className="p-3">Cycle</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Method</th>
                <th className="p-3">Requested</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="border-t text-sm">
                  <td className="p-3">
                    <div className="font-medium text-gray-900">{r.order_id}</div>
                    <div className="text-gray-500">{r.payment_ref}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium">{r.cycles?.name || 'Cycle'}</div>
                    <div className="text-gray-500">{r.cycles?.brand} {r.cycles?.model}</div>
                  </td>
                  <td className="p-3">₹{Number(r.amount).toLocaleString('en-IN')}</td>
                  <td className="p-3 uppercase">{r.method}</td>
                  <td className="p-3 text-gray-500">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeStatus(r.id, 'approved')}
                        disabled={updatingId === r.id}
                        className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        onClick={() => changeStatus(r.id, 'failed')}
                        disabled={updatingId === r.id}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-1"
                      >
                        <X size={16} /> Mark Failed
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentRequestsPanel;
