// Importing React to use JSX and build the component
import React from "react";  

// Importing Link from react-router-dom for navigation inside the app (no page reload)
import { Link } from "react-router-dom";  

// Importing icons from lucide-react library
import { Instagram, Mail, Phone, MapPin, Linkedin } from "lucide-react";  

// Importing logo image from assets
import logo from "../../assets/logo.webp";  

// Defining the Footer functional component
const Footer = () => {  
  // Getting the current year dynamically for copyright
  const currentYear = new Date().getFullYear();  

  // List of quick navigation links shown in footer
  const quickLinks = [  
    { name: "Home", path: "/" },                 // Home page link
    { name: "Browse Cycles", path: "/browse-cycles" }, // Browse cycles page link
    { name: "About Us", path: "/about" },        // About page link
    { name: "Contact", path: "/contact" },       // Contact page link
  ];  

  // Contact details (address, phone, email) with respective icons
  const contactDetails = [  
    {
      icon: <MapPin size={16} className="text-gray-600" />, // Location icon
      content: ( // Location text content
        <>
          RECycle Shed <br />  
          Adj. of LOGOS Lecture Hall Complex  
        </>
      ),
    },
    {
      icon: <Phone size={16} className="text-gray-600" />, // Phone icon
      content: ( // Phone numbers list
        <div className="flex flex-col">  
          <span>+91 96778 52057 (Thilak S)</span>  
          <span>+91 94999 20831 (Steve Fredrick)</span>  
        </div>
      ),
    },
    {
      icon: <Mail size={16} className="text-gray-600" />, // Mail icon
      content: "recycle.taskforce.nitt26@gmail.com", // Email address
    },
  ];  

  // Social media links with icons (LinkedIn, Instagram)
  const socialLinks = [  
    {
      href: "https://www.linkedin.com/company/taskforce-nittrichy/", // LinkedIn URL
      icon: ( // LinkedIn icon
        <Linkedin  
          size={18}  
          className="group-hover:scale-110 transition-transform duration-200" // Hover animation
        />
      ),
    },
    {
      href: "https://www.instagram.com/taskforce_nitt/", // Instagram URL
      icon: ( // Instagram icon
        <Instagram  
          size={18}  
          className="group-hover:scale-110 transition-transform duration-200" // Hover animation
        />
      ),
    },
  ];  

  // Returning JSX for footer component
  return (  
    // Footer element with white background and top border
    <footer className="bg-white border-t border-gray-200">  
      {/* Outer container with padding and max width for layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">  
        
        {/* Grid layout: 1 col on mobile, 4 cols on md+ screens */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">  
          
          {/* Club Info Section (spans 2 cols on desktop) */}
          <div className="col-span-1 md:col-span-2">  
            
            {/* Logo and Title row */}
            <div className="flex items-center space-x-3 mb-6">  
              {/* Logo image */}
              <img  
                src={logo} // Logo path
                alt="Taskforce RECycle Logo" // Alt text for accessibility
                className="w-10 h-10 object-contain" // Fixed size logo
              />  
              <div>  
                {/* Club name */}
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">  
                  TaskForce RECycle  
                </h2>  
                {/* Small tagline below */}
                <span className="text-xs text-gray-600 font-medium tracking-wider">  
                  MARKET PLACE  
                </span>  
              </div>  
            </div>  

            {/* Club description paragraph */}
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">  
              We at Taskforce RECycle breathe new life into old bicycles and
              rent them out to incoming first-years. Whether you're heading to
              class or exploring campus, our cycles are a sustainable and
              affordable way to get moving from day one.  
            </p>  

            {/* Social media icons row */}
            <div className="flex space-x-3">  
              {/* Mapping through socialLinks array */}
              {socialLinks.map((link, idx) => (  
                <a  
                  key={idx} // Unique key for React
                  href={link.href} // Social media link URL
                  target="_blank" // Open in new tab
                  rel="noopener noreferrer" // Security measure for new tab
                  className="inline-block"  
                >  
                  {/* Button around icon */}
                  <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 hover:text-gray-900 transition-all duration-300 group flex items-center">  
                    {link.icon} {/* Display icon */}  
                  </button>  
                </a>  
              ))}  
            </div>  
          </div>  

          {/* Quick Links Section */}
          <div>  
            <h3 className="text-lg font-semibold mb-4 text-gray-900">  
              Quick Links  
            </h3>  
            <ul className="space-y-3">  
              {/* Mapping through quickLinks array */}
              {quickLinks.map((link, idx) => (  
                <li key={idx}>  
                  {/* React Router Link for navigation */}
                  <Link  
                    to={link.path} // Path to navigate
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:pl-1 transition-all" // Hover effects
                  >  
                    {link.name} {/* Link text */}  
                  </Link>  
                </li>  
              ))}  
            </ul>  
          </div>  

          {/* Contact Info Section */}
          <div>  
            <h3 className="text-lg font-semibold mb-4 text-gray-900">  
              Contact Info  
            </h3>  
            <ul className="space-y-3">  
              {/* Mapping through contactDetails array */}
              {contactDetails.map((detail, idx) => (  
                <li  
                  key={idx} // Unique key
                  className="flex items-start space-x-3 text-sm text-gray-600" // Layout styles
                >  
                  {/* Icon container */}
                  <div className="p-2 bg-gray-100 rounded-lg">  
                    {detail.icon} {/* Icon */}  
                  </div>  
                  {/* Contact text */}
                  <div>{detail.content}</div>  
                </li>  
              ))}  
            </ul>  
          </div>  
        </div>  

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6">  
          <div className="flex flex-col md:flex-row justify-between items-center">  
            {/* Dynamic copyright */}
            <p className="text-gray-600 text-sm">  
              {currentYear} TaskForce RECycle Marketplace. All rights reserved.  
            </p>  
          </div>  
        </div>  
      </div>  
    </footer>  
  );  
};  

// Exporting Footer so it can be imported in other components/pages
export default Footer;  
