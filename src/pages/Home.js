import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCycles } from '../hooks/useCycles';
import { useHolds } from '../hooks/useHolds';
import usePageTitle from '../hooks/usePageTitle';
import CycleCard from '../components/CycleCard';
import { GridSkeleton } from '../components/SimpleLoaders';
import HomepageBG from '../assets/HomepageBG.png';

const Home = () => {
  usePageTitle('Home');
  
  const { cycles, loading } = useCycles();
  
    // Plan options matching the browse cycles page
  const planOptions = [
    { label: '2-Year Plan (₹1,750 + ₹1,000 deposit)', key: '2', rent: 1750, deposit: 1000 },
    { label: '3-Year Plan (₹2,000 + ₹1,000 deposit)', key: '3', rent: 2000, deposit: 1000 },
    { label: '4-Year Plan (₹2,250 + ₹1,000 deposit)', key: '4', rent: 2250, deposit: 1000 }
  ];
  
  // Default to 2-year plan for featured section
  const defaultPlan = planOptions[0];
  
  // Pick top 3 available cycles for featured section based on rating and availability
  const featuredCycles = React.useMemo(() => {
    if (!cycles || cycles.length === 0) return [];
    
    // Create a copy to avoid mutating the original array
    const availableCycles = [...cycles]
      // Filter available cycles
      .filter(cycle => cycle.is_available)
      // Sort by rating (highest first) and then by name
      .sort((a, b) => {
        // If ratings are the same, sort by name
        if ((b.rating || 0) === (a.rating || 0)) {
          return a.name.localeCompare(b.name);
        }
        // Otherwise sort by rating (highest first)
        return (b.rating || 0) - (a.rating || 0);
      })
      // Add computed price and plan label to match browse cycles
      .map(cycle => ({
        ...cycle,
        computedPrice: defaultPlan.rent + defaultPlan.deposit,
        planLabel: defaultPlan.label
      }));
    
    // Return top 3 or all available if less than 3
    return availableCycles.slice(0, 3);
  }, [cycles, defaultPlan.deposit, defaultPlan.label, defaultPlan.rent]);

  const { createHold } = useHolds();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={HomepageBG} alt="Homepage Background" className="w-full h-full object-cover fixed top-0 left-0 z-[-1]" />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-200 rounded-full text-sm font-medium tracking-wide uppercase backdrop-blur-sm border border-yellow-400/20">
                Celebrating 10 Years of TaskForce
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight text-center">
              Start Your College Journey with
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mt-2">
                Refurbished Cycles.<br/>
                Student-Friendly Rentals.
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed text-center">
             We at Taskforce RECycle breathe new life into old bicycles and rent them out to incoming first-years. Whether you're heading to class or exploring campus, our cycles are a sustainable and affordable way to get moving from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/browse-cycles"
                className="group bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-10 py-4 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl hover:shadow-yellow-400/40 transform hover:-translate-y-1 hover:scale-105 relative after:absolute after:inset-0 after:rounded-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:bg-yellow-400/20 after:-z-10 after:blur-xl"
              >
                <span className="text-lg group-hover:text-yellow-900">Explore Collection</span>
                <ArrowRight size={22} className="group-hover:translate-x-2 group-hover:text-yellow-900 transition-all duration-300" />
              </Link>
              <Link
                to="/contact"
                className="group bg-white border-2 border-yellow-400 text-black px-10 py-4 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-md hover:shadow-yellow-400/40 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-lg">Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cycles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
              Featured Collection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Handpicked for
              <span className="block text-yellow-600">You</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of cycles <br />
              out of our stock of 100+ refurbished cycles.
            </p>
          </div>

          {loading ? (
            <GridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCycles.map((cycle) => (
              <div key={cycle.id} className="transition-transform duration-300 hover:scale-105">
                <CycleCard
                  cycle={cycle}
                  onHold={createHold}
                />
              </div>
            ))}
          </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/browse-cycles"
              className="group bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-10 py-4 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl hover:shadow-yellow-400/40 transform hover:-translate-y-1 hover:scale-105 relative after:absolute after:inset-0 after:rounded-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:bg-yellow-400/20 after:-z-10 after:blur-xl"
            >
              <span className="text-lg group-hover:text-yellow-900">View All Cycles</span>
              <ArrowRight size={22} className="group-hover:translate-x-2 group-hover:text-yellow-900 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative text-white py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={HomepageBG} alt="Homepage Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Cycling Journey?
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/browse-cycles"
              className="group bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-12 py-5 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-2xl hover:shadow-yellow-400/40 transform hover:-translate-y-1 hover:scale-105 relative after:absolute after:inset-0 after:rounded-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:bg-yellow-400/20 after:-z-10 after:blur-xl"
            >
              <span className="text-xl group-hover:text-yellow-900">Shop Now</span>
              <ArrowRight size={24} className="group-hover:translate-x-2 group-hover:text-yellow-900 transition-all duration-300" />
            </Link>
            <Link
              to="/contact"
              className="group bg-white border-2 border-yellow-400 text-black px-12 py-5 rounded-xl font-bold hover:bg-yellow-400 hover:text-black transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-lg hover:shadow-yellow-400/40 transform hover:-translate-y-1 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;