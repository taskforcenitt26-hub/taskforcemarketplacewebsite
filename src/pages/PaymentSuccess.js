// Importing required dependencies
import React from 'react'; // React library for building UI
import { useLocation, Link } from 'react-router-dom'; // useLocation to fetch passed state, Link for navigation
import { CheckCircle, Download, Mail, Home, Calendar, CreditCard } from 'lucide-react'; // Icon components from lucide-react
import jsPDF from 'jspdf'; // Library for PDF generation
import Logo from '../assets/logoblack.webp'; // Importing logo image to include in receipt

// Main functional component
const PaymentSuccess = () => {
  const location = useLocation(); // React Router hook to access route state
  // Extracting values passed from previous route via location.state
  const { cycle, orderNumber, paymentMethod, paidAmount, includeLock, selectedPlan } = location.state || {};

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

  // Function to generate and download receipt PDF
  const downloadReceipt = () => {
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
    doc.rect(0, 0, pageWidth, 40, 'F'); // Draw filled rectangle at top
    doc.setTextColor(...darkText); // Set text color
    doc.setFontSize(24); doc.setFont('times', 'bold');
    doc.text('TASKFORCE NIT TRICHY', pageWidth / 2, 15, { align: 'center' }); // Title
    doc.setFontSize(14); doc.setFont('times', 'normal');
    doc.text('RECycle Marketplace', pageWidth / 2, 27, { align: 'center' }); // Subtitle
    doc.setFontSize(10);
    doc.text('Purchase Receipt', pageWidth / 2, 35, { align: 'center' }); // Small header text

    // Add logo (safe inside try/catch if missing)
    doc.setTextColor(...darkText);
    try { doc.addImage(Logo, 'PNG', 15, 5, 15, 30); } catch (_) {}

    // ===================== ORDER INFORMATION =====================
    let yPos = 60; // Vertical offset
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
    // Gray background box
    doc.setFillColor(...lightGray); doc.rect(20, yPos, pageWidth - 40, 40, 'F'); doc.setDrawColor(200,200,200); doc.rect(20, yPos, pageWidth - 40, 40, 'S');

    // Cycle name
    yPos += 15; doc.setFontSize(14); doc.setFont('times', 'bold');
    doc.text(cycle?.name || 'Cycle Purchase', 25, yPos);

    // Brand + Model
    yPos += 10; doc.setFontSize(11); doc.setFont('times', 'normal');
    doc.text(`Brand: ${cycle?.brand || '-'}`, 25, yPos);
    doc.text(`Model: ${cycle?.model || '-'}`, 100, yPos);

    // Plan details if available
    if (selectedPlan?.label) {
      yPos += 8;
      doc.setFont('times', 'normal'); doc.setFontSize(9);
      if (doc.setCharSpace) doc.setCharSpace(0);

      // Build plan string
      const planText = `Plan: ${selectedPlan.label}`
        + (selectedPlan.rent != null ? ` · Rent: Rs. ${Number(selectedPlan.rent).toFixed(2)}` : '')
        + (selectedPlan.deposit != null ? ` · Deposit: Rs. ${Number(selectedPlan.deposit).toFixed(2)}` : '');

      // Wrap plan text if too long
      const maxLineWidth = pageWidth - 60;
      const wrapped = doc.splitTextToSize(planText, maxLineWidth);
      doc.text(wrapped, 25, yPos);

      // Increase yPos if text wraps
      yPos += (wrapped.length - 1) * 5;
    }

    // Price shown in product box
    doc.setFontSize(14); doc.setFont('times', 'bold'); doc.setTextColor(...primaryColor);
    doc.text(`Rs. ${Number(baseAmount).toFixed(2)}`, pageWidth - 30, yPos - 5, { align: 'right' });
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

    // Save receipt as PDF
    doc.save(`Receipt-${orderNumber}.pdf`);
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

          {/* -------- TOTAL AMOUNT -------- */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Amount</h2>

            {/* Breakdown */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Cycle Rate</span>
                <span>Rs. {hasPersistedTotal ? Math.max(0, Number(finalAmount) - (includeLock ? lockPrice : 0)).toFixed(2) : Number(baseAmount).toFixed(2)}</span>
              </div>
              {includeLock && (
                <div className="flex justify-between"><span>Lock Rate</span><span>Rs. {lockPrice.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between border-t pt-2 font-semibold text-base">
                <span>Total</span>
                <span className="text-yellow-600">Rs. {Number(finalAmount).toFixed(2)}</span>
              </div>
            </div>

            {/* Confirmation email notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-900">Confirmation Email Sent</span>
              </div>
              <p className="text-sm text-yellow-700">A confirmation email has been sent to your registered email address.</p>
            </div>
          </div>
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
