import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, Home, BookOpen, MessageSquare, Layers, User, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserContext } from '../Provider/AuthContext';
import axios from 'axios';
import server from '../cofig/config';

const Navbar = () => {
  const { isAuthanticated, user,getAuthUser } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(user)
  
  const handleLogout = () => {
    try {
        axios.post(`${server}user/logout`,{},{withCredentials:true}).then((d)=>{
            toast.success('Logged out successfully');

            getAuthUser()
        }).catch((e)=>{
            console.log(e)
        })
    } catch (error) {
        console.log(error)
    }
  };

  const getInitials = (name) => {
    console.log(name)
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

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

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-purple-600 p-2 rounded-lg">
              <span className="font-bold text-xl">ACE</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">AceTech Institute</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-purple-400 transition-colors">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/courses" className="flex items-center space-x-1 hover:text-purple-400 transition-colors">
              <BookOpen size={18} />
              <span>Courses</span>
            </Link><Link to="/rcourses" className="flex items-center space-x-1 hover:text-purple-400 transition-colors">
              <Camera size={18} />
              <span>Recorded</span>
            </Link>
            <Link to="/contact" className="flex items-center space-x-1 hover:text-purple-400 transition-colors">
              <MessageSquare size={18} />
              <span>Contact</span>
            </Link>
            
            {isAuthanticated && (
              <Link to="/my-learning" className="flex items-center space-x-1 hover:text-purple-400 transition-colors">
                <Layers size={18} />
                <span>My Learning</span>
              </Link>
            )}

            {isAuthanticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:text-purple-400 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {getInitials(user?.name)}
                  </div>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/sign-in" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors">
                  Sign In
                </Link>
                <Link to="/sign-up" className="px-4 py-2 rounded border border-purple-500 hover:bg-purple-600 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden nav-menu bg-gray-800 py-4 px-6 shadow-inner">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/courses" 
              className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={18} />
              <span>Courses</span>
            </Link><Link 
              to="/rcourses" 
              className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen size={18} />
              <span>Recorded</span>
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageSquare size={18} />
              <span>Contact</span>
            </Link>
            
            {isAuthanticated && (
              <Link 
                to="/my-learning" 
                className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
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
                  className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {getInitials(user?.name)}
                  </div>
                  <span>Profile</span>
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }} 
                  className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link 
                  to="/sign-in" 
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up" 
                  className="px-4 py-2 rounded border border-purple-500 hover:bg-purple-600 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;