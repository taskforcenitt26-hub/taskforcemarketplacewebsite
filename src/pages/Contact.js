import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import { useContacts } from '../hooks/useContacts';
import { InlineLoader } from '../components/SimpleLoaders';
import HomepageBG from '../assets/HomepageBG.png';

const Contact = () => {
  usePageTitle('Contact Us');
  
  const { submitContact } = useContacts();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.rollNumber.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const result = await submitContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.rollNumber, // temporarily store roll number in subject column
      message: formData.message
    });
    
    if (result.success) {
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        rollNumber: '',
        message: ''
      });
    } else {
      setError(result.error || 'Failed to send message. Please try again.');
    }
    
    setLoading(false);
  };

  if (submitted) {
    return (
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-8">
        <div className="absolute inset-0">
          <img src={HomepageBG} alt="Contact Us Background" className="w-full h-full object-cover fixed top-0 left-0 z-[-1]" />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for contacting us. We've received your message and will get back to you within 24 hours.
            </p>
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

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-8">
      <div className="absolute inset-0">
        <img src={HomepageBG} alt="Contact Us Background" className="w-full h-full object-cover fixed top-0 left-0 z-[-1]" />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-200 rounded-full text-sm font-semibold tracking-wide uppercase mb-4 backdrop-blur-sm border border-yellow-400/30">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact The
            <span className="block text-yellow-400">RECycle Team</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Have questions about our bicycles or need to contact RECycle Helpline? <br/>
            We're here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Contact Information */}
          <div className="space-y-8 h-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <MapPin size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Our Store</h3>
                    <p className="text-gray-600 leading-relaxed">
                      RECycle Shed<br />
                      Opp. of LOGOS Lecture Hall Complex<br />
                      National Institute of Technology,Tiruchirappalli
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Phone size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+91 63829 14862</p>
                    <p className="text-gray-600">+91 91553 80969</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Mail size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">recycle.taskforce.nitt26@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Store Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>20/08 - Wednesday: 9:00 AM - 6:00 PM</p>
                      <p>21/08 - Thursday: 9:00 AM - 6:00 PM</p>
                      <p>22/08 - Friday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Provisional Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g. 2025BCS0001"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

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

export default Contact;