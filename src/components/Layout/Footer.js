import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import logo from '../../assets/billlogo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={logo} alt="Taskforce RECycle Logo" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-gray-900">TaskForce RECycle</span>
                <span className="text-xs text-gray-600 font-medium tracking-wider">MARKET PLACE</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              We at Taskforce RECycle breathe new life into old bicycles and rent them out to incoming first-years. 
              Whether you're heading to class or exploring campus, our cycles are a sustainable and affordable way to get moving from day one.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.linkedin.com/company/taskforce-nittrichy/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 hover:text-gray-900 transition-all duration-300 group flex items-center">
                  <Linkedin size={18} className="group-hover:scale-110 transition-transform duration-200" />
                </button>
              </a>

              <a 
                href="https://www.instagram.com/taskforce_nitt/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 hover:text-gray-900 transition-all duration-300 group">
                  <Instagram size={18} className="group-hover:scale-110 transition-transform duration-200" />
                </button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:pl-1 transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse-cycles" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:pl-1 transition-all">
                  Browse Cycles
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:pl-1 transition-all">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:pl-1 transition-all">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin size={16} className="text-gray-600" />
                </div>
                <span className="text-gray-600 text-sm leading-relaxed">
                  RECycle Shed<br />
                  Opp. of LOGOS Lecture Hall Complex<br /></span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone size={16} className="text-gray-600" />
                </div>
                <div className="flex flex-col text-sm">
                  <span className="text-gray-600">+91 63829 14862</span>
                  <span className="text-gray-600">+91 91553 80969</span>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail size={16} className="text-gray-600" />
                </div>
                <span className="text-gray-600 text-sm">recycle.taskforce.nitt26@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} TaskForce REcycle Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;