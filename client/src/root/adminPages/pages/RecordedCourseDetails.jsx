import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useParams, Link, useNavigate } from 'react-router-dom';
import server from '../../../cofig/config';

const RecordedCourseDetails = () => {
  const id  = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [sections, setSections] = useState([]);
  const videoRef = useRef(null);
  useEffect(() => {
    fetchCourseDetails();
  }, [id]);
  
  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}recorded/${id.courseId}`, {
        withCredentials: true,
      });
      console.log(response.data)
      const courseData = response.data.course;
      setCourse(courseData);
      
      // Organize videos by section
      const sectionMap = new Map();
      
      courseData.videos.forEach(video => {
        if (!sectionMap.has(video.sectionTitle)) {
          sectionMap.set(video.sectionTitle, []);
        }
        sectionMap.get(video.sectionTitle).push(video);
      });
      
      // Convert map to array for state
      const sectionsArray = Array.from(sectionMap).map(([title, videos]) => ({
        title,
        videos
      }));
      
      setSections(sectionsArray);
      
      // Set first video as current if available
      if (courseData.videos && courseData.videos.length > 0) {
        setCurrentVideo(courseData.videos[0]);
      }
      
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePlayVideo = (video) => {
    setCurrentVideo(video);
    // Scroll to video player on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Wait for state update and then play video
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      }
    }, 100);
  };
  
  const handleEditCourse = () => {
    navigate(`/edit-course/${id}`);
  };
  
  const handleDeleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:3000/recorded/${id}`, {
          withCredentials: true,
        });
        
        toast.success('Course deleted successfully');
        navigate('/recorded');
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-4">Course not found</h2>
          <p className="text-gray-500 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/recorded"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link to="/recorded" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to All Courses
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Video Player */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {currentVideo ? (
              <div className="aspect-w-16 aspect-h-9">
                <video
                  ref={videoRef}
                  src={currentVideo.video.url}
                  controls
                  className="w-full h-full object-cover"
                  poster={course.thumbnail}
                />
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No video available</p>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{course.title}</h1>
                  {course.price > 0 ? (
                    <span className="inline-block mt-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      ${course.price}
                    </span>
                  ) : (
                    <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      Free
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleEditCourse}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {currentVideo && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{currentVideo.title}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">
                      Duration: {currentVideo.duration || "N/A"}
                    </span>
                    <span>
                      From: {currentVideo.sectionTitle}
                    </span>
                  </div>
                </div>
              )}
              
              {course.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">About this course</h3>
                  <p className="text-gray-700">{course.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Video List */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>
            <p className="text-sm text-gray-500 mb-4">{course.videos?.length || 0} videos</p>
            
            <div className="divide-y">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="py-4">
                  <h3 className="font-medium text-gray-800 mb-2">{section.title}</h3>
                  <ul className="space-y-2 ml-2">
                    {section.videos.map((video, videoIndex) => (
                      <li key={videoIndex}>
                        <button
                          onClick={() => handlePlayVideo(video)}
                          className={`w-full text-left flex items-start p-2 rounded hover:bg-gray-100 ${
                            currentVideo && currentVideo._id === video._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <div className="mr-3 mt-1">
                            {currentVideo && currentVideo._id === video._id ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className={`font-medium ${currentVideo && currentVideo._id === video._id ? 'text-blue-600' : 'text-gray-800'}`}>
                              {video.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {video.duration || "0:00"}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordedCourseDetails;