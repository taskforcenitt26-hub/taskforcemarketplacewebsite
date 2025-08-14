import React from 'react';
import { Bike } from 'lucide-react';
import './IntroOverlay.css';

/**
 * IntroOverlay component
 * Displays a full-screen overlay with a short animation announcing that the
 * website is live and running. It automatically fades out after a few seconds
 * (handled by parent) or when the user clicks anywhere on the overlay if the
 * parent passes an onClose handler.
 */
const IntroOverlay = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white select-none cursor-pointer"
      onClick={onClose}
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center animate-fade-slide-up">
        Website is live & running
      </h1>
      <p className="text-lg text-center max-w-xs md:max-w-md animate-fade-slide-up" style={{animationDelay: '0.2s'}} >
        Welcome! The site is up and ready. Click anywhere or wait a moment to
        continue.
      </p>

      {/* Bike + loading bar */}
      <div className="loading-wrapper">
        <Bike className="cycle-icon text-yellow-400" size={40} />
        <div className="loading-bar" />
      </div>
    </div>
  );
};

export default IntroOverlay;
