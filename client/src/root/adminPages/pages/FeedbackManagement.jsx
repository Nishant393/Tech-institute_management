import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import server from '../../../cofig/config';

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [resolving, setResolving] = useState(null);
  
  const observer = useRef();
  const lastFeedbackRef = useRef();

  const fetchFeedbacks = async (pageNum = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}feedback/get?page=${pageNum}`,{withCredentials:true});
      
      if (pageNum === 1) {
        setFeedbacks(data.feedbacks);
      } else {
        setFeedbacks(prev => [...prev, ...data.feedbacks]);
      }
      
      setHasMore(pageNum < data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Failed to load feedback data');
      toast.error('Failed to load feedback data. Please try again.');
      setLoading(false);
    }
  };

  const handleResolve = async (feedbackId) => {
    try {
      setResolving(feedbackId);
      // Replace with your actual API endpoint for resolving feedback
      await axios.patch(`${server}feedback/resolve/${feedbackId}`, {withCredentials:true ,isResolved: true });
      
      // Update local state
      setFeedbacks(prev => 
        prev.map(feedback => 
          feedback._id === feedbackId 
            ? { ...feedback, isResolved: true } 
            : feedback
        )
      );
      setResolving(null);
      toast.success('Feedback marked as resolved');
    } catch (err) {
      setResolving(null);
      toast.error('Failed to resolve feedback. Please try again.');
    }
  };

  useEffect(() => {
    fetchFeedbacks(1);
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };
    
    const handleObserver = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    };
    
    observer.current = new IntersectionObserver(handleObserver, options);
    
    if (lastFeedbackRef.current) {
      observer.current.observe(lastFeedbackRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchFeedbacks(page);
    }
  }, [page]);

  const filteredFeedbacks = feedbacks
    .filter(feedback => {
      if (filterType === 'All') return true;
      return feedback.feedbackType === filterType;
    })
    .filter(feedback => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (feedback.message && feedback.message.toLowerCase().includes(searchLower)) ||
        (feedback.userId && feedback.userId.name && feedback.userId.name.toLowerCase().includes(searchLower)) ||
        (feedback.userId && feedback.userId.email && feedback.userId.email.toLowerCase().includes(searchLower)) ||
        (feedback.courseId && feedback.courseId.title && feedback.courseId.title.toLowerCase().includes(searchLower))
      );
    });

  const getSortedFeedbacks = () => {
    return [...filteredFeedbacks].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'highestRating') {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === 'lowestRating') {
        return (a.rating || 0) - (b.rating || 0);
      }
      return 0;
    });
  };

  const sortedFeedbacks = getSortedFeedbacks();

  const getFeedbackTypeColor = (type) => {
    switch (type) {
      case 'Course': return 'bg-purple-100 text-purple-800';
      case 'Module': return 'bg-indigo-100 text-indigo-800';
      case 'BugReport': return 'bg-red-100 text-red-800';
      case 'Suggestion': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* React Hot Toast Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Feedback Management</h1>
          <p className="text-gray-600 mt-2">Review and manage user feedback across the platform</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilterType('All')} 
                className={`px-4 py-2 rounded-md ${filterType === 'All' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterType('Course')} 
                className={`px-4 py-2 rounded-md ${filterType === 'Course' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Course
              </button>
              <button 
                onClick={() => setFilterType('Module')} 
                className={`px-4 py-2 rounded-md ${filterType === 'Module' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Module
              </button>
              <button 
                onClick={() => setFilterType('BugReport')} 
                className={`px-4 py-2 rounded-md ${filterType === 'BugReport' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Bug Reports
              </button>
              <button 
                onClick={() => setFilterType('Suggestion')} 
                className={`px-4 py-2 rounded-md ${filterType === 'Suggestion' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
              >
                Suggestions
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highestRating">Highest Rating</option>
                <option value="lowestRating">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        {loading && page === 1 ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading feedback...</p>
          </div>
        ) : sortedFeedbacks.length === 0 ? (
          <div className="p-6 text-center bg-white shadow-sm rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600">No feedback found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedFeedbacks.map((feedback, index) => (
              <div 
                key={feedback._id}
                ref={index === sortedFeedbacks.length - 1 ? lastFeedbackRef : null}
                className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getFeedbackTypeColor(feedback.feedbackType)}`}>
                      {feedback.feedbackType}
                    </span>
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${feedback.isResolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {feedback.isResolved ? 'Resolved' : 'Pending'}
                    </span>
                  </div>
                  {feedback.rating && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-900">{feedback.userId?.name || 'Unknown User'}</div>
                  <div className="text-xs text-gray-500">{feedback.userId?.email || 'No email'}</div>
                </div>

                {/* Course Info */}
                {feedback.courseId?.title && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-500">Course:</div>
                    <div className="text-sm text-gray-700">{feedback.courseId.title}</div>
                  </div>
                )}

                {/* Feedback Message */}
                <div className="mb-4">
                  <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md min-h-12 max-h-32 overflow-y-auto">
                    {feedback.message}
                  </div>
                </div>

                {/* Date & Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    {formatDate(feedback.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => !feedback.isResolved && handleResolve(feedback._id)}
                      disabled={feedback.isResolved || resolving === feedback._id}
                      className={`px-3 py-1 text-xs rounded ${
                        feedback.isResolved 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : resolving === feedback._id 
                            ? 'bg-purple-100 text-purple-300' 
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      }`}
                    >
                      {resolving === feedback._id ? 'Resolving...' : 'Mark Resolved'}
                    </button>
                    <button 
                      className="px-3 py-1 text-xs rounded bg-purple-50 text-purple-600 hover:bg-purple-100"
                      onClick={() => {
                        // Show a toast with full feedback details
                        toast.custom((t) => (
                          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col`}>
                            <div className="p-4">
                              <div className="flex items-start">
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-900 mb-1">
                                    Feedback from {feedback.userId?.name || 'Unknown'}
                                  </p>
                                  <p className="text-sm text-gray-500 mb-2">
                                    {feedback.courseId?.title ? `Course: ${feedback.courseId.title}` : 'General Feedback'} 
                                  </p>
                                  <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded mb-2">
                                    {feedback.message}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Submitted on {formatDate(feedback.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="border-t border-gray-200">
                              <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border-transparent rounded-none rounded-b-lg p-3 flex items-center justify-center text-sm font-medium text-purple-600 hover:text-purple-500 focus:outline-none"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        ), { duration: 5000 });
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Loading more indicator */}
        {loading && page > 1 && (
          <div className="p-4 text-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading more...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;