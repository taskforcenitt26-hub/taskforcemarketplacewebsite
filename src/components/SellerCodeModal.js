// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import icons from lucide-react library
import { X, Lock } from 'lucide-react';
// Import Supabase client for storage uploads
import { supabase } from '../lib/supabase';

// Bucket name for KYC uploads, comes from environment variable or defaults to 'kyc'
const KYC_BUCKET = process.env.REACT_APP_SUPABASE_KYC_BUCKET || 'kyc';

// Main component definition
const SellerCodeModal = ({ cycle, onClose, onVerified }) => {
  // State to hold the seller verification code entered by user
  const [sellerCode, setSellerCode] = useState('');
  // State to store error messages (if any)
  const [error, setError] = useState('');
  // State to track loading (when verifying seller code)
  const [loading, setLoading] = useState(false);
  // State to determine if seller code has been successfully verified
  const [isVerified, setIsVerified] = useState(false);

  // Predefined subscription plan options
  const planOptions = [
    { label: '2-Year Plan (₹1,750 + ₹1,000 deposit)', key: '2', rent: 1750, deposit: 1000 },
    { label: '3-Year Plan (₹2,000 + ₹1,000 deposit)', key: '3', rent: 2000, deposit: 1000 },
    { label: '4-Year Plan (₹2,250 + ₹1,000 deposit)', key: '4', rent: 2250, deposit: 1000 }
  ];
  // State for currently selected plan (default first option)
  const [selectedPlan, setSelectedPlan] = useState(planOptions[0]);
  // State to track if user wants a cycle lock add-on
  const [includeLock, setIncludeLock] = useState(false);
  // State to store selected Aadhaar file before uploading
  const [aadharFile, setAadharFile] = useState(null);
  // State to store uploaded Aadhaar file public URL
  const [aadharUrl, setAadharUrl] = useState('');
  // State to track Aadhaar uploading progress
  const [aadharUploading, setAadharUploading] = useState(false);

  // Handle form submission for seller code verification
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form reload
    setLoading(true);   // Start loading
    setError('');       // Clear old errors

    // For now: hard-coded valid seller code
    // In real production: this should be checked from backend DB
    const validSellerCode = '1234';

    // If seller code entered is incorrect
    if (sellerCode !== validSellerCode) {
      setError('Invalid seller code. Please contact the seller for the correct code.');
      setLoading(false);
      return;
    }

    // If seller code is correct, mark as verified
    setIsVerified(true);
    setLoading(false);
  };

  // Handle Aadhaar file input change
  const handleAadharChange = (e) => {
    const file = e.target.files?.[0]; // Take first selected file
    if (!file) return;

    // Allow only JPG, PNG, PDF
    const allowed = ['image/jpeg','image/jpg','image/png','application/pdf'];
    if (!allowed.includes(file.type)) {
      setError('Please upload a JPG, PNG, or PDF');
      return;
    }

    // Max file size allowed: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max 5MB');
      return;
    }

    // If valid, clear errors and set file
    setError('');
    setAadharFile(file);
  };

  // Function to upload Aadhaar file to Supabase storage
  const uploadAadhar = async () => {
    if (!aadharFile) return null; // No file selected
    setAadharUploading(true); // Start uploading
    try {
      // Generate unique path for file
      const ext = aadharFile.name.split('.').pop() || 'bin';
      const path = `aadhar/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      // Upload to Supabase storage bucket
      const { data, error } = await supabase.storage
        .from(KYC_BUCKET)
        .upload(path, aadharFile, { upsert: false, contentType: aadharFile.type });

      // If upload failed
      if (error) throw error;

      // Get public URL of uploaded file
      const { data: pub } = supabase.storage.from(KYC_BUCKET).getPublicUrl(data.path);
      setAadharUrl(pub.publicUrl); // Save URL to state
      return pub.publicUrl;
    } catch (e) {
      console.error('Aadhaar upload failed', e);

      // Handle "bucket not found" error
      if (e?.statusCode === '404' || /Bucket not found/i.test(e?.message || '')) {
        setError(`Storage bucket "${KYC_BUCKET}" not found. Please create it in Supabase Storage and try again.`);
      } else {
        setError('Failed to upload Aadhaar. Please try again.');
      }
      return null;
    } finally {
      setAadharUploading(false); // Stop uploading
    }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal container */}
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Seller Verification</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cycle information card */}
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">{cycle.name}</h3>
            <p className="text-blue-700 text-sm">
              {cycle.brand} {cycle.model}
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            To proceed with the purchase, please enter the unique verification code provided by our taskforce team. 
          </p>
        </div>

        {/* If not verified yet, show seller code form */}
        {!isVerified ? (
          <form onSubmit={handleSubmit}>
            {/* Show error if any */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {/* Seller code input field */}
            <div className="mb-4">
              <label htmlFor="sellerCode" className="block text-sm font-medium text-gray-700 mb-2">
                Seller Code *
              </label>
              <div className="relative">
                {/* Lock icon inside input field */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="sellerCode"
                  value={sellerCode}
                  // Convert input to uppercase always
                  onChange={(e) => setSellerCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter seller code"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Contact the taskforce team for the above code
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !sellerCode.trim()} // Disabled if empty or verifying
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>
          </form>
        ) : (
          // If verified, show plan selection, lock option, Aadhaar upload
          <div>
            {/* Plan selection radio buttons */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Plan</label>
              <div className="space-y-2">
                {planOptions.map((opt) => (
                  <label 
                    key={opt.key} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                      selectedPlan.key===opt.key ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="plan"
                        className="mr-3"
                        checked={selectedPlan.key === opt.key}
                        onChange={() => setSelectedPlan(opt)}
                      />
                      <span className="text-sm">{opt.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-yellow-700">
                      ₹{(opt.rent + opt.deposit).toLocaleString('en-IN')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lock add-on option */}
            <div className="mb-6">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-yellow-600"
                  checked={includeLock}
                  onChange={e => setIncludeLock(e.target.checked)}
                />
                <span>Add Cycle Lock (+₹100)</span>
              </label>
            </div>

            {/* Show error if Aadhaar upload fails */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-3">
                {error}
              </div>
            )}

            {/* Aadhaar upload field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Aadhaar (JPG/PNG/PDF, max 5MB) *</label>
              <input
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleAadharChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              {aadharFile && (
                <p className="mt-2 text-xs text-gray-500">Selected: {aadharFile.name}</p>
              )}
            </div>

            {/* Final action buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  // Aadhaar must be uploaded
                  if (!aadharFile && !aadharUrl) {
                    setError('Please upload your Aadhaar to continue');
                    return;
                  }
                  // Upload Aadhaar if not already uploaded
                  const url = aadharUrl || (await uploadAadhar());
                  if (!url) return;
                  // Call parent callback with chosen options
                  onVerified(selectedPlan, includeLock, url);
                }}
                className={`flex-1 ${
                  aadharUploading ? 'bg-yellow-400' : 'bg-yellow-500 hover:bg-yellow-600'
                } text-black px-4 py-2 rounded-md transition-colors disabled:opacity-50`}
                disabled={aadharUploading}
              >
                {aadharUploading ? 'Uploading...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export component
export default SellerCodeModal;
