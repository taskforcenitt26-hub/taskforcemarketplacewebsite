import React from 'react';
import HomepageBG from '../assets/HomepageBG.png';
import { Play } from 'lucide-react';

/**
 * LaunchPage – shown before the main site when the intro feature is enabled.
 * Displays the same hero-style background and a central button to "Launch Website".
 */
const LaunchPage = ({ onEnter }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HomepageBG}
          alt="Launch Background"
          className="w-full h-full object-cover fixed top-0 left-0 z-[-1]"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 animate-fade-in">
          The website is ready!
        </h1>
        <button
          onClick={onEnter}
          className="inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold text-lg shadow-lg transform hover:-translate-y-1 active:scale-95 transition-all duration-200"
        >
          <Play size={24} className="text-yellow-800 animate-ping-slow" />
          <span>Launch Website</span>
        </button>
      </div>
    </section>
  );
};

export default LaunchPage;
