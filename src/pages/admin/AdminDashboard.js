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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-white">RECycle Admin Panel</h1>
                <p className="text-gray-200 mt-1">Welcome back, {user?.email}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1 active:scale-95"
                >
                  <Plus size={20} className="text-yellow-700" />
                  <span>Add Cycle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-md mb-6 border border-gray-100">
            <div>
              <nav className="flex space-x-8 px-6">
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