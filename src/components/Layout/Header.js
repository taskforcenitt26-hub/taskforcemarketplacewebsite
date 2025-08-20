// Importing React for JSX and hooks
import React from 'react';  

// Importing Link for navigation, useNavigate to programmatically redirect, and useLocation to track active route
import { Link, useNavigate, useLocation } from 'react-router-dom';  

// Importing authentication context to manage user state
import { useAuth } from '../../contexts/AuthContext';  

// Importing icons from lucide-react library
import { LogOut, Menu, X } from 'lucide-react';  

// Importing app logo
import logo from '../../assets/logo.webp';  

// Defining Header functional component
const Header = () => {  
  // Destructure user info and signOut function from AuthContext
  const { user, signOut } = useAuth();  

  // Hook to navigate programmatically (e.g., after sign out)
  const navigate = useNavigate();  

  // Hook to get current location path for active nav highlighting
  const location = useLocation();  

  // State for controlling mobile menu open/close
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);  

  // Function to sign out user and redirect to home
  const handleSignOut = async () => {  
    await signOut();  // Sign out user from AuthContext
    navigate('/');    // Redirect to homepage
  };  

  // Base CSS classes for navigation links (desktop)
  const navLinkClass = `px-4 py-2 text-gray-600 hover:text-yellow-600 rounded-lg transition-all duration-300 font-medium relative group overflow-hidden`;  

  // Base CSS classes for navigation links (mobile)
  const mobileNavLinkClass = `px-4 py-3 text-gray-600 hover:text-yellow-600 rounded-lg transition-all duration-300 font-medium relative group overflow-hidden`;  

  // Returning JSX for header
  return (  
    // Header wrapper with background and border
    <header className="bg-white shadow-lg border-b border-gray-200">  
      {/* Outer container with max width and horizontal padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
        
        {/* Top bar with logo on left and nav/actions on right */}
        <div className="flex justify-between items-center h-20">  
          
          {/* Logo with brand name */}
          <Link to="/" className="flex items-center space-x-3 group">  
            {/* Logo image container */}
            <div className="w-16 h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">  
              <img src={logo} alt="Taskforce RECycle Logo" className="w-14 h-14 object-contain" />  
            </div>  
            {/* Logo text + tagline */}
            <div className="flex flex-col">  
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Taskforce RECycle</span>  
              <span className="text-xs text-gray-600 font-medium tracking-wider">MARKET PLACE</span>  
            </div>  
          </Link>  

          {/* Desktop Navigation Links (hidden on mobile) */}
          <nav className="hidden md:flex space-x-1">  
            {/* Home Link */}
            <Link 
              to="/"  
              className={`${navLinkClass} ${location.pathname === '/' ? 'text-yellow-600 font-semibold' : ''}`}  
            >  
              <span className="relative z-10">Home</span>  
              <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
            </Link>  

            {/* Browse Cycles Link */}
            <Link 
              to="/browse-cycles"  
              className={`${navLinkClass} ${location.pathname === '/browse-cycles' ? 'text-yellow-600 font-semibold' : ''}`}  
            >  
              <span className="relative z-10">Browse Cycles</span>  
              <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
            </Link>  

            {/* About Link */}
            <Link 
              to="/about"  
              className={`${navLinkClass} ${location.pathname === '/about' ? 'text-yellow-600 font-semibold' : ''}`}  
            >  
              <span className="relative z-10">About</span>  
              <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
            </Link>  

            {/* Contact Link */}
            <Link 
              to="/contact"  
              className={`${navLinkClass} ${location.pathname === '/contact' ? 'text-yellow-600 font-semibold' : ''}`}  
            >  
              <span className="relative z-10">Contact Us</span>  
              <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
            </Link>  

            {/* Admin Link (only if user is signed in) */}
            {user && (  
              <Link 
                to="/admin"  
                className={`${navLinkClass} ${location.pathname === '/admin' ? 'text-yellow-600 font-semibold' : ''}`}  
              >  
                <span className="relative z-10">Admin</span>  
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
              </Link>  
            )}  
          </nav>  

          {/* Authentication Section (only on desktop) */}
          <div className="hidden md:flex items-center space-x-4">  
            {/* Sign Out button visible only if user is logged in */}
            {user && (  
              <button  
                onClick={handleSignOut}  // Sign out on click
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-300 relative group overflow-hidden"  
              >  
                <LogOut size={18} /> {/* Logout icon */}  
                <span className="relative z-10">Sign Out</span>  
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
              </button>  
            )}  
          </div>  

          {/* Mobile Menu Button (only visible on small screens) */}
          <div className="md:hidden">  
            <button  
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // Toggle menu state
              className="p-2 rounded-lg text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-300"  
            >  
              {/* Show "X" icon if menu open, else "Menu" icon */}
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}  
            </button>  
          </div>  
        </div>  

        {/* Mobile Navigation (only shown if mobileMenuOpen = true) */}
        {mobileMenuOpen && (  
          <div className="md:hidden border-t border-gray-200 py-4">  
            <nav className="flex flex-col space-y-2">  
              
              {/* Mobile Home Link */}
              <Link 
                to="/"  
                className={`${mobileNavLinkClass} ${location.pathname === '/' ? 'text-yellow-600 font-semibold' : ''}`}  
                onClick={() => setMobileMenuOpen(false)} // Close menu after click
              >  
                <span className="relative z-10">Home</span>  
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
              </Link>  

              {/* Mobile Browse Cycles Link */}
              <Link 
                to="/browse-cycles"  
                className={`${mobileNavLinkClass} ${location.pathname === '/browse-cycles' ? 'text-yellow-600 font-semibold' : ''}`}  
                onClick={() => setMobileMenuOpen(false)}  
              >  
                <span className="relative z-10">Browse Cycles</span>  
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
              </Link>  

              {/* Mobile About Link */}
              <Link 
                to="/about"  
                className={`${mobileNavLinkClass} ${location.pathname === '/about' ? 'text-yellow-600 font-semibold' : ''}`}  
                onClick={() => setMobileMenuOpen(false)}  
              >  
                <span className="relative z-10">About</span>  
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
              </Link>  

              {/* Mobile Contact Link */}
              <Link 
                to="/contact"  
                className={`${mobileNavLinkClass} ${location.pathname === '/contact' ? 'text-yellow-600 font-semibold' : ''}`}  
                onClick={() => setMobileMenuOpen(false)}  
              >  
                <span className="relative z-10">Contact Us</span>  
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
              </Link>  

              {/* Mobile Sign Out Button (if user is logged in) */}
              {user && (  
                <button  
                  onClick={() => {  
                    handleSignOut();   // Sign out  
                    setMobileMenuOpen(false); // Close menu after sign out  
                  }}  
                  className={`${mobileNavLinkClass} text-left`}  
                >  
                  <span className="relative z-10">Sign Out</span>  
                  <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>  
                </button>  
              )}  
            </nav>  
          </div>  
        )}  
      </div>  
    </header>  
  );  
};  

// Exporting Header so it can be imported and used in app
export default Header;  
