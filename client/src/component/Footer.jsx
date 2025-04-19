import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-purple-600 p-2 rounded-lg">
                <span className="font-bold text-xl">ACE</span>
              </div>
              <span className="font-bold text-xl">AceTech Institute</span>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering the next generation of tech leaders through cutting-edge education and practical skills development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-purple-400 transition-colors">Courses</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-purple-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/sign-in" className="text-gray-300 hover:text-purple-400 transition-colors">Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Courses Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Course Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses/web-development" className="text-gray-300 hover:text-purple-400 transition-colors">Web Development</Link>
              </li>
              <li>
                <Link to="/courses/data-science" className="text-gray-300 hover:text-purple-400 transition-colors">Data Science</Link>
              </li>
              <li>
                <Link to="/courses/mobile-app" className="text-gray-300 hover:text-purple-400 transition-colors">Mobile App Development</Link>
              </li>
              <li>
                <Link to="/courses/cyber-security" className="text-gray-300 hover:text-purple-400 transition-colors">Cyber Security</Link>
              </li>
              <li>
                <Link to="/courses/ai-ml" className="text-gray-300 hover:text-purple-400 transition-colors">AI & Machine Learning</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Tech Avenue, Silicon Valley, CA 90210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">info@acetech-institute.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} AceTech Institute. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/faq" className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;