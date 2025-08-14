import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import IntroOverlay from './components/IntroOverlay';
import LaunchPage from './pages/LaunchPage';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Cycles from './pages/Cycles';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PurchaseHistory from './pages/PurchaseHistory';
import AdminDashboard from './pages/admin/AdminDashboard';

// Assets
import HomepageBG from './assets/HomepageBG.png';

// Simple pages
const About = () => (
  <section className="relative py-24 lg:py-32 overflow-hidden min-h-screen">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img
        src={HomepageBG}
        alt="About Us Background"
        className="w-full h-full object-cover fixed top-0 left-0 z-[-1]"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">About Cycle Marketplace</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg mb-6">
        Taskforce RECycle is a student-led initiative from <b>TaskForce NIT Trichy</b>, the social initiatives hub of our college. With strong support from the administration, we aim to promote sustainability while making student life easier one cycle at a time.<br />
        <br />
        We refurbish old bicycles and offer them to incoming first-year students on a rental basis, giving unused cycles a second life and reducing campus waste. What started as a simple idea has now grown into a movement with <b>100+ cycles</b> refurbished each year and counting. <br />
        <br />
        On this <b>10th year of operation</b>, we are proud to have made a significant impact on the campus community and look forward to continuing our mission of promoting sustainability and making student life easier one cycle at a time.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-6">
        To make mobility on campus eco-friendly, affordable, and accessible for every student.

        </p>
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-2 text-left mx-auto inline-block">
          <li>Affordable rentals designed with students in mind</li>
          <li>Eco-friendly alternative that reduces waste</li>
          <li>Reliable refurbished cycles for everyday use</li>
          <li>Convenient hold feature for decision making</li>
          <li>Student-run with admin support for smooth operations</li>
          <li>Trusted by hundreds of first-years every year</li>
        </ul>
      </div>
    </div>
  </section>
);



function App() {
  const [showIntro, setShowIntro] = useState(true);
  
  // Close intro
  const handleCloseIntro = () => {
    setShowIntro(false);
    localStorage.setItem('introEnabled', 'false');
  };

  // Handle entering the site from launch page
  const handleEnterSite = () => {
    setShowIntro(true);
    localStorage.setItem('introEnabled', 'false');
  };

  // Initialize the app
  useEffect(() => {
    // Skip intro for admin routes
    if (window.location.pathname.startsWith('/admin')) {
      setShowIntro(false);
      return;
    }

    // Check if intro was already shown
    const introShown = localStorage.getItem('introEnabled') === 'false';
    
    if (introShown) {
      setShowIntro(false);
    } else {
      // Auto-close intro after 4.1 seconds
      const timer = setTimeout(() => {
        setShowIntro(false);
        localStorage.setItem('introEnabled', 'false');
      }, 4100);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Show launch page if intro is enabled and user hasn't entered yet
  const showLaunchPage = localStorage.getItem('introEnabled') === 'true' && 
                        !window.location.pathname.startsWith('/admin');
  
  if (showLaunchPage) {
    return <LaunchPage onEnter={handleEnterSite} />;
  }
  return (
    <AuthProvider>
      <Router>
        <div className="App"> 
          {showIntro && <IntroOverlay onClose={handleCloseIntro} />}
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse-cycles" element={<Cycles />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/purchase-history" element={
                <ProtectedRoute>
                  <PurchaseHistory />
                </ProtectedRoute>
              } />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;