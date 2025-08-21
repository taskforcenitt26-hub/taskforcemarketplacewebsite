// Import React and useState hook
import React, { useState, useMemo } from 'react';

// Import Filter icon from lucide-react
import { Filter } from 'lucide-react';

// Import background image for this page
import HomepageBG from '../assets/HomepageBG.webp';

// Import custom hooks to fetch cycles and hold (reservation) data
import { useCycles } from '../hooks/useCycles';
import { useHolds } from '../hooks/useHolds';

// Import custom hook to set the page title
import usePageTitle from '../hooks/usePageTitle';

// Import CycleCard component (individual card for each cycle)
import CycleCard from '../components/CycleCard';


// Define the Cycles page component
const Cycles = () => {
  // Dynamically set page title
  usePageTitle('Browse Cycles');
  
  // Get all available cycles using the custom hook
  const { cycles } = useCycles();

  // Search term for serial number (e.g., TF001)
  const [search, setSearch] = useState('');

  // Get all active holds (reservations) and function to create new hold
  const { holds, createHold } = useHolds();
  
  // Predefined plan options (rental duration + cost + deposit)
  const planOptions = [
    { label: '2-Year Plan (₹1,750 + ₹1,000 deposit)', key: '2', rent: 1750, deposit: 1000 },
    { label: '3-Year Plan (₹2,000 + ₹1,000 deposit)', key: '3', rent: 2000, deposit: 1000 },
    { label: '4-Year Plan (₹2,250 + ₹1,000 deposit)', key: '4', rent: 2250, deposit: 1000 }
  ];
 
  // For now, always use the first plan option (2-Year Plan) — no selection UI
  const [selectedPlan] = useState(planOptions[0]);
 
  // Helper: extract numeric part from names like TF118 -> 118
  const serialNum = (name) => {
    try {
      const m = String(name || '').match(/(\d{1,})$/);
      return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
    } catch {
      return Number.POSITIVE_INFINITY;
    }
  };

  // Normalize search input (case-insensitive, trim spaces)
  const normSearch = search.trim().toUpperCase();

  // Filter by serial and sort numerically ascending (TF001..TF118)
  const items = useMemo(() => {
    const filtered = cycles.filter(c => {
      if (!normSearch) return true;
      const name = String(c.name || '').toUpperCase();
      return name.includes(normSearch);
    });
    return filtered.slice().sort((a, b) => serialNum(a.name) - serialNum(b.name));
  }, [cycles, normSearch]);
 
  return (
    // Main section with background and content
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={HomepageBG} 
          alt="Browse Background" 
          className="w-full h-full object-cover fixed top-0 left-0 z-[-1]" 
        />
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Browse Our
              <span className="block text-yellow-400">Cycle Collection</span>
            </h1>
            {/* Subtitle */}
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of bicycles,<br />
              Enhanced through our Brand New Initiative: <b>Market Place</b>
            </p>
          </div>

          {/* Search by Serial Number */}
          <div className="max-w-xl mx-auto mb-10">
            <label htmlFor="serialSearch" className="block text-sm font-medium text-gray-200 mb-2">
              Search by Serial Number (e.g., TF001)
            </label>
            <input
              id="serialSearch"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type TF001, TF045, ..."
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow"
            />
          </div>

          {/* Cycles Grid */}
          {items.length === 0 ? (
            // If no cycles found → show empty state
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-lg p-12 mx-auto max-w-md">
                {/* Empty state icon */}
                <div className="text-gray-400 mb-6">
                  <Filter size={64} className="mx-auto" />
                </div>
                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No cycles found</h3>
                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  We couldn't find any cycles matching your criteria. 
                  Try adjusting your filters or search terms.
                </p>
              </div>
            </div>
          ) : (
            // If cycles exist → show grid of CycleCards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((cycle) => {
                // Check if this cycle already has an active hold (reservation)
                const activeHold = holds.find(h => h.cycle_id === cycle.id && h.is_active);
                
                // Render individual cycle card
                return (
                  <CycleCard
                    key={cycle.id} // unique key for React
                    cycle={{ 
                      ...cycle, 
                      computedPrice: selectedPlan.rent + selectedPlan.deposit, // calculate price
                      planLabel: selectedPlan.label // attach selected plan label
                    }}
                    onHold={createHold} // function to place a hold
                    activeHold={activeHold || null} // pass active hold if exists
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Export Cycles component
export default Cycles;
