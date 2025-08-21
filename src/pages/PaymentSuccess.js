// Importing required dependencies
import React, { useState } from 'react'; // React library for building UI
import { useLocation, Link } from 'react-router-dom'; // useLocation to fetch passed state, Link for navigation
import { CheckCircle, Download, Home, Calendar, CreditCard } from 'lucide-react'; // Icon components from lucide-react
import { jsPDF } from 'jspdf'; // Library for PDF generation (v3 uses named export)
import Logo from '../assets/logoblack.webp'; // Importing logo image to include in receipt

// Main functional component
const PaymentSuccess = () => {
  const location = useLocation(); // React Router hook to access route state
  // Extracting values passed from previous route via location.state
  const { cycle, orderNumber, paymentMethod, paidAmount, includeLock, selectedPlan } = location.state || {};
  const [downloadError, setDownloadError] = useState(null);

  // Display payment method in UI → 'UPI' if matches, otherwise 'Cash'
  const paymentDisplayUI = /upi/i.test(paymentMethod || '') ? 'UPI' : 'Cash';

  const lockPrice = 100; // Fixed lock price if included

  // Ensuring safe handling of amounts
  const totalAmount = Number(paidAmount ?? 0); // Convert paidAmount to number or fallback to 0
  const fallbackCycleAmount = cycle ? (cycle.computedPrice ?? cycle.price ?? 0) : 0; // fallback if no paidAmount
  const hasPersistedTotal = !Number.isNaN(totalAmount) && totalAmount > 0; // Validate paidAmount is usable

  // Calculate base and final amount
  const baseAmount = hasPersistedTotal
    ? Math.max(0, totalAmount - (includeLock ? lockPrice : 0)) // Exclude lock if present
    : fallbackCycleAmount; // fallback to cycle price

  const finalAmount = hasPersistedTotal
    ? totalAmount // Use actual total
    : (baseAmount + (includeLock ? lockPrice : 0)); // Otherwise compute final manually

  // Helper: convert WEBP to PNG data URL via canvas (more reliable for jsPDF)
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
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (e) => reject(e);
      img.src = src;
    } catch (e) { reject(e); }
  });

  // Function to generate and download receipt PDF
  const downloadReceipt = async () => {
    if (!orderNumber) { // Prevent download if no order number
      alert('Order information not available');
      return;
    }

    // Initialize jsPDF document (A4, mm units)
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
    const primaryColor = [255, 193, 7]; // Yellow theme
    const darkText = [33, 37, 41]; // Dark text color
    const lightGray = [245, 247, 250]; // Light gray for box background
    if (doc.setCharSpace) doc.setCharSpace(0); // Reset character spacing if supported

    // ===================== HEADER =====================
    doc.setFillColor(...primaryColor); // Yellow background
    doc.rect(0, 0, pageWidth, 50, 'F'); // Draw filled rectangle at top (balanced header)
    doc.setTextColor(...darkText); // Set text color
    doc.setFontSize(24); doc.setFont('times', 'bold');
    doc.text('TASKFORCE NIT TRICHY', pageWidth / 2, 15, { align: 'center' }); // Title
    doc.setFontSize(14); doc.setFont('times', 'normal');
    doc.text('RECycle Marketplace', pageWidth / 2, 27, { align: 'center' }); // Subtitle
    doc.setFontSize(10);
    doc.text('Purchase Receipt', pageWidth / 2, 35, { align: 'center' }); // Small header text

    // Add logo (convert WEBP -> PNG for reliability)
    doc.setTextColor(...darkText);
    try {
      const img = await webpToPngDataUrl(Logo);
      // Scale while preserving aspect ratio to align with three header text lines
      const maxW = 30; // mm
      const maxH = 24; // mm
      const imgRatio = img.width / img.height;
      let drawW = maxW;
      let drawH = drawW / imgRatio;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * imgRatio;
      }
      const x = 14; // left padding for better balance with centered text
      const headerH = 50; // header band height
      const y = (headerH - drawH) / 2; // vertically center in header band
      doc.addImage(img.dataUrl, 'PNG', x, y, drawW, drawH, undefined, 'FAST');
    } catch (_) { /* ignore logo failure */ }

    // ===================== ORDER INFORMATION =====================
    let yPos = 70; // Vertical offset (pushed down due to 50mm header)
    doc.setFontSize(16); doc.setFont('times', 'bold'); doc.text('Order Information', 20, yPos);
    yPos += 15; doc.setFontSize(11); doc.setFont('times', 'normal');

    // Order date formatted
    const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Order number & date
    doc.text('Order Number:', 20, yPos); doc.setFont('times', 'bold'); doc.text(String(orderNumber), 70, yPos); doc.setFont('times', 'normal');
    doc.text('Order Date:', 120, yPos); doc.setFont('times', 'bold'); doc.text(orderDate, 160, yPos); doc.setFont('times', 'normal');

    // Payment method
    yPos += 12; doc.text('Payment Method:', 20, yPos); doc.setFont('times', 'bold'); doc.text(paymentDisplayUI, 70, yPos); doc.setFont('times', 'normal');

    // ===================== PRODUCT DETAILS =====================
    yPos += 30; doc.setFontSize(16); doc.setFont('times', 'bold'); doc.text('Product Details', 20, yPos);
    yPos += 10;

    // Pre-compute plan wrapping to size the box correctly
    let planWrapped = null;
    let planBlockExtra = 0; // extra height beyond base to fit plan
    if (selectedPlan?.label) {
      const cleanPlanLabel = String(selectedPlan.label || '')
        .replace(/\s*\([^)]*\)\s*/g, '') // remove any (...) blocks
        .replace(/\s{2,}/g, ' ') // collapse multiple spaces
        .trim();
      const planText = `Plan: ${cleanPlanLabel}`
        + (selectedPlan.rent != null ? ` · Rent: Rs. ${Number(selectedPlan.rent).toFixed(2)}` : '')
        + (selectedPlan.deposit != null ? ` · Deposit: Rs. ${Number(selectedPlan.deposit).toFixed(2)}` : '');
      const maxLineWidth = pageWidth - 60; // inside margins
      planWrapped = doc.splitTextToSize(planText, maxLineWidth);
      // compute additional height needed for plan lines (base reserves ~10mm under brand/model)
      const planLines = Array.isArray(planWrapped) ? planWrapped.length : 1;
      const perLine = 5; // mm per line spacing
      const reserved = 10; // mm reserved in base 40mm box
      const needed = planLines * perLine;
      planBlockExtra = Math.max(0, needed - reserved);
    }

    // Gray background box with dynamic height
    const baseBoxH = 40;
    const productBoxH = baseBoxH + planBlockExtra;
    const boxTopY = yPos; // store top
    doc.setFillColor(...lightGray);
    doc.rect(20, boxTopY, pageWidth - 40, productBoxH, 'F');
    doc.setDrawColor(200,200,200);
    doc.rect(20, boxTopY, pageWidth - 40, productBoxH, 'S');

    // Cycle name
    yPos += 15; doc.setFontSize(14); doc.setFont('times', 'bold');
    doc.text(cycle?.name || 'Cycle Purchase', 25, yPos);

    // Brand + Model
    yPos += 10; doc.setFontSize(11); doc.setFont('times', 'normal');
    doc.text(`Brand: ${cycle?.brand || '-'}`, 25, yPos);
    doc.text(`Model: ${cycle?.model || '-'}`, 100, yPos);

    // Plan details inside the box with same font as the rest (Times, normal)
    if (planWrapped) {
      yPos += 8;
      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      if (doc.setCharSpace) doc.setCharSpace(0); // ensure no extra letter spacing
      doc.setTextColor(...darkText);
      doc.text(planWrapped, 25, yPos);
      // adjust yPos by actual lines drawn
      yPos += (planWrapped.length - 1) * 5;
      // keep darkText for subsequent content
    }

    // Price shown in product box (align to top-right area consistently)
    doc.setFontSize(14); doc.setFont('times', 'bold'); doc.setTextColor(...primaryColor);
    const priceY = boxTopY + 20; // visually aligned to title line
    doc.text(`Rs. ${Number(baseAmount).toFixed(2)}`, pageWidth - 30, priceY, { align: 'right' });
    doc.setTextColor(...darkText);

    // ===================== AMOUNT BREAKDOWN =====================
    yPos += 40; doc.setFontSize(16); doc.setFont('times', 'bold'); doc.text('Total Amount Paid', 20, yPos);
    yPos += 15; doc.setFontSize(11); doc.setFont('times', 'normal');

    // Prepare breakdown list
    const showLock = !!includeLock;
    const total = Number(finalAmount) || 0;
    const cycleRateForDisplay = hasPersistedTotal ? Math.max(0, total - (showLock ? lockPrice : 0)) : Number(baseAmount) || 0;

    // Items to show
    const summaryItems = [ { label: 'Cycle Rate', value: `Rs. ${cycleRateForDisplay.toFixed(2)}` } ];
    if (showLock) summaryItems.push({ label: 'Cycle Lock', value: `Rs. ${lockPrice.toFixed(2)}` });
    summaryItems.push({ label: 'Total Amount', value: `Rs. ${total.toFixed(2)}` });

    // Render items
    summaryItems.forEach(item => {
      doc.text(item.label, 20, yPos);
      doc.text(item.value, pageWidth - 20, yPos, { align: 'right' });
      yPos += 12;
    });

    // ===================== FOOTER =====================
    yPos = (typeof doc.internal.pageSize.getHeight === 'function' ? doc.internal.pageSize.getHeight() : doc.internal.pageSize.height) - 40;
    doc.setFillColor(...primaryColor); doc.rect(0, yPos, pageWidth, 40, 'F');
    doc.setTextColor(...darkText); doc.setFontSize(10); doc.setFont('times', 'normal');
    doc.text('Thank you for your purchase!', pageWidth / 2, yPos + 12, { align: 'center' });
    doc.text('For support: recycle.taskforce.nitt26@gmail.com | +91 63829 14862, +91 91553 80969', pageWidth / 2, yPos + 22, { align: 'center' });
    doc.setFontSize(8); doc.setFont('times', 'bolditalic');
    doc.text('Caution deposit refund amount will be based on the cycle\'s condition after inspection.', pageWidth / 2, yPos + 32, { align: 'center' });

    // Save receipt as PDF with robust fallback
    try {
      const filename = `Receipt-${orderNumber}-${Date.now()}.pdf`;
      doc.save(filename);
      setDownloadError(null);
    } catch (e) {
      // Fallback: create blob and trigger anchor download
      try {
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt-${orderNumber}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setDownloadError(null);
      } catch (e2) {
        // Final fallback: open in a new tab (works on iOS/Safari where download is blocked)
        try {
          const dataUrl = doc.output('dataurlstring');
          const win = window.open();
          if (win) {
            win.document.write(`\n<html><head><title>Receipt-${orderNumber}.pdf</title></head><body style="margin:0">\n<iframe src="${dataUrl}" style="border:0; width:100%; height:100vh" allow="autoplay"></iframe>\n</body></html>`);
            win.document.close();
            setDownloadError(null);
          } else {
            throw new Error('Popup blocked. Please allow popups for this site.');
          }
        } catch (e3) {
          setDownloadError(e3?.message || e2?.message || 'Unknown error while saving PDF');
          alert('Download failed. Please allow downloads/pop-ups and try again.');
        }
      }
    }
  };

  // ===================== UI RENDER =====================

  // If no order number → show fallback error screen
  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your order information.</p>
          <Link to="/browse-cycles" className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Format order date again for UI
  const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Return main PaymentSuccess screen
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===================== SUCCESS HEADER ===================== */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <CheckCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" /> {/* Success icon */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-4">Thank you for your purchase. Your order has been confirmed.</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
            <p className="text-yellow-800 font-medium">Order Number: {orderNumber}</p>
          </div>
        </div>

        {/* ===================== MAIN CONTENT GRID ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* -------- ORDER DETAILS -------- */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>

            {/* Cycle image + details */}
            <div className="flex items-center mb-6">
              {cycle?.image_url ? (
                <img src={cycle.image_url} alt={cycle?.name || 'Cycle'} className="w-20 h-20 object-cover rounded-lg mr-4" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4" /> // Placeholder if no image
              )}
              <div>
                <h3 className="font-semibold text-gray-900">{cycle?.name || 'Cycle Purchase'}</h3>
                <p className="text-gray-600">{cycle?.brand || '-'} {cycle?.model || ''}</p>
                <p className="text-lg font-semibold text-yellow-600">Rs. {Number(baseAmount).toFixed(2)}</p>
              </div>
            </div>

            {/* Order date & payment method */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Order Date</p>
                  <p className="text-sm">{orderDate}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <CreditCard className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm">{paymentDisplayUI}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Amount card removed per request */}
        </div>

        {/* ===================== ACTION BUTTONS ===================== */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button onClick={downloadReceipt} className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </button>

          <Link to="/browse-cycles" className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center">
            Continue Shopping
          </Link>
          <Link to="/" className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
        {downloadError && (
          <div className="mt-3 text-sm text-red-600">
            Error downloading receipt: {downloadError}. Try allowing pop-ups/downloads or tap and hold the button to open in a new tab.
          </div>
        )}

        {/* ===================== SUPPORT SECTION ===================== */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">If you have any questions about your order, please don't hesitate to contact us.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:recycle.taskforce.nitt26@gmail.com" className="text-yellow-600 hover:text-yellow-700 font-medium">recycle.taskforce.nitt26@gmail.com</a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a href="tel:+91-63829-14862" className="text-yellow-600 hover:text-yellow-700 font-medium">+91 63829 14862</a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a href="tel:+91-91553-80969" className="text-yellow-600 hover:text-yellow-700 font-medium">+91 91553 80969</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export component
export default PaymentSuccess;
