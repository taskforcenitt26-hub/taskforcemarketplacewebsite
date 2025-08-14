import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import logo from '../../assets/billlogo.png';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinkClass = `px-4 py-2 text-gray-600 hover:text-yellow-600 rounded-lg transition-all duration-300 font-medium relative group overflow-hidden`;
  
  const mobileNavLinkClass = `px-4 py-3 text-gray-600 hover:text-yellow-600 rounded-lg transition-all duration-300 font-medium relative group overflow-hidden`;

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-16 h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="Taskforce RECycle Logo" className="w-14 h-14 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Taskforce RECycle</span>
              <span className="text-xs text-gray-600 font-medium tracking-wider">MARKET PLACE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Link 
              to="/" 
              className={`${navLinkClass} ${location.pathname === '/' ? 'text-yellow-600 font-semibold' : ''}`}
            >
              <span className="relative z-10">Home</span>
              <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
            </Link>

            {user && (
              <Link 
                to="/purchase-history" 
                className={`${navLinkClass} ${location.pathname === '/purchase-history' ? 'text-yellow-600 font-semibold' : ''}`}
              >
                <span className="relative z-10">My Orders</span>
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
              </Link>
            )}
            <Link 
              to="/browse-cycles" 
              className={`${navLinkClass} ${location.pathname === '/browse-cycles' ? 'text-yellow-600 font-semibold' : ''}`}
            >
              <span className="relative z-10">Browse Cycles</span>
              <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
            </Link>
            <Link 
              to="/about" 
              className={`${navLinkClass} ${location.pathname === '/about' ? 'text-yellow-600 font-semibold' : ''}`}
            >
              <span className="relative z-10">About</span>
              <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
            </Link>
            <Link 
              to="/contact" 
              className={`${navLinkClass} ${location.pathname === '/contact' ? 'text-yellow-600 font-semibold' : ''}`}
            >
              <span className="relative z-10">Contact Us</span>
              <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
            </Link>
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

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-300 relative group overflow-hidden"
              >
                <LogOut size={18} />
                <span className="relative z-10">Sign Out</span>
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`${mobileNavLinkClass} ${location.pathname === '/' ? 'text-yellow-600 font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Home</span>
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
              </Link>
              <Link 
                to="/browse-cycles" 
                className={`${mobileNavLinkClass} ${location.pathname === '/browse-cycles' ? 'text-yellow-600 font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Browse Cycles</span>
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
              </Link>
              <Link 
                to="/about" 
                className={`${mobileNavLinkClass} ${location.pathname === '/about' ? 'text-yellow-600 font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">About</span>
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
              </Link>
              <Link 
                to="/contact" 
                className={`${mobileNavLinkClass} ${location.pathname === '/contact' ? 'text-yellow-600 font-semibold' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Contact Us</span>
                <span className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 rounded-lg group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] group-hover:shadow-yellow-400/50"></span>
              </Link>

              {user && (
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
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

export default Header;