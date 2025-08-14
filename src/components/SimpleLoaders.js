import React from 'react';

// Simple Professional Spinner
export const SimpleSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div className={`${sizeClasses[size]} border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
    </div>
  );
};

// Page Loading Component
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <SimpleSpinner size="lg" className="mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Inline Loading for Buttons
export const InlineLoader = ({ message = 'Loading...', textColor = 'text-gray-600' }) => {
  return (
    <div className="inline-flex items-center space-x-2">
      <SimpleSpinner size="sm" />
      <span className={`font-medium text-sm ${textColor}`}>{message}</span>
    </div>
  );
};

// Compact Section Loader
export const SectionLoader = ({ message, size = 'md' }) => {
  return (
    <div className="flex flex-col items-center py-12">
      <SimpleSpinner size={size} className="mb-3" />
      {message && (
        <p className="text-gray-600 font-medium text-sm">{message}</p>
      )}
    </div>
  );
};

// Card Skeleton Loader
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}>
      <div className="h-64 bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="space-x-2 flex">
            <div className="h-10 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Grid Skeleton
export const GridSkeleton = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  );
};

// Button Loading State
export const LoadingButton = ({ 
  children, 
  loading, 
  loadingText = 'Loading...', 
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`${className} ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <InlineLoader message={loadingText} textColor="text-current" />
      ) : (
        children
      )}
    </button>
  );
};

const SimpleLoaders = {
  SimpleSpinner,
  PageLoader,
  InlineLoader,
  SectionLoader,
  CardSkeleton,
  GridSkeleton,
  TableRowSkeleton,
  LoadingButton
};

export default SimpleLoaders;