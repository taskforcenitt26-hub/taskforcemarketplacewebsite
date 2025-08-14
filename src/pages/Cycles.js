import React, { useState, useMemo } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import HomepageBG from '../assets/HomepageBG.png';
import { useCycles } from '../hooks/useCycles';
import { useHolds } from '../hooks/useHolds';
import usePageTitle from '../hooks/usePageTitle';
import CycleCard from '../components/CycleCard';
import { PageLoader } from '../components/SimpleLoaders';

const Cycles = () => {
  // Set page title
  usePageTitle('Browse Cycles');
  
  const { cycles, loading } = useCycles();
  const { createHold } = useHolds();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const planOptions = [
    { label: '2-Year Plan (₹1,750 + ₹1,000 deposit)', key: '2', rent: 1750, deposit: 1000 },
    { label: '3-Year Plan (₹2,000 + ₹1,000 deposit)', key: '3', rent: 2000, deposit: 1000 },
    { label: '4-Year Plan (₹2,250 + ₹1,000 deposit)', key: '4', rent: 2250, deposit: 1000 }
  ];

  const [selectedPlan, setSelectedPlan] = useState(planOptions[0]);

  // Get unique brands for filters
  const brands = useMemo(() => {
    return [...new Set(cycles.map(cycle => cycle.brand))].sort();
  }, [cycles]);

  // Filter and sort cycles
  const filteredAndSortedCycles = useMemo(() => {
    let filtered = cycles.filter(cycle => {
      const matchesSearch = cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cycle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cycle.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBrand = !selectedBrand || cycle.brand === selectedBrand;

      return matchesSearch && matchesBrand;
    });

    // Sort cycles
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'brand':
          aValue = a.brand;
          bValue = b.brand;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [cycles, searchTerm, selectedBrand, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPlan(planOptions[0]);
    setSelectedBrand('');
    setSortBy('name');
    setSortOrder('asc');
  };

  if (loading) {
    return <PageLoader message="Loading our premium collection..." />;
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <img src={HomepageBG} alt="Browse Background" className="w-full h-full object-cover fixed top-0 left-0 z-[-1]" />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
              Recommended Collections
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Browse Our
              <span className="block text-yellow-400">Cycle Collection</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of bicycles,<br />
              Enhanced through our Brand New Initiative: <b>Market Place</b>
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search cycles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                />
              </div>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 bg-white"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              {/* Plan Filter */}
              <select
                value={selectedPlan.key}
                onChange={(e) => {
                  const plan = planOptions.find(p => p.key === e.target.value);
                  setSelectedPlan(plan);
                }}
                className="w-full min-w-[240px] px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 bg-white text-sm whitespace-normal"
              >
                {planOptions.map(plan => (
                  <option key={plan.key} value={plan.key}>{plan.label}</option>
                ))}
              </select>

              {/* Sort */}
              <div className="flex space-x-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="brand">Sort by Brand</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200 group"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <SortAsc className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform duration-200 text-gray-600 group-hover:text-yellow-600`} size={20} />
                </button>
              </div>
            </div>

            {/* Plan Note */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-sm text-yellow-800 text-center">
              Prices below include the selected rental fee plus a caution deposit of ₹1,000.
            </div>

            {/* Clear Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <span className="text-lg font-medium text-gray-700">
                Showing <span className="text-yellow-600 font-bold">{filteredAndSortedCycles.length}</span> of <span className="font-bold">{cycles.length}</span> cycles
              </span>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-yellow-600 hover:text-white hover:bg-yellow-600 border border-yellow-600 rounded-lg transition-all duration-200 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Cycles Grid */}
          {filteredAndSortedCycles.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-lg p-12 mx-auto max-w-md">
                <div className="text-gray-400 mb-6">
                  <Filter size={64} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No cycles found</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  We couldn't find any cycles matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-3 rounded-xl font-medium hover:from-yellow-700 hover:to-yellow-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedCycles.map((cycle) => (
                <CycleCard
                  key={cycle.id}
                  cycle={{ ...cycle, computedPrice: selectedPlan.rent + selectedPlan.deposit, planLabel: selectedPlan.label }}
                  onHold={createHold}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cycles;