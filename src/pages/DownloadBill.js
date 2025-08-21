import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabase';
import LogoBlack from '../assets/logoblack.webp';
import { Link } from 'react-router-dom';

const DownloadBill = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const webpToPngDataUrl = (src) => new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve({ dataUrl, width: canvas.width, height: canvas.height });
        } catch (err) { reject(err); }
      };
      img.onerror = (e) => reject(e);
      img.src = src;
    } catch (e) { reject(e); }
  });

  const generateReceiptPdf = async ({ row, cycle }) => {
    const orderNumber = row.order_id;
    const paymentDisplayUI = /upi/i.test(row.method || '') ? 'UPI' : 'Cash';
    const includeLock = !!row.lock_included;
    const selectedPlan = {
      label: row.plan_label || null,
      rent: row.plan_rent ?? null,
      deposit: row.plan_deposit ?? null,
    };
    const lockPrice = Number(row.lock_price ?? 100);
    const paidAmount = Number(row.amount || 0);

    const hasPersistedTotal = !Number.isNaN(paidAmount) && paidAmount > 0;
    const fallbackCycleAmount = (cycle && (cycle.computedPrice ?? cycle.price)) || 0;
    const baseAmount = hasPersistedTotal ? Math.max(0, paidAmount - (includeLock ? lockPrice : 0)) : fallbackCycleAmount;
    const finalAmount = hasPersistedTotal ? paidAmount : (baseAmount + (includeLock ? lockPrice : 0));

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const primaryColor = [255, 193, 7];
    const darkText = [33, 37, 41];
    const lightGray = [245, 247, 250];
    if (doc.setCharSpace) doc.setCharSpace(0);

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setTextColor(...darkText);
    doc.setFontSize(24); doc.setFont('times', 'bold');
    doc.text('TASKFORCE NIT TRICHY', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(14); doc.setFont('times', 'normal');
    doc.text('RECycle Marketplace', pageWidth / 2, 27, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Purchase Receipt', pageWidth / 2, 35, { align: 'center' });

    // Logo
    try {
      const img = await webpToPngDataUrl(LogoBlack);
      const maxW = 30, maxH = 24;
      const imgRatio = img.width / img.height;
      let drawW = maxW; let drawH = drawW / imgRatio;
      if (drawH > maxH) { drawH = maxH; drawW = drawH * imgRatio; }
      const x = 14; const headerH = 50; const y = (headerH - drawH) / 2;
      doc.addImage(img.dataUrl, 'PNG', x, y, drawW, drawH, undefined, 'FAST');
    } catch {}

    // Order Information
    let yPos = 70;
    doc.setFontSize(16); doc.setFont('times', 'bold'); doc.text('Order Information', 20, yPos);
    yPos += 15; doc.setFontSize(11); doc.setFont('times', 'normal');
    const orderDate = new Date(row.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text('Order Number:', 20, yPos); doc.setFont('times', 'bold'); doc.text(String(orderNumber), 70, yPos); doc.setFont('times', 'normal');
    doc.text('Order Date:', 120, yPos); doc.setFont('times', 'bold'); doc.text(orderDate, 160, yPos); doc.setFont('times', 'normal');
    yPos += 12; doc.text('Payment Method:', 20, yPos); doc.setFont('times', 'bold'); doc.text(paymentDisplayUI, 70, yPos); doc.setFont('times', 'normal');

    // Product Details
    yPos += 30; doc.setFontSize(16); doc.setFont('times', 'bold'); doc.text('Product Details', 20, yPos);
    yPos += 10;
    let planWrapped = null; let planBlockExtra = 0;
    if (selectedPlan?.label) {
      const cleanPlanLabel = String(selectedPlan.label || '')
        .replace(/\s*\([^)]*\)\s*/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      const planText = `Plan: ${cleanPlanLabel}`
        + (selectedPlan.rent != null ? ` · Rent: Rs. ${Number(selectedPlan.rent).toFixed(2)}` : '')
        + (selectedPlan.deposit != null ? ` · Deposit: Rs. ${Number(selectedPlan.deposit).toFixed(2)}` : '');
      const maxLineWidth = pageWidth - 60;
      planWrapped = doc.splitTextToSize(planText, maxLineWidth);
      const planLines = Array.isArray(planWrapped) ? planWrapped.length : 1;
      const perLine = 5; const reserved = 10; const needed = planLines * perLine; planBlockExtra = Math.max(0, needed - reserved);
    }
    const baseBoxH = 40; const productBoxH = baseBoxH + planBlockExtra; const boxTopY = yPos;
    doc.setFillColor(...lightGray); doc.rect(20, boxTopY, pageWidth - 40, productBoxH, 'F');
    doc.setDrawColor(200,200,200); doc.rect(20, boxTopY, pageWidth - 40, productBoxH, 'S');
    yPos += 15; doc.setFontSize(14); doc.setFont('times', 'bold');
    doc.text(cycle?.name || 'Cycle Purchase', 25, yPos);
    yPos += 10; doc.setFontSize(11); doc.setFont('times', 'normal');
    doc.text(`Brand: ${cycle?.brand || '-'}`, 25, yPos);
    doc.text(`Model: ${cycle?.model || '-'}`, 100, yPos);
    if (planWrapped) {
      yPos += 8; doc.setFont('times', 'normal'); doc.setFontSize(11); if (doc.setCharSpace) doc.setCharSpace(0); doc.setTextColor(...darkText);
      doc.text(planWrapped, 25, yPos); yPos += (planWrapped.length - 1) * 5; doc.setTextColor(...darkText);
    }
    doc.setFontSize(14); doc.setFont('times', 'bold'); doc.setTextColor(...primaryColor);
    const priceY = boxTopY + 20; doc.text(`Rs. ${Number(baseAmount).toFixed(2)}`, pageWidth - 30, priceY, { align: 'right' });
    doc.setTextColor(...darkText);

    // Amount breakdown
    yPos += 40; doc.setFontSize(16); doc.setFont('times', 'bold'); doc.text('Total Amount Paid', 20, yPos);
    yPos += 15; doc.setFontSize(11); doc.setFont('times', 'normal');
    const showLock = !!includeLock; const total = Number(finalAmount) || 0;
    const cycleRateForDisplay = hasPersistedTotal ? Math.max(0, total - (showLock ? lockPrice : 0)) : Number(baseAmount) || 0;
    const summaryItems = [ { label: 'Cycle Rate', value: `Rs. ${cycleRateForDisplay.toFixed(2)}` } ];
    if (showLock) summaryItems.push({ label: 'Cycle Lock', value: `Rs. ${lockPrice.toFixed(2)}` });
    summaryItems.push({ label: 'Total Amount', value: `Rs. ${total.toFixed(2)}` });
    summaryItems.forEach(item => { doc.text(item.label, 20, yPos); doc.text(item.value, pageWidth - 20, yPos, { align: 'right' }); yPos += 12; });

    // Footer
    yPos = (typeof doc.internal.pageSize.getHeight === 'function' ? doc.internal.pageSize.getHeight() : doc.internal.pageSize.height) - 40;
    doc.setFillColor(...primaryColor); doc.rect(0, yPos, pageWidth, 40, 'F');
    doc.setTextColor(...darkText); doc.setFontSize(10); doc.setFont('times', 'normal');
    doc.text('Thank you for your purchase!', pageWidth / 2, yPos + 12, { align: 'center' });
    doc.text('For support: recycle.taskforce.nitt26@gmail.com | +91 63829 14862, +91 91553 80969', pageWidth / 2, yPos + 22, { align: 'center' });
    doc.setFontSize(8); doc.setFont('times', 'bolditalic');
    doc.text('Caution deposit refund amount will be based on the cycle\'s condition after inspection.', pageWidth / 2, yPos + 32, { align: 'center' });

    const filename = `Receipt-${orderNumber}-${Date.now()}.pdf`;
    try { doc.save(filename); }
    catch {
      try {
        const blob = doc.output('blob'); const url = URL.createObjectURL(blob); const a = document.createElement('a');
        a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      } catch {
        const dataUrl = doc.output('dataurlstring'); const win = window.open(); if (win) {
          win.document.write(`
<html><head><title>${filename}</title></head><body style="margin:0">
<iframe src="${dataUrl}" style="border:0; width:100%; height:100vh" allow="autoplay"></iframe>
</body></html>`);
          win.document.close();
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const order = orderId.trim();
    const ph = phone.trim();
    if (!order) { setError('Please enter order number'); return; }
    if (!/^\d{10}$/.test(ph)) { setError('Enter valid 10-digit phone'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select(`*, cycles(id, name, brand, model)`) // join cycle info
        .eq('order_id', order)
        .eq('buyer_phone', ph)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (error || !data) throw error || new Error('No matching bill found');
      await generateReceiptPdf({ row: data, cycle: data.cycles || {} });
      setSuccess('Bill downloaded successfully.');
    } catch (err) {
      console.error('Download bill failed', err);
      setError(err?.message || 'Failed to find or download bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Download Bill</h1>
        <p className="text-gray-600 mb-6">Enter your Order Number and Phone number used during purchase to download your bill.</p>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-600">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g. ORD-ABC123"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (10 digits)</label>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0,10))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="9876543210"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold ${loading ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-black`}
          >
            {loading ? 'Downloading…' : 'Download Bill'}
          </button>
        </form>
        <div className="mt-6 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default DownloadBill;
