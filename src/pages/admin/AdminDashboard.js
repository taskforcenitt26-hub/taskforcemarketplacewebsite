import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCycles } from '../../hooks/useCycles';
import { useHolds } from '../../hooks/useHolds';

import { 
  BarChart3, 
  Bike, 
  Clock, 
  Plus,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import HomepageBG from '../../assets/HomepageBG.webp';
import CycleManagement from './CycleManagement';
import HoldManagement from './HoldManagement';
import AddCycleModal from './AddCycleModal';
import PaymentRequestsPanel from './PaymentRequestsPanel';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { cycles } = useCycles();
  const { holds } = useHolds();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate statistics
  const totalCycles = cycles.length;
  const availableCycles = cycles.filter(cycle => cycle.is_available).length;
  const activeHolds = holds.filter(hold => hold.is_active).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} className="text-yellow-600" /> },
    { id: 'cycles', label: 'Cycle Management', icon: <Bike size={20} className="text-yellow-600" /> },
    { id: 'holds', label: 'Hold Management', icon: <Clock size={20} className="text-yellow-600" /> },
    { id: 'requests', label: 'Payment Requests', icon: <CreditCard size={20} className="text-yellow-600" /> },
  ];

  const stats = [
    {
      title: 'Total Cycles',
      value: totalCycles,
      icon: <Bike className="text-yellow-600" size={24} />,
    },
    {
      title: 'Available Cycles',
      value: availableCycles,
      icon: <TrendingUp className="text-yellow-600" size={24} />,
    },
    {
      title: 'Active Holds',
      value: activeHolds,
      icon: <Clock className="text-yellow-600" size={24} />,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'cycles':
        return <CycleManagement />;
      case 'holds':
        return <HoldManagement />;
      case 'requests':
        return <PaymentRequestsPanel />;
      default:
        return (
          <div className="space-y-6">
            {/* Main Overview Card */}
            <div className="bg-white/80 backdrop-blur-md border border-yellow-200 rounded-2xl p-6 lg:p-8 shadow-xl space-y-8">
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white border border-yellow-100 rounded-xl px-6 py-8 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center">
                    <div className="mb-4 text-yellow-600">{stat.icon}</div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <img src={HomepageBG} alt="Dashboard Background" className="w-full h-full object-cover fixed top-0 left-0 z-[-1]" />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white">RECycle Admin Panel</h1>
                <p className="text-gray-200 mt-1">Welcome back, {user?.email}</p>
              </div>
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1 active:scale-95"
                >
                  <Plus size={20} className="text-yellow-700" />
                  <span>Add Cycle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation: mobile dropdown + desktop tabs */}
          <div className="bg-white rounded-2xl shadow-md mb-6 border border-gray-100">
            {/* Mobile: dropdown selector */}
            <div className="sm:hidden p-4">
              <label htmlFor="admin-tab-select" className="sr-only">Select section</label>
              <div className="relative">
                <select
                  id="admin-tab-select"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                >
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>{tab.label}</option>
                  ))}
                </select>
                {/* Custom chevron icon */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.168l3.71-2.94a.75.75 0 11.94 1.16l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.39a.75.75 0 01.02-1.18z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Desktop: tab bar */}
            <div className="hidden sm:block">
              <nav className="flex gap-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 font-semibold text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'text-yellow-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            {renderContent()}
          </div>
        </div>

        {/* Add Cycle Modal */}
        {showAddModal && (
          <AddCycleModal onClose={() => setShowAddModal(false)} />
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;