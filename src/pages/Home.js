// Import React library
import React from 'react';

// Import Link from react-router-dom for navigation between routes
import { Link } from 'react-router-dom';

// Import ArrowRight icon from lucide-react for a nice arrow icon
import { ArrowRight } from 'lucide-react';

// Import custom hook to dynamically set page title
import usePageTitle from '../hooks/usePageTitle';

// Import homepage background image
import HomepageBG from '../assets/HomepageBG.webp';


// Define the Home component
const Home = () => {
  // Set page title to "Home" using the custom hook
  usePageTitle('Home');
  
  return (
    // Outer container ensures full-screen height
    <div className="min-h-screen">
      
      {/* Hero Section with background */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden min-h-screen">
        
        {/* Background image + overlay */}
        <div className="absolute inset-0">
          {/* Fullscreen background image fixed in place */}
          <img 
            src={HomepageBG} 
            alt="Homepage Background" 
            className="w-full h-full object-cover fixed top-0 left-0 z-[-1]" 
          />
          {/* Semi-transparent dark overlay for contrast */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        {/* Content container (centers content and applies spacing) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Text Centered Block */}
          <div className="text-center">
            
            {/* Anniversary Highlight Badge */}
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-200 rounded-full text-sm font-medium tracking-wide uppercase backdrop-blur-sm border border-yellow-400/20">
                Celebrating 10 Years of TaskForce
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight text-center">
              Start Your College Journey with
              {/* Gradient-highlighted subheading */}
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mt-2">
                Refurbished Cycles.<br/>
                Student-Friendly Rentals.
              </span>
            </h1>

            {/* Subheading paragraph */}
            <p className="text-lg sm:text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed text-center">
              We at Taskforce RECycle breathe new life into old bicycles and rent them out to incoming first-years. 
              Whether you're heading to class or exploring campus, our cycles are a sustainable and affordable way 
              to get moving from day one.
            </p>

            {/* Action Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              
              {/* Explore Collection Button */}
              <Link
                to="/browse-cycles" // navigates to browse cycles page
                className="group bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-10 py-4 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl hover:shadow-yellow-400/40 transform hover:-translate-y-1 hover:scale-105 relative after:absolute after:inset-0 after:rounded-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:bg-yellow-400/20 after:-z-10 after:blur-xl"
              >
                {/* Button Text */}
                <span className="text-lg group-hover:text-yellow-900">Explore Collection</span>
                {/* Arrow icon shifts slightly on hover */}
                <ArrowRight 
                  size={22} 
                  className="group-hover:translate-x-2 group-hover:text-yellow-900 transition-all duration-300" 
                />
              </Link>

              {/* Contact Us Button */}
              <Link
                to="/contact" // navigates to contact page
                className="group bg-white border-2 border-yellow-400 text-black px-10 py-4 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300 inline-flex items-center justify-center space-x-3 shadow-md hover:shadow-yellow-400/40 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-lg">Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NOTE: Other sections intentionally removed as per your original code */}
    </div>
  );
};

// Export Home component as default
export default Home;
