// Importing React and useState hook for managing local state
import React, { useState } from "react";

// Importing icons from lucide-react library
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

// Custom hook to set page title dynamically
import usePageTitle from "../hooks/usePageTitle";

// Custom hook that provides contact-related logic (API calls, etc.)
import { useContacts } from "../hooks/useContacts";

// Loader component for showing spinner/loading state
import { InlineLoader } from "../components/SimpleLoaders";

// Background image for the Contact page
import HomepageBG from "../assets/HomepageBG.webp";

// Main Contact component
const Contact = () => {
  // Set page title when this component is mounted
  usePageTitle("Contact Us");

  // Destructure submitContact function from useContacts hook
  const { submitContact } = useContacts();

  // Form data state to capture user inputs
  const [formData, setFormData] = useState({
    name: "", // Full name
    email: "", // Email address
    phone: "", // Phone number
    provisionalAllotmentNumber: "", // Allotment number
    message: "", // Message text
  });

  // State for managing loading spinner when submitting form
  const [loading, setLoading] = useState(false);

  // State to check if form was successfully submitted
  const [submitted, setSubmitted] = useState(false);

  // State for handling and displaying error messages
  const [error, setError] = useState("");

  // Static store hours data
  const storeHours = [
    { date: "21/08 - Thursday", time: "10:00 AM - 5:00 PM" },
    { date: "22/08 - Friday", time: "10:00 AM - 5:00 PM" },
    { date: "23/08 - Saturday", time: "10:00 AM - 5:00 PM" },
  ];

  // Contact information data (address, phone, email, hours)
  const contactInfo = [
    {
      icon: <MapPin size={24} className="text-yellow-600" />, // Location icon
      title: "Visit Our Store",
      details: (
        <>
          RECycle Shed <br />
          Adj. of LOGOS Lecture Hall Complex <br />
          National Institute of Technology, Tiruchirappalli
        </>
      ),
    },
    {
      icon: <Phone size={24} className="text-yellow-600" />, // Phone icon
      title: "Call Us",
      details: (
        <>
          <p>+91 96778 52057 (Thilak S)</p>
          <p>+91 94999 20831 (Steve Fredrick)</p>
        </>
      ),
    },
    {
      icon: <Mail size={24} className="text-yellow-600" />, // Email icon
      title: "Email Us",
      details: "recycle.taskforce.nitt26@gmail.com",
    },
    {
      icon: <Clock size={24} className="text-yellow-600" />, // Clock icon
      title: "Store Hours",
      details: (
        <div className="space-y-1">
          {storeHours.map((item, i) => (
            <p key={i}>
              {item.date}: {item.time}
            </p>
          ))}
        </div>
      ),
    },
  ];

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Extract name and value from input
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update only the changed field
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on submit
    setLoading(true); // Show loading spinner
    setError(""); // Reset error before validation

    // Check if any field is empty
    const isInvalid = Object.values(formData).some((field) => !field.trim());
    if (isInvalid) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Call submitContact API with mapped formData
    const result = await submitContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      allotment_number: formData.provisionalAllotmentNumber,
      message: formData.message,
    });

    // If successful, reset form and show success screen
    if (result.success) {
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        provisionalAllotmentNumber: "",
        message: "",
      });
    } else {
      // If failed, display error message
      setError(result.error || "Failed to send message. Please try again.");
    }

    setLoading(false); // Stop loading spinner
  };

  // If message is successfully submitted, show success confirmation screen
  if (submitted) {
    return (
      <section className="relative min-h-screen flex flex-col justify-center py-8">
        {/* Background */}
        <BackgroundImage />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            {/* Success icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            {/* Success message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Message Sent Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for contacting us. We'll get back to you within 24
              hours.
            </p>
            {/* Button to reset form and send another message */}
            <button
              onClick={() => setSubmitted(false)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Default contact form view
  return (
    <section className="relative min-h-screen flex flex-col justify-center py-8">
      {/* Background */}
      <BackgroundImage />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact The
            <span className="block text-yellow-400">RECycle Team</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Have questions about our bicycles or need to contact RECycle
            Helpline? <br />
            We're here to help you.
          </p>
        </div>

        {/* Grid with Contact Info (left) and Form (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Our Information
            </h2>
            <div className="space-y-6">
              {contactInfo.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  {/* Icon container */}
                  <div className="p-3 bg-yellow-100 rounded-xl">{item.icon}</div>
                  {/* Text content */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <div className="text-gray-600 leading-relaxed">
                      {item.details}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Send us a Message
            </h2>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
              {/* Name & Email inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
                <FormInput
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Phone & Allotment number inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  type="tel"
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
                <FormInput
                  label="Provisional Allotment Number"
                  name="provisionalAllotmentNumber"
                  value={formData.provisionalAllotmentNumber}
                  onChange={handleInputChange}
                  placeholder="Your Allotment Number"
                  required
                />
              </div>

              {/* Message textarea */}
              <FormTextarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                required
              />

              {/* Submit button with loading state */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <InlineLoader message="Sending..." textColor="text-white" />
                ) : (
                  <>
                    <Send size={20} className="text-yellow-600" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Background Image Component */
const BackgroundImage = () => (
  <div className="absolute inset-0">
    <img
      src={HomepageBG}
      alt="Contact Us Background"
      className="w-full h-full object-cover fixed top-0 left-0 z-[-1]"
    />
    {/* Dark overlay to improve text visibility */}
    <div className="absolute inset-0 bg-black bg-opacity-60" />
  </div>
);

/** Input Field Component */
const FormInput = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>
    {/* Label */}
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {/* Input */}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

/** Textarea Component */
const FormTextarea = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    {/* Label */}
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {/* Textarea */}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 resize-none"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default Contact;
