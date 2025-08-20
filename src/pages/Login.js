// Import React and useState hook
import React, { useState } from 'react';

// Import Link for navigation and useNavigate for programmatic redirects
import { Link, useNavigate } from 'react-router-dom';

// Import custom authentication context (provides login function)
import { useAuth } from '../contexts/AuthContext';

// Import icons from lucide-react
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Import custom hook to set page title dynamically
import usePageTitle from '../hooks/usePageTitle';

// Import loader component for showing loading state
import { InlineLoader } from '../components/SimpleLoaders';

// Import assets (background + logo)
import HomepageBG from '../assets/HomepageBG.webp';
import Logo from '../assets/logo.webp';


// Define Login component
const Login = () => {
  // Set browser tab title
  usePageTitle('Login');
  
  // State to hold email input
  const [email, setEmail] = useState('');

  // State to hold password input
  const [password, setPassword] = useState('');

  // Toggle for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // Loading state (for disabling form while signing in)
  const [loading, setLoading] = useState(false);

  // State for showing error messages
  const [error, setError] = useState('');
  
  // Get signIn function from AuthContext
  const { signIn } = useAuth();

  // React Router hook for navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default page reload on form submit
    setLoading(true);   // Show loading spinner
    setError('');       // Clear old error message

    try {
      // Attempt to sign in using AuthContext
      const { error } = await signIn(email, password);

      // If backend returns error → display it
      if (error) {
        setError(error.message);
      } else {
        // On success → redirect to admin dashboard
        navigate('/admin');
      }
    } catch (err) {
      // Handle unexpected errors
      setError('An unexpected error occurred');
    } finally {
      // Always stop loading spinner after request
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      {/* Background image (full page) */}
      <img 
        src={HomepageBG} 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-100 z-0" 
      />

      {/* Dark overlay to improve contrast */}
      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />

      {/* Logo + Heading section */}
      <div className="relative z-20 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo image */}
        <div className="flex justify-center">
          <img 
            src={Logo} 
            alt="NITT Logo" 
            className="w-24 h-24 md:w-28 md:h-28 object-contain" 
          />
        </div>
        {/* Title */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#FFD400] filter drop-shadow-[0_0_8px_rgba(255,212,0,0.55)]">
          Admin Login
        </h2>
        {/* Subtitle */}
        <p className="mt-2 text-center text-sm text-gray-200">
          Sign in to access the admin dashboard
        </p>
      </div>

      {/* Login Form Section */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-transparent py-8 px-4 shadow-xl rounded-2xl border border-[#FFD400] sm:px-10">
          
          {/* Form starts here */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Show error if login fails */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-base font-extrabold text-[#FFD400] tracking-wide filter drop-shadow-[0_0_6px_rgba(255,212,0,0.5)]"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                {/* Email icon inside input */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#FFD400] filter drop-shadow-[0_0_6px_rgba(255,212,0,0.5)]" />
                </div>
                {/* Email input box */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update state
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-[#FFD400] rounded-xl placeholder-[#FFD400]/60 text-white caret-[#FFD400] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] sm:text-sm transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-base font-extrabold text-[#FFD400] tracking-wide filter drop-shadow-[0_0_6px_rgba(255,212,0,0.5)]"
              >
                Password
              </label>
              <div className="mt-1 relative">
                {/* Lock icon inside input */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#FFD400] filter drop-shadow-[0_0_6px_rgba(255,212,0,0.5)]" />
                </div>
                {/* Password input box */}
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'} // Toggle between text/password
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Update state
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-[#FFD400] rounded-xl placeholder-[#FFD400]/60 text-white caret-[#FFD400] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-[#FFD400] sm:text-sm transition-all duration-200"
                  placeholder="Enter your password"
                />
                {/* Eye/EyeOff icon button for toggling password visibility */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#FFD400] hover:opacity-90 focus:outline-none"
                  >
                    {showPassword 
                      ? <EyeOff className="h-5 w-5 text-[#FFD400]" /> 
                      : <Eye className="h-5 w-5 text-[#FFD400]" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="mt-8 relative z-50">
              <button
                type="submit"
                disabled={loading} // Disable while signing in
                className="block w-full h-12 px-6 rounded-xl text-base md:text-lg font-extrabold text-black bg-yellow-500 hover:bg-yellow-600 border-2 border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-500/60 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_8px_24px_rgba(255,212,0,0.5)]"
                aria-label="Sign in"
              >
                {/* Show loader while signing in */}
                {loading ? (
                  <InlineLoader message="Signing in..." textColor="text-black" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Back to marketplace link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-[#FFD400] hover:text-[#FFD400]/90"
              >
                ← Back to marketplace
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Export component
export default Login;
