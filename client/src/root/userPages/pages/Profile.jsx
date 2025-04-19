import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, Mail, Phone, BookOpen, LogOut, Clock,
  ChevronRight, Award, Calendar, Loader, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock course data for "My Courses" section
const mockCourses = [
  {
    id: 1,
    title: "Complete JavaScript Masterclass",
    progress: 45,
    completedLectures: 22,
    totalLectures: 48,
    lastAccessed: "2025-04-15T10:30:00Z",
    image: "/api/placeholder/100/100"
  },
  {
    id: 2,
    title: "Data Science with Python",
    progress: 68,
    completedLectures: 42,
    totalLectures: 62,
    lastAccessed: "2025-04-17T15:45:00Z",
    image: "/api/placeholder/100/100"
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    progress: 20,
    completedLectures: 7,
    totalLectures: 36,
    lastAccessed: "2025-04-16T08:15:00Z",
    image: "/api/placeholder/100/100"
  }
];

// Course Card Component
const CourseCard = ({ course }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-800 mb-1">{course.title}</h3>
            <div className="flex items-center mb-3">
              <Clock size={14} className="text-purple-700 mr-1" />
              <span className="text-xs text-gray-500">Last accessed: {formatDate(course.lastAccessed)}</span>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-700 h-2 rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {course.completedLectures}/{course.totalLectures} lectures
              </span>
              <button className="text-purple-700 flex items-center text-sm hover:underline">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// User Stats Card
const UserStatsCard = ({ icon, title, value }) => {
  const Icon = icon;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center">
        <div className="mr-3 bg-purple-100 p-3 rounded-full">
          <Icon size={20} className="text-purple-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Error State Component
const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-red-500 mb-4">
        <AlertCircle size={48} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load profile</h3>
      <p className="text-gray-600 mb-4 text-center">{message}</p>
      <button 
        onClick={onRetry}
        className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
      >
        Try Again
      </button>
    </div>
  );
};

// Loading State Component
const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader className="h-12 w-12 text-purple-700 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading profile...</p>
    </div>
  );
};

// Main Profile Page Component
export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from API
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:3000/user/me',{withCredentials:true});
      console.log(response.data)
      setUser(response.data.user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.response?.data?.message || 'Failed to load user profile');
      toast.error('Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    toast.success('Successfully logged out');
    // In a real app, this would clear auth tokens and redirect to login
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorState message={error} onRetry={fetchUserData} />
      </div>
    );
  }

  // For demo purposes, if API call fails, use mock data
  const userData = user || {
    name: "John Doe",
    email: "john.doe@example.com",
    mobileNumber: "+91 9876543210"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header with basic profile info */}
      <header className="bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button 
              onClick={handleLogout}
              className="flex items-center bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 transition-colors duration-300"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center">
              <div className="bg-purple-600 rounded-full p-5 mr-5">
                <User size={36} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center">
                    <Mail size={14} className="mr-2" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2" />
                    <span>{userData.mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UserStatsCard 
              icon={BookOpen} 
              title="Enrolled Courses" 
              value={mockCourses.length} 
            />
            <UserStatsCard 
              icon={Clock} 
              title="Hours Spent" 
              value="45.5" 
            />
            <UserStatsCard 
              icon={Award} 
              title="Certificates" 
              value="2" 
            />
            <UserStatsCard 
              icon={Calendar} 
              title="Member Since" 
              value="Mar 2025" 
            />
          </div>
        </section>
        
        {/* My Courses section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">My Courses</h3>
            <button className="text-purple-700 text-sm font-medium hover:underline flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {mockCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          {mockCourses.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <BookOpen size={48} className="text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">You haven't enrolled in any courses.</p>
              <button className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                Browse Courses
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}