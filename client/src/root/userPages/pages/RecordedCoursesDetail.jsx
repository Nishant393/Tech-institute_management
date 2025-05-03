import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import server from '../../../cofig/config';
import CourseFeedback from '../../../component/CourseFeedback';
import { useUserContext } from '../../../Provider/AuthContext';
import RecordedCourseFeedback from '../../../component/RecordedCourseFeedback';

const RecordedCoursesDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const { user , isAuthanticated } = useUserContext()

  useEffect(() => {
    fetchRecordedCoursesDetails();
    checkEnrollmentStatus();
  }, [id]);


  const fetchRecordedCoursesDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}recorded/${id}`);
      setCourse(data.course);
      console.log(data.course);
      // Group videos by section and identify unique sections
      if (data.course.videos.length > 0) {
        setSelectedVideo(data.course.videos[0]);
        
        // Automatically expand the first section
        const firstSection = data.course.videos[0].sectionTitle;
        setCurrentSection(firstSection);
        setExpandedSections({ [firstSection]: true });
      }
      
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch course details');
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      // This would be an actual API call to check enrollment in a real app
      // For now, we'll just simulate it with localStorage
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      if (enrolledCourses.includes(id)) {
        setEnrolled(true);
      }
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      
      // In a real app, this would be an API call to enroll in the course
      // For now, we'll just simulate it with localStorage
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      
      if (!enrolledCourses.includes(id)) {
        enrolledCourses.push(id);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      }
      
      setEnrolled(true);
      toast.success('Successfully enrolled in the course!');
      setEnrolling(false);
    } catch (error) {
      toast.error('Failed to enroll in the course. Please try again.');
      setEnrolling(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const downloadVideo = async (videoUrl, videoTitle) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
  
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${videoTitle}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  
      toast.success('Video download started!');
    } catch (error) {
      toast.error('Failed to download video.');
      console.error('Download error:', error);
    }
  };
  

  // Group videos by section
  const groupedVideos = {};
  if (course) {
    course.videos.forEach(video => {
      const section = video.sectionTitle || 'Uncategorized';
      if (!groupedVideos[section]) {
        groupedVideos[section] = [];
      }
      groupedVideos[section].push(video);
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Course Not Found</h2>
        <Link to="/recorded-courses" className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/recorded-courses" className="inline-flex items-center text-purple-800 hover:text-purple-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-4">
              {selectedVideo && (
                <video 
                  src={selectedVideo.video.url} 
                  controls 
                  className="w-full aspect-video"
                  poster={course.thumbnail}
                ></video>
              )}
            </div>
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-purple-900 mb-2">{course.title}</h1>
              <p className="text-gray-500 mb-4">
                Created by: {course.createdBy?.name || 'Instructor'}
              </p>
              <p className="text-gray-700">{course.description}</p>
            </div>

            {selectedVideo && (
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-600">
                  Duration: {selectedVideo.duration}
                </p>
                {(!course.isPaid || enrolled) && (
                  <button
                    onClick={() => downloadVideo(selectedVideo.video.url, selectedVideo.title)}
                    className="mt-3 inline-flex items-center bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Video
                  </button>
                )}
              </div>
            )}

            {/* Feedback Component */}
            <RecordedCourseFeedback 
              courseId={id} 
              isAuthanticated={isAuthanticated} 
              userId={user.id} 
            />
          </div>

          {/* Course Content Section */}
          <div className="lg:col-span-1">
            {course.isPaid && !enrolled ? (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-3">
                  Enroll in this Course
                </h3>
                <p className="text-2xl font-bold text-purple-800 mb-4">
                  ${course.price}
                </p>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-purple-800 text-white py-3 rounded-lg hover:bg-purple-700 flex justify-center items-center"
                >
                  {enrolling ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                  ) : null}
                  {enrolling ? 'Processing...' : 'Enroll Now'}
                </button>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Get immediate access to all course content
                </p>
              </div>
            ) : (
              enrolled && course.isPaid && (
                <div className="bg-green-50 rounded-lg shadow-lg p-4 mb-6 border border-green-200">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-800 font-medium">You are enrolled in this course</p>
                  </div>
                </div>
              )
            )}

            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">
                Course Content
              </h3>
              
              <div className="text-sm text-gray-600 mb-4">
                {course.videos.length} {course.videos.length === 1 ? 'video' : 'videos'} • Total duration: {
                  (() => {
                    const totalSeconds = Object.values(groupedVideos).flat().reduce((total, video) => {
                      // Simple calculation assuming format is "MM:SS" or "HH:MM:SS"
                      const parts = video.duration.split(':').map(Number);
                      const seconds = parts.length === 2 
                        ? parts[0] * 60 + parts[1] 
                        : parts[0] * 3600 + parts[1] * 60 + parts[2];
                      return total + seconds;
                    }, 0);
                    
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);
                    const seconds = totalSeconds % 60;
                    
                    if (hours > 0) {
                      return `${hours}h ${minutes}m`;
                    } else {
                      return `${minutes}m ${seconds}s`;
                    }
                  })()
                }
              </div>
              
              <div className="space-y-2">
                {Object.keys(groupedVideos).map((section) => (
                  <div key={section} className="border border-gray-200 rounded">
                    <button
                      onClick={() => toggleSection(section)}
                      className="w-full flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100"
                    >
                      <span className="font-medium text-purple-900">{section}</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-purple-800 transform ${expandedSections[section] ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedSections[section] && (
                      <div className="p-3">
                        {groupedVideos[section].map((video, index) => (
                          <div 
                            key={index} 
                            className={`p-2 rounded cursor-pointer ${selectedVideo?._id === video._id ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                            onClick={() => setSelectedVideo(video)}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{video.title}</p>
                                <p className="text-xs text-gray-500">{video.duration}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedCoursesDetail;