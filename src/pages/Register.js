// Import React and hooks
import React, { useState } from 'react';
// Import router helpers for navigation and links
import { Link, useNavigate } from 'react-router-dom';
// Import custom Auth context for signup
import { useAuth } from '../contexts/AuthContext';
// Import icons from lucide-react for UI
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
// Import custom inline loader for loading state
import { InlineLoader } from '../components/SimpleLoaders';
// Import background image
import HomepageBG from '../assets/HomepageBG.webp';

const Register = () => {
  // State variables for form fields
  const [email, setEmail] = useState(''); // user email
  const [password, setPassword] = useState(''); // password
  const [confirmPassword, setConfirmPassword] = useState(''); // confirm password
  const [secretCode, setSecretCode] = useState(''); // admin secret code
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // toggle confirm password visibility
  const [loading, setLoading] = useState(false); // loading state during signup
  const [error, setError] = useState(''); // error messages
  const [success, setSuccess] = useState(''); // success messages
  
  const { signUp } = useAuth(); // get signup function from Auth context
  const navigate = useNavigate(); // navigation hook

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default page reload
    setLoading(true); // set loading state
    setError(''); // reset error
    setSuccess(''); // reset success message

    // Passwords must match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Password length check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Check admin secret code (fallback: "admin123")
    const adminSecretCode = process.env.REACT_APP_ADMIN_SECRET_CODE || 'admin123';
    if (secretCode !== adminSecretCode) {
      setError('Invalid admin secret code');
      setLoading(false);
      return;
    }

    // Try creating new user
    try {
      const { error } = await signUp(email, password); // call signUp function
      if (error) {
        setError(error.message); // show backend error if any
      } else {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        // Redirect to login after 3s
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred'); // catch any unexpected error
    } finally {
      setLoading(false); // stop loading regardless of outcome
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      {/* Background image */}
      <img src={HomepageBG} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80 z-0" />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* Header section */}
      <div className="relative z-20 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo placeholder */}
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">CM</span>
          </div>
        </div>
        {/* Title */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-yellow-400">
          Create Admin Account
        </h2>
        {/* Subtitle */}
        <p className="mt-2 text-center text-sm text-gray-200">
          Register to access the admin dashboard
        </p>
      </div>

      {/* Form container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/20 backdrop-blur-lg py-8 px-4 shadow rounded-lg border border-yellow-400 sm:px-10">
          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-yellow-200">
                Email address
              </label>
              <div className="mt-1 relative">
                {/* Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-yellow-300" />
                </div>
                {/* Input */}
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-yellow-400 rounded-md placeholder-yellow-200 bg-transparent focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-yellow-200">
                Password
              </label>
              <div className="mt-1 relative">
                {/* Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-yellow-300" />
                </div>
                {/* Input */}
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'} // toggle input type
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-yellow-400 rounded-md placeholder-yellow-200 bg-transparent focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                {/* Show/Hide button */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-yellow-400 hover:text-yellow-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-yellow-200">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                {/* Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-yellow-300" />
                </div>
                {/* Input */}
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-yellow-400 rounded-md placeholder-yellow-200 bg-transparent focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
                {/* Show/Hide button */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-yellow-400 hover:text-yellow-300 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Admin secret code field */}
            <div>
              <label htmlFor="secretCode" className="block text-sm font-medium text-yellow-200">
                Admin Secret Code
              </label>
              <div className="mt-1 relative">
                {/* Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-yellow-300" />
                </div>
                {/* Input */}
                <input
                  id="secretCode"
                  name="secretCode"
                  type="password"
                  required
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-yellow-400 rounded-md placeholder-yellow-200 bg-transparent focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  placeholder="Enter admin secret code"
                />
              </div>
              {/* Hint text */}
              <p className="mt-1 text-xs text-gray-200">
                Contact administrator for the secret code
              </p>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <InlineLoader message="Creating account..." textColor="text-black" />
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-200">Already have an account?</span>
              </div>
            </div>

            {/* Login link */}
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-yellow-400 rounded-md shadow-sm text-sm font-medium text-yellow-200 bg-transparent hover:bg-yellow-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Sign in instead
              </Link>
            </div>
          </div>

          {/* Back to marketplace link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-yellow-400 hover:text-yellow-300"
            >
              ← Back to marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
