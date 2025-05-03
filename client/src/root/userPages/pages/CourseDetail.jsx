import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BookOpen, User, Star, Clock, FileText, Users, CheckCircle,
  ArrowLeft, Globe, Award, Check, ChevronDown, ChevronUp, Play, Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import server from '../../../cofig/config';
import RecordedCourseFeedback from '../../../component/RecordedCourseFeedback';
import { useUserContext } from '../../../Provider/AuthContext';
import CourseFeedback from '../../../component/CourseFeedback';

// Star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i < rating
                ? "text-yellow-400 fill-yellow-400 opacity-50"
                : "text-gray-300"
            }`}
        />
      ))}
      {console.log(rating)}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  );
};

// Feature Badge Component
const FeatureBadge = ({ icon, text }) => {
  const Icon = icon;
  return (
    <div className="flex items-center bg-purple-50 rounded-lg p-3">
      <Icon size={18} className="text-purple-700 mr-2" />
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
};

// Loading Component
const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader className="h-12 w-12 text-purple-700 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading course details...</p>
    </div>
  );
};

// Error State Component
const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to load course</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
      >
        Try Again
      </button>
    </div>
  );
};

// Learning Item Component
const LearningItem = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start mb-3"
    >
      <div className="bg-purple-100 rounded-full p-1 mr-3 mt-0.5">
        <Check size={14} className="text-purple-700" />
      </div>
      <span className="text-gray-700">{text}</span>
    </motion.div>
  );
};

// Curriculum Section Component
const CurriculumSection = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FileText size={18} className="text-purple-700 mr-2" />
          <span className="font-medium">Curriculum</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <ul className="space-y-3">
                {data.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-1 mr-3 mt-0.5">
                      <Play size={12} className="text-purple-700" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Tab component for course sections
const TabSection = ({ course }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' }
  ];

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-3 font-medium text-sm transition-colors duration-300 ${activeTab === tab.id
                ? 'text-purple-700 border-b-2 border-purple-700'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'description' && (
            <div>
              <h3 className="text-lg font-semibold mb-3">About This Course</h3>
              <p className="text-gray-700 mb-6">{course.description}</p>

              <h3 className="text-lg font-semibold mb-4">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {course.whatYouWillLearn.map((item, index) => (
                  <LearningItem key={index} text={item} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Course Content</h3>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{course.lecture}</span> lectures • <span className="font-medium">{course.duration}</span> months
                </div>
              </div>
              <CurriculumSection data={course.curriculam} />
            </div>
          )}

          {activeTab === 'instructor' && (
            <div>
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <User size={24} className="text-purple-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{course.instructor}</h3>
                  <p className="text-gray-600 text-sm">{course.category} Expert & Instructor</p>
                  <p className="text-gray-700 mt-2">
                    {course.instructorBio || `${course.instructor} is a passionate educator with years of experience in teaching ${course.category}.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Course Detail Page Component
export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user , isAuthanticated} =useUserContext()

  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${server}course/${courseId}`, { withCredentials: true });
      setCourse(response.data.course);
      console.log(response.data)
      toast.success('Course details loaded successfully!');
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.response?.data?.message || 'Failed to load course details');
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleEnrollment = () => {
    toast.promise(
      new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => resolve(), 1500);
      }),
      {
        loading: 'Processing enrollment...',
        success: 'Successfully enrolled in course!',
        error: 'Enrollment failed. Please try again.',
      }
    );
  };

  const handleAddToWishlist = () => {
    toast.success('Added to your wishlist!');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BookOpen size={28} className="text-purple-700" />
                <span className="ml-2 text-xl font-bold text-purple-700">EduHub</span>
              </div>
            </div>
          </div>
        </nav>
        <LoadingState />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BookOpen size={28} className="text-purple-700" />
                <span className="ml-2 text-xl font-bold text-purple-700">EduHub</span>
              </div>
            </div>
          </div>
        </nav>
        <ErrorState message={error} onRetry={fetchCourseData} />
      </div>
    );
  }

  // Show course details
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className="flex items-center text-white mb-4 hover:underline"
              onClick={() => {
                // Handle navigation
                toast.dismiss();
                window.history.back();
              }}
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Courses
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <span className="inline-block bg-white/20 text-white rounded-full px-3 py-1 text-sm font-medium mb-3">
                  {course.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-white/90 mb-4">{course.about}</p>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <StarRating rating={course.avgRating} />
                    <span className="ml-2 text-white/90">({course.enrolledStudent} students)</span>
                  </div>
                  <div className="flex items-center">
                    <Globe size={16} className="mr-1" />
                    <span>{course.language}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span>{course.instructor}</span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3 inline-block">
                  <span className="text-sm">Last updated: {course.lastUpdated || "February 2025"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 mb-8"
            >
              <img
                src={course.courseUrl?.url || "/api/placeholder/800/400"}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <FeatureBadge icon={Clock} text={`${course.duration} months`} />
                <FeatureBadge icon={FileText} text={`${course.lecture} lectures`} />
                <FeatureBadge icon={Users} text={`${course.enrolledStudent} students`} />
                <FeatureBadge
                  icon={Award}
                  text={course.certificate ? "Certificate" : "No Certificate"}
                />
              </div>

              <TabSection course={course} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:w-1/3"
          >
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
              <div className="mb-6">
                <div className="text-3xl font-bold text-purple-700 mb-1">₹{course.price}</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-4 rounded-lg mb-4 transition-colors duration-300"
                onClick={handleEnrollment}
              >
                Enroll Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-white border border-purple-700 text-purple-700 font-medium py-3 px-4 rounded-lg mb-6 hover:bg-purple-50 transition-colors duration-300"
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </motion.button>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-3">This course includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-700">
                    <Clock size={16} className="mr-2 text-purple-700" />
                    <span>{course.duration} months of access</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <FileText size={16} className="mr-2 text-purple-700" />
                    <span>{course.lecture}+ lectures</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Globe size={16} className="mr-2 text-purple-700" />
                    <span>{course.language}</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <CheckCircle size={16} className="mr-2 text-purple-700" />
                    <span>Skill level: {course.skill}</span>
                  </li>
                  {course.certificate && (
                    <li className="flex items-center text-sm text-gray-700">
                      <Award size={16} className="mr-2 text-purple-700" />
                      <span>Certificate of completion</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">30-Day Money-Back Guarantee</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <CourseFeedback
        courseId={courseId}
        isAuthanticated={isAuthanticated}
        userId={user.id}
      />
    </div>
  );
}