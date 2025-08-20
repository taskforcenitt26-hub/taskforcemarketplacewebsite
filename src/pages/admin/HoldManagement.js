import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useHolds } from '../../hooks/useHolds';
import { Clock, User, Phone, Mail, X, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SectionLoader } from '../../components/SimpleLoaders';

const HoldManagement = () => {
  const { holds, loading, releaseHold } = useHolds();
  const [remainingTimes, setRemainingTimes] = useState({});
  const holdsRef = useRef(holds);
  const intervalRef = useRef(null);

  // Keep a ref to latest holds without re-running the interval effect
  useEffect(() => {
    holdsRef.current = holds;
  }, [holds]);

  // Memoize the time computation function
  const computeRemainingTime = useCallback((holdEndTime) => {
    const endTime = new Date(holdEndTime).getTime();
    const now = Date.now();
    const diff = Math.max(0, endTime - now);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, []);

  // Memoize the update function
  const updateTimes = useCallback(() => {
    const currentHolds = holdsRef.current || [];
    if (currentHolds.length === 0) {
      setRemainingTimes({});
      return;
    }

    const newTimes = {};
    currentHolds.forEach(hold => {
      newTimes[hold.id] = computeRemainingTime(hold.hold_end_time);
    });
    
    // Only update state if times have actually changed
    setRemainingTimes(prevTimes => {
      const hasChanged = Object.keys(newTimes).some(id => 
        newTimes[id] !== prevTimes[id]
      ) || Object.keys(prevTimes).length !== Object.keys(newTimes).length;
      
      return hasChanged ? newTimes : prevTimes;
    });
  }, [computeRemainingTime]);

  // Update remaining times every second
  useEffect(() => {
    updateTimes(); // Initial update
    
    intervalRef.current = setInterval(updateTimes, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateTimes]);

  const handleReleaseHold = useCallback(async (holdId, cycleName) => {
    if (window.confirm(`Are you sure you want to release the hold on "${cycleName}"?`)) {
      const result = await releaseHold(holdId);
      if (result.error) {
        alert('Error releasing hold: ' + result.error);
      } else {
        alert('Hold released successfully');
      }
    }
  }, [releaseHold]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }, []);

  const isExpired = useCallback((holdEndTime) => {
    return new Date(holdEndTime) <= new Date();
  }, []);

  // Memoize statistics to prevent unnecessary recalculations
  const statistics = useMemo(() => {
    const activeHolds = holds.filter(hold => !isExpired(hold.hold_end_time)).length;
    const expiredHolds = holds.filter(hold => isExpired(hold.hold_end_time)).length;
    const totalHolds = holds.length;
    
    return { activeHolds, expiredHolds, totalHolds };
  }, [holds, isExpired]);

  if (loading) {
    return <SectionLoader message="Loading cycle holds..." size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Hold Management</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {holds.length} active holds
          </span>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Holds Grid */}
      {holds.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No active holds</h3>
          <p className="mt-1 text-sm text-gray-500">
            When customers put cycles on hold, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {holds.map((hold) => (
            <div
              key={hold.id}
              className={`bg-white rounded-lg border-2 p-6 ${
                isExpired(hold.hold_end_time) 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-orange-200 bg-orange-50'
              }`}
            >
              {/* Cycle Info */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {hold.cycles?.image_url && (
                    <img
                      src={hold.cycles.image_url}
                      alt={hold.cycles.name}
                      className="w-16 h-16 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {hold.cycles?.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {hold.cycles?.brand} - {hold.cycles?.model}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Starting from ₹2,750
                  </p>
                </div>
                <button
                  onClick={() => handleReleaseHold(hold.id, hold.cycles?.name)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Release Hold"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Timer */}
              <div className={`mb-4 p-3 rounded-lg ${
                isExpired(hold.hold_end_time) 
                  ? 'bg-red-100 border border-red-200' 
                  : 'bg-white border border-orange-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock size={16} className={
                    isExpired(hold.hold_end_time) ? 'text-red-600' : 'text-orange-600'
                  } />
                  <span className={`font-medium ${
                    isExpired(hold.hold_end_time) ? 'text-red-900' : 'text-orange-900'
                  }`}>
                    {isExpired(hold.hold_end_time) ? 'EXPIRED' : 'Time Remaining'}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${
                  isExpired(hold.hold_end_time) ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {remainingTimes[hold.id] || 'Calculating...'}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">{hold.customer_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{hold.customer_email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{hold.customer_phone}</span>
                </div>
              </div>

              {/* Hold Details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>
                    Hold started: {formatDistanceToNow(new Date(hold.created_at), { addSuffix: true })}
                  </div>
                  <div>
                    Expires: {new Date(hold.hold_end_time).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <button
                  onClick={() => handleReleaseHold(hold.id, hold.cycles?.name)}
                  className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                    isExpired(hold.hold_end_time)
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {isExpired(hold.hold_end_time) ? 'Remove Expired Hold' : 'Release Hold'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hold Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {statistics.activeHolds}
            </div>
            <div className="text-sm text-gray-600">Active Holds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {statistics.expiredHolds}
            </div>
            <div className="text-sm text-gray-600">Expired Holds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statistics.totalHolds}
            </div>
            <div className="text-sm text-gray-600">Total Holds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldManagement;