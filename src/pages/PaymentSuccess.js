import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download, Mail, Home, Calendar, CreditCard } from 'lucide-react';
import jsPDF from 'jspdf';
import Logo from '../assets/billlogo.png';

const PaymentSuccess = () => {
  const location = useLocation();
  const { cycle, orderNumber, paymentMethod, paidAmount, includeLock } = location.state || {};
  const paymentDisplayUI = /upi/i.test(paymentMethod) ? 'UPI' : 'Cash';
  const lockPrice = 100;

  const finalAmount = paidAmount ?? (cycle ? (cycle.computedPrice ?? cycle.price) : 0);
  const baseAmount = finalAmount - (includeLock ? lockPrice : 0);

  const downloadReceipt = () => {
    if (!cycle || !orderNumber) {
      alert('Order information not available');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Colors
    // Primary brand color (yellow)
    const primaryColor = [234, 179, 8]; // Tailwind yellow-500

    const lightGray = [243, 244, 246]; // Gray-100
    
    // Header with new branding
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TASKFORCE NIT TRICHY', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('RECycle Marketplace', pageWidth / 2, 27, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Purchase Receipt', pageWidth / 2, 35, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add Taskforce logo left of title (15x15 mm)
    try {
      doc.addImage(Logo, 'PNG', 15, 5, 15, 30);
    } catch (e) {
      // ignore if logo fails to load, continue rendering
    }

    // Order Information Section
    let yPos = 60;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Information', 20, yPos);
    
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const orderDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Order details in two columns
    doc.text('Order Number:', 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(orderNumber, 70, yPos);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Order Date:', 120, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(orderDate, 160, yPos);
    doc.setFont('helvetica', 'normal');
    
    yPos += 12;
    doc.text('Payment Method:', 20, yPos);
    doc.setFont('helvetica', 'bold');
    const paymentDisplay = /upi/i.test(paymentMethod) ? 'UPI' : 'Cash';
    doc.text(paymentDisplay, 70, yPos);
    doc.setFont('helvetica', 'normal');
    
    // Product Information Section
    yPos += 30;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Product Details', 20, yPos);
    
    // Product box
    yPos += 10;
    doc.setFillColor(...lightGray);
    doc.rect(20, yPos, pageWidth - 40, 40, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, yPos, pageWidth - 40, 40, 'S');
    
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(cycle.name, 25, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Brand: ${cycle.brand}`, 25, yPos);
    doc.text(`Model: ${cycle.model}`, 100, yPos);
    doc.text(`Type: ${cycle.type} Bike`, 25, yPos + 8);
    // Cycle rate price on right
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(`Rs. ${baseAmount.toFixed(2)}`, pageWidth - 30, yPos - 5, { align: 'right' });
    
    doc.setTextColor(0, 0, 0);
    
    // Total Amount (we no longer show detailed order summary)
    yPos += 40;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount Paid', 20, yPos);
    
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const total = baseAmount + (includeLock ? lockPrice : 0);
    
    // Summary lines
    const summaryItems = [
      { label: 'Cycle Rate', value: `Rs. ${baseAmount.toFixed(2)}` }
    ];
    if (includeLock) {
      summaryItems.push({ label: 'Cycle Lock', value: `Rs. ${lockPrice.toFixed(2)}` });
    }
    summaryItems.push({ label: 'Total Amount', value: `Rs. ${total.toFixed(2)}` });
    
    summaryItems.forEach(item => {
      doc.text(item.label, 20, yPos);
      doc.text(item.value, pageWidth - 20, yPos, { align: 'right' });
      yPos += 12;
    });
    
    // Footer
    yPos = pageHeight - 40;
    doc.setFillColor(...primaryColor);
    doc.rect(0, yPos, pageWidth, 40, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your purchase!', pageWidth / 2, yPos + 12, { align: 'center' });
    doc.text('For support: recycle.taskforce.nitt26@gmail.com | +91 63829 14862, +91 91553 80969', pageWidth / 2, yPos + 22, { align: 'center' });
    // Disclaimer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bolditalic');
    doc.text('Caution deposit refund amount will be based on the cycle\'s condition after inspection.', pageWidth / 2, yPos + 32, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    
    // Save the PDF
    doc.save(`Receipt-${orderNumber}.pdf`);
  };

  if (!cycle || !orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find your order information. Please check your email for confirmation details.
          </p>
          <Link
            to="/browse-cycles"
            className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <CheckCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
            <p className="text-yellow-800 font-medium">Order Number: {orderNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            
            <div className="flex items-center mb-6">
              <img
                src={cycle.image_url}
                alt={cycle.name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{cycle.name}</h3>
                <p className="text-gray-600">{cycle.brand} {cycle.model}</p>
                <p className="text-gray-600">{cycle.type} Bike</p>
                <p className="text-lg font-semibold text-yellow-600">Rs. {baseAmount.toFixed(2)}</p>
              </div>
            </div>

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

          {/* Total Amount */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Total Amount</h2>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Cycle Rate</span>
                <span>Rs. {baseAmount.toFixed(2)}</span>
              </div>
              {includeLock && (
                <div className="flex justify-between">
                  <span>Lock Rate</span>
                  <span>Rs. {lockPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 font-semibold text-base">
                <span>Total</span>
                <span className="text-yellow-600">Rs. {(baseAmount + (includeLock ? lockPrice : 0)).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Mail className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-900">Confirmation Email Sent</span>
              </div>
              <p className="text-sm text-yellow-700">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button 
            onClick={downloadReceipt}
            className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </button>
          
          <Link
            to="/browse-cycles"
            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            Continue Shopping
          </Link>
          
          <Link
            to="/"
            className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Support */}
        <div className="bg-gray-100 rounded-lg p-6 mt-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:recycle.taskforce.nitt26@gmail.com"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              recycle.taskforce.nitt26@gmail.com
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a
              href="tel:+91-63829-14862"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              +91 63829 14862
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a
              href="tel:+91-91553-80969"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              +91 91553 80969
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;