import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, Home, BookOpen, MessageSquare, Layers, User, Camera, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserContext } from '../Provider/AuthContext';
import axios from 'axios';
import server from '../cofig/config';

const Navbar = () => {
  const { isAuthanticated, user, getAuthUser } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    try {
      axios.post(`${server}user/logout`, {}, { withCredentials: true })
        .then((d) => {
          toast.success('Logged out successfully');
          getAuthUser();
        })
        .catch((e) => {
          console.log(e);
          toast.error('Failed to logout');
        });
    } catch (error) {
      console.log(error);
      toast.error('An error occurred');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getSiteSettings = async () => {
    try {
      const { data } = await axios.get(`${server}site-settings`);
      return data;
    } catch (error) {
      toast.error('Failed to load site settings');
      console.error(error);
      return null;
    }
  };

  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch site settings
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const siteData = await getSiteSettings();
        setMeta(siteData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.nav-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-purple-900 to-gray-900 text-white shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-center items-center h-14">
            <Loader className="w-6 h-6 text-purple-400 animate-spin" />
            <span className="ml-3 font-medium">Loading...</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg py-2' 
        : 'bg-gradient-to-r from-purple-900 to-gray-900 py-3'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            {meta?.iconImage?.url ? (
              <img 
                src={meta.iconImage.url} 
                alt="Logo"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-110" 
              />
            ) : (
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-2 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-110">
                <span className="font-bold text-xl">ACE</span>
              </div>
            )}
            <span className="font-bold text-xl hidden sm:block bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent">
              {meta?.websiteName || "AceTech Institute"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link flex items-center space-x-1 hover:text-purple-300 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full text-purple-50 after:bg-purple-400 after:transition-all">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/courses" className="nav-link flex items-center space-x-1 hover:text-purple-300 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full text-purple-50 after:bg-purple-400 after:transition-all">
              <BookOpen size={18} />
              <span>Courses</span>
            </Link>
            <Link to="/rcourses" className="nav-link flex text-purple-50 items-center space-x-1 hover:text-purple-300 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-purple-400 after:transition-all">
              <Camera size={18} />
              <span>Recorded</span>
            </Link>
            <Link to="/contact" className="nav-link flex text-purple-50 items-center space-x-1 hover:text-purple-300 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-purple-400 after:transition-all">
              <MessageSquare size={18} />
              <span>Contact</span>
            </Link>

            {isAuthanticated && (
              <Link to="/my-learning" className="nav-link text-purple-50 flex items-center space-x-1 hover:text-purple-300 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-purple-400 after:transition-all">
                <Layers size={18} />
                <span>My Learning</span>
              </Link>
            )}

            {isAuthanticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:text-purple-300 transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                    {getInitials(user?.name)}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors group"
                >
                  <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/sign-in" className="px-4 py-2 text-purple-50 rounded bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-700 shadow-md hover:shadow-blue-500/50 transition-all duration-300">
                  Sign In
                </Link>
                <Link to="/sign-up" className="px-4 py-2 rounded border border-purple-500 hover:bg-purple-600 hover:border-purple-600 text-purple-50 shadow-md hover:shadow-purple-500/50 transition-all duration-300">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none bg-purple-800/40 p-2 rounded-lg hover:bg-purple-700/60 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Slide down animation */}
      <div 
        className={`md:hidden nav-menu bg-gray-800/95 backdrop-blur-sm shadow-lg overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-screen py-4 px-6' : 'max-h-0 py-0 px-6'
        }`}
      >
        <div className="flex flex-col space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:text-purple-400 transition-colors p-2 rounded-md hover:bg-gray-700/50"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center space-x-2 hover:text-purple-400 transition-colors p-2 rounded-md hover:bg-gray-700/50"
            onClick={() => setIsMenuOpen(false)}
          >
            <BookOpen size={18} />
            <span>Courses</span>
          </Link>
          <Link
            to="/rcourses"
            className="flex items-center space-x-2 hover:text-purple-400 transition-colors p-2 rounded-md hover:bg-gray-700/50"
            onClick={() => setIsMenuOpen(false)}
          >
            <Camera size={18} />
            <span>Recorded</span>
          </Link>
          <Link
            to="/contact"
            className="flex items-center space-x-2 hover:text-purple-400 transition-colors p-2 rounded-md hover:bg-gray-700/50"
            onClick={() => setIsMenuOpen(false)}
          >
            <MessageSquare size={18} />
            <span>Contact</span>
          </Link>

          {isAuthanticated && (
            <Link
              to="/my-learning"
              className="flex items-center space-x-2 hover:text-purple-400 transition-colors p-2 rounded-md hover:bg-gray-700/50"
              onClick={() => setIsMenuOpen(false)}
            >
              <Layers size={18} />
              <span>My Learning</span>
            </Link>
          )}

          {isAuthanticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:text-purple-400 transition-colors p-2 rounded-md hover:bg-gray-700/50"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {getInitials(user?.name)}
                </div>
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors p-2 rounded-md hover:bg-gray-700/50 w-full text-left"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Link
                to="/sign-in"
                className="px-4 py-3 rounded bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-700 transition-colors text-center font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="px-4 py-3 rounded border border-purple-500 hover:bg-purple-600 hover:border-purple-600 transition-colors text-center font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;