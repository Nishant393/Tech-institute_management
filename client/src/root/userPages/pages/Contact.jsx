import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Map, MessageSquare, Star, Send, 
  AlertCircle, BookOpen, Bug, Lightbulb, User
} from 'lucide-react';
import server from '../../../cofig/config';

// Feedback type icons
const feedbackTypeIcons = {
  Course: <BookOpen size={20} className="text-purple-700" />,
  Module: <BookOpen size={20} className="text-purple-700" />,
  BugReport: <Bug size={20} className="text-purple-700" />,
  Suggestion: <Lightbulb size={20} className="text-purple-700" />
};

export default function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    feedbackType: 'Course',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle star rating click
  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock user ID for demo purposes
      const payload = {
        ...formData,
        userId: "64a76d3e8b9f9e1234567890" // Mock user ID
      };
      
      // Optional courseId for Course and Module feedback types
      if (['Course', 'Module'].includes(formData.feedbackType)) {
        payload.courseId = "64a76d3e8b9f9e0987654321"; // Mock course ID
      }

      // Send feedback to API
      await axios.post(`${server}feedback/submit`, payload);
      
      // Show success message
      toast.success('Feedback submitted successfully!');
      
      // Reset form
      setFormData({
        feedbackType: 'Course',
        message: '',
        rating: 5
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if rating should be shown based on feedback type
  const showRating = ['Course', 'Module'].includes(formData.feedbackType);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Contact Us & Leave Feedback</h1>
            <p className="max-w-2xl mx-auto text-purple-100">
              Have questions or feedback? We'd love to hear from you! Use the map to find our location or submit your feedback using the form below.
            </p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-purple-50">
              <div className="flex items-center mb-4">
                <Map className="text-purple-700 mr-2" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Find Us</h2>
              </div>
              <p className="text-gray-600 mb-4">Visit us at Lonara Lake and experience the tranquility yourself.</p>
            </div>
            
            {/* Google Map embed */}
            <div className="h-96 w-full">
            {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1859.436873473051!2d79.0570731!3d21.2368545!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c3007a76bdb9%3A0x18cc1fc885f39848!2sLonara%20Lake!5e0!3m2!1sen!2sin!4v1744992655277!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}

              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1859.436873473051!2d79.0570731!3d21.2368545!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c3007a76bdb9%3A0x18cc1fc885f39848!2sLonara%20Lake!5e0!3m2!1sen!2sin!4v1744992655277!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{border: 0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map of Lonara Lake"
              ></iframe>
            </div>
          </div>
          
          {/* Feedback form section */}
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <MessageSquare className="text-purple-700 mr-2" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Share Your Feedback</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Feedback Type */}
                  <div className="mb-6">
                    <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {feedbackTypeIcons[formData.feedbackType]}
                      </div>
                      <select
                        id="feedbackType"
                        name="feedbackType"
                        value={formData.feedbackType}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-3"
                        required
                      >
                        <option value="Course">Course Feedback</option>
                        <option value="Module">Module Feedback</option>
                        <option value="BugReport">Bug Report</option>
                        <option value="Suggestion">Suggestion</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Rating (only for Course and Module feedback) */}
                  {showRating && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            className="p-1 focus:outline-none"
                          >
                            <Star
                              size={24}
                              className={`${
                                star <= formData.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              } cursor-pointer transition-colors duration-150`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Message */}
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Feedback
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
                      placeholder="Please share your thoughts, suggestions, or report an issue..."
                      required
                    ></textarea>
                  </div>
                  
                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center bg-purple-700 hover:bg-purple-800 text-white px-5 py-3 rounded-lg transition-colors duration-300 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Contact info card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="text-purple-700 mr-2" size={20} />
                  Contact Information
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p><span className="font-medium">Email:</span> support@eduhub.com</p>
                  <p><span className="font-medium">Phone:</span> +91 123-456-7890</p>
                  <p><span className="font-medium">Address:</span> Near Lonara Lake, Nagpur, Maharashtra, India</p>
                  <p><span className="font-medium">Hours:</span> Monday - Friday, 9:00 AM - 5:00 PM IST</p>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg flex items-start">
                  <AlertCircle size={20} className="text-purple-700 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    For urgent matters, please contact us directly via phone. We typically respond to email inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}