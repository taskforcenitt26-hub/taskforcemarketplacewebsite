import React from 'react'; /* Imports the React library to use JSX and React features. */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; /* Imports React Router components for navigation: Router for wrapping the app, Routes for defining route groups, and Route for individual pages. */
import { AuthProvider } from './contexts/AuthContext'; /* Imports a custom context provider for authentication state across the app. */

// Layout
import Header from './components/Layout/Header'; /* Imports the Header layout component, displayed at the top of the app. */
import Footer from './components/Layout/Footer'; /* Imports the Footer layout component, displayed at the bottom of the app. */
import ScrollUp from './components/ScrollUp'; /* Imports a utility component to automatically scroll to the top on navigation. */

// Routes
import ProtectedRoute from './components/ProtectedRoute'; /* Imports a wrapper for routes that require authentication, blocking unauthorized access. */
import Home from './pages/Home'; /* Imports the Home page component for the root ("/") route. */
import Cycles from './pages/Cycles'; /* Imports the Cycles page component, likely for browsing or listing cycles. */
import Contact from './pages/Contact'; /* Imports the Contact page component. */
import Login from './pages/Login'; /* Imports the Login page component for user authentication. */
import Payment from './pages/Payment'; /* Imports the Payment page component to handle transactions. */
import PaymentSuccess from './pages/PaymentSuccess'; /* Imports the page shown when a payment is successful. */
import PaymentProcessing from './pages/PaymentProcessing'; /* Imports the page shown while payment is still being processed. */
import AdminDashboard from './pages/admin/AdminDashboard'; /* Imports the Admin Dashboard page component, accessible to admins only. */
import About from './pages/About'; /* Imports the About page component, likely describing the app or company. */
import DownloadBill from './pages/DownloadBill'; /* Page to download bill by order + phone */

/* ===============================
   Main App
================================ */ /* Section header for clarity. */
function App() { /* Defines the main App component which acts as the entry point for the UI. */
  return (
    <AuthProvider> {/* Wraps the app in AuthProvider to give all child components access to authentication state and functions. */}
      <Router> {/* Wraps the app with React Router's Router to enable client-side navigation. */}
        <ScrollUp /> {/* Ensures each route change scrolls to the top of the page. */}
        <div className="App"> {/* Main container with a className for styling. */}
          <Header /> {/* Renders the Header component at the top of the app. */}
          <main> {/* Semantic HTML tag for the main content area of the page. */}
            <Routes> {/* Defines all available routes for navigation. */}
              <Route path="/" element={<Home />} /> {/* Defines the root route ("/") which renders the Home page. */}
              <Route path="/browse-cycles" element={<Cycles />} /> {/* Route for browsing cycles, rendering the Cycles page. */}
              <Route path="/about" element={<About />} /> {/* Route for the About page. */}
              <Route path="/contact" element={<Contact />} /> {/* Route for the Contact page. */}
              <Route
                path="/admin" /* Path for admin dashboard access. */
                element={
                  <ProtectedRoute> {/* Wraps AdminDashboard with ProtectedRoute to restrict access only to authenticated users. */}
                    <AdminDashboard /> {/* Component shown if authentication passes. */}
                  </ProtectedRoute>
                }
              />
              <Route path="/payment" element={<Payment />} /> {/* Route for the Payment page. */}
              <Route path="/payment-success" element={<PaymentSuccess />} /> {/* Route for the Payment Success page. */}
              <Route path="/payment-processing" element={<PaymentProcessing />} /> {/* Route for the Payment Processing page. */}
              <Route path="/login" element={<Login />} /> {/* Route for the Login page. */}
              <Route path="/download-bill" element={<DownloadBill />} /> {/* Route for Bill download */}
            </Routes>
          </main>
          <Footer /> {/* Renders the Footer component at the bottom of the app. */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; /* Exports the App component as the default export so it can be used in index.js or elsewhere. */
