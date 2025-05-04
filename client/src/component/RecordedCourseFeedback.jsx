import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import server from '../cofig/config';

const RecordedCourseFeedback = ({ courseId, isAuthanticated, userId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 5,
    message: '',
    feedbackType: 'Course'
  });

  useEffect(() => {
    fetchFeedbacks();
  }, [courseId]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}feedback/recorded/${courseId}`,{withCredentials:true});
      console.log(data)
      setFeedbacks(data.feedbacks || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthanticated) {
      toast.error('Please login to submit feedback');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(`${server}feedback/submit`, {
        userId,
        recordedCourseId: courseId,
        feedbackType: feedback.feedbackType,
        rating: feedback.rating,
        message: feedback.message
      },{withCredentials:true});

      toast.success('Feedback submitted successfully!');
      setFeedback({
        rating: 5,
        message: '',
        feedbackType: 'Course'
      });
      setShowForm(false);
      // Add the new feedback to the list
      fetchFeedbacks();
      setSubmitting(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'text-yellow-500' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-purple-900">
          Course Feedback
        </h3>
        {isAuthanticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Give Feedback
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-purple-50 p-4 rounded-lg mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Feedback Type
            </label>
            <select
              name="feedbackType"
              value={feedback.feedbackType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="Course">Course Review</option>
              <option value="Module">Module Feedback</option>
              <option value="BugReport">Bug Report</option>
              <option value="Suggestion">Suggestion</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Rating
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedback({ ...feedback, rating: star })}
                  className="focus:outline-none"
                >
                  <svg
                    className={`h-8 w-8 ${
                      star <= feedback.rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Your Feedback
            </label>
            <textarea
              name="message"
              value={feedback.message}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
            >
              {submitting && (
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              )}
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-800"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No feedback available for this course yet.
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((item) => (
            <div key={item._id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {item.userId?.name || 'Anonymous User'}
                  </p>
                  <div className="flex items-center mt-1">
                    {renderStars(item.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                  {item.feedbackType}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{item.message}</p>
            </div>
          ))}
        </div>
      )}

      {!isAuthanticated && !loading && (
        <div className="mt-4 text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Please log in to submit your feedback for this course.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordedCourseFeedback;