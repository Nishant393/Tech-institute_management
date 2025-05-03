import React, { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CreateRecordedCourse = () => {
  // Keep existing state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // For sections and videos
  const [sections, setSections] = useState([
    { 
      title: 'Section 1', 
      videos: [{ 
        title: '', 
        file: null, 
        video: { public_id: '', url: '' }, 
        duration: '', 
        uploading: false, 
        progress: 0,
        uploadController: null 
      }] 
    }
  ]);
  
  const thumbnailInputRef = useRef(null);
    
  const uploadThumbnail = async (file) => {
    setThumbnailUploading(true);
    setThumbnailProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', "frontend_upload");
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDANRY_UID}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setThumbnailProgress(percentCompleted);
          }
        }
      );
      
      setThumbnailUrl(response.data.secure_url);
      toast.success('Thumbnail uploaded successfully');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Failed to upload thumbnail');
    } finally {
      setThumbnailUploading(false);
    }
  };
  
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      
      // Create preview URL for the thumbnail
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Upload thumbnail to Cloudinary
      await uploadThumbnail(file);
    }
  };
  
  const handleAddSection = () => {
    setSections([
      ...sections, 
      { 
        title: `Section ${sections.length + 1}`, 
        videos: [{ 
          title: '', 
          file: null, 
          video: { public_id: '', url: '' }, 
          duration: '', 
          uploading: false, 
          progress: 0,
          uploadController: null 
        }] 
      }
    ]);
  };
  
  const handleSectionTitleChange = (index, value) => {
    const updatedSections = [...sections];
    updatedSections[index].title = value;
    setSections(updatedSections);
  };
  
  const handleAddVideo = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].videos.push({ 
      title: '', 
      file: null, 
      video: { public_id: '', url: '' }, 
      duration: '',
      uploading: false,
      progress: 0,
      uploadController: null
    });
    setSections(updatedSections);
  };
  
  const handleVideoChange = (sectionIndex, videoIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].videos[videoIndex][field] = value;
    setSections(updatedSections);
  };
  
  const handleVideoFileChange = async (sectionIndex, videoIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].videos[videoIndex].file = file;
      updatedSections[sectionIndex].videos[videoIndex].uploading = true;
      updatedSections[sectionIndex].videos[videoIndex].progress = 0;
      setSections(updatedSections);
      
      // Upload video to Cloudinary
      await uploadVideo(sectionIndex, videoIndex, file);
    }
  };
  
  const uploadVideo = async (sectionIndex, videoIndex, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', "frontend_upload");
      formData.append('resource_type', 'video');
      
      // Create an AbortController for this upload
      const controller = new AbortController();
      const signal = controller.signal;
      
      // Store the controller in the state for potential cancellation
      const updatedSections = [...sections];
      updatedSections[sectionIndex].videos[videoIndex].uploadController = controller;
      setSections(updatedSections);
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDANRY_UID}/video/upload`, 
        formData,
        {
          signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const updatedSections = [...sections];
            updatedSections[sectionIndex].videos[videoIndex].progress = percentCompleted;
            setSections(updatedSections);
          }
        }
      );
      
      const newSections = [...sections];
      newSections[sectionIndex].videos[videoIndex].video = { 
        public_id: response.data.public_id, 
        url: response.data.secure_url 
      };
      newSections[sectionIndex].videos[videoIndex].uploading = false;
      newSections[sectionIndex].videos[videoIndex].uploadController = null;
      setSections(newSections);
      
      toast.success(`Video "${file.name}" uploaded successfully`);
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.info(`Upload for "${file.name}" cancelled`);
      } else {
        console.error('Error uploading video:', error);
        toast.error(`Failed to upload video "${file.name}"`);
      }
      
      const updatedSections = [...sections];
      updatedSections[sectionIndex].videos[videoIndex].uploading = false;
      updatedSections[sectionIndex].videos[videoIndex].uploadController = null;
      setSections(updatedSections);
    }
  };
  
  const handleCancelUpload = (sectionIndex, videoIndex) => {
    const updatedSections = [...sections];
    const controller = updatedSections[sectionIndex].videos[videoIndex].uploadController;
    
    if (controller) {
      controller.abort();
      updatedSections[sectionIndex].videos[videoIndex].uploading = false;
      updatedSections[sectionIndex].videos[videoIndex].progress = 0;
      updatedSections[sectionIndex].videos[videoIndex].uploadController = null;
      setSections(updatedSections);
    }
  };
  
  const handleRemoveVideo = (sectionIndex, videoIndex) => {
    const updatedSections = [...sections];
    
    // Cancel upload if in progress
    const video = updatedSections[sectionIndex].videos[videoIndex];
    if (video.uploading && video.uploadController) {
      video.uploadController.abort();
    }
    
    updatedSections[sectionIndex].videos.splice(videoIndex, 1);
    
    // If no videos left in section, add an empty one
    if (updatedSections[sectionIndex].videos.length === 0) {
      updatedSections[sectionIndex].videos.push({ 
        title: '', 
        file: null, 
        video: { public_id: '', url: '' }, 
        duration: '',
        uploading: false,
        progress: 0,
        uploadController: null
      });
    }
    
    setSections(updatedSections);
  };
  
  const handleRemoveSection = (sectionIndex) => {
    if (sections.length > 1) {
      const updatedSections = [...sections];
      
      // Cancel any uploads in progress for this section
      updatedSections[sectionIndex].videos.forEach(video => {
        if (video.uploading && video.uploadController) {
          video.uploadController.abort();
        }
      });
      
      updatedSections.splice(sectionIndex, 1);
      setSections(updatedSections);
    } else {
      toast.error("You need at least one section");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title) return toast.error("Course title is required");
    if (!thumbnailUrl) return toast.error("Please upload a thumbnail image");
    
    let hasVideos = false;
    for (const section of sections) {
      for (const video of section.videos) {
        if (video.video.url) {
          hasVideos = true;
          if (!video.title) return toast.error("All videos must have a title");
        }
      }
    }
    
    if (!hasVideos) return toast.error("At least one video is required");
    
    // Check if any uploads are still in progress
    let uploadsInProgress = thumbnailUploading;
    for (const section of sections) {
      for (const video of section.videos) {
        if (video.uploading) {
          uploadsInProgress = true;
        }
      }
    }
    
    if (uploadsInProgress) {
      return toast.error("Please wait for all uploads to complete");
    }
    
    setLoading(true);
    toast.loading("Creating course...");
    
    try {
      // Prepare video data
      const videoTitles = [];
      const videos = [];
      const sectionTitles = [];
      const durations = [];
      
      // Process videos and their metadata
      for (const section of sections) {
        for (const video of section.videos) {
          if (video.video.url) {
            videos.push({
              public_id: video.video.public_id,
              url: video.video.url
            });
            videoTitles.push(video.title);
            sectionTitles.push(section.title);
            durations.push(video.duration || '0:00');
          }
        }
      }
      
      // Create payload object
      const payload = {
        title,
        description,
        price: isPaid ? price : 0,
        createdBy: '67f7d6d0107f75d23178cc0e', // Replace with actual user ID
        thumbnail: thumbnailUrl,
        videos,
        videoTitles,
        sectionTitles,
        isPaid,
        durations
      };
      
      // Send the request
      const response = await axios.post('http://localhost:3000/recorded/create', payload, {
        withCredentials: true,
      });
      
      toast.dismiss();
      toast.success("Course created successfully!");

      
      // Reset form or redirect
      window.location.href = `/recorded/content/${response.data.course._id}`;
      
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to create course");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create Recorded Course</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Information</h2>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="title">
              Course Title*
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 h-32"
            />
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-1 font-medium" htmlFor="price">
                Price (in USD)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                disabled={!isPaid}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="w-1/2 flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={() => setIsPaid(!isPaid)}
                  className="h-5 w-5 mr-2"
                />
                <span>This is a paid course</span>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Course Thumbnail*
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={thumbnailInputRef}
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => thumbnailInputRef.current.click()}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200"
                disabled={thumbnailUploading}
              >
                {thumbnailUploading ? 'Uploading...' : thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
              </button>
              {thumbnailPreview && (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="h-20 w-32 object-cover rounded"
                  />
                  {thumbnailUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                      <span className="text-white text-sm font-medium">{thumbnailProgress}%</span>
                    </div>
                  )}
                  {thumbnailUrl && !thumbnailUploading && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Course Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Course Content</h2>
            <button
              type="button"
              onClick={handleAddSection}
              className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm hover:bg-green-200"
            >
              + Add Section
            </button>
          </div>
          
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="w-full mr-2">
                  <label className="block mb-1 text-sm font-medium">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionTitleChange(sectionIndex, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSection(sectionIndex)}
                  className="text-red-500 hover:text-red-700 mt-6"
                >
                  Remove
                </button>
              </div>
              
              {section.videos.map((video, videoIndex) => (
                <div key={videoIndex} className="ml-4 mb-4 p-3 border-l-2 border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Video {videoIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(sectionIndex, videoIndex)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1 text-sm">Video Title</label>
                      <input
                        type="text"
                        value={video.title}
                        onChange={(e) => handleVideoChange(sectionIndex, videoIndex, 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm">Duration (e.g., "10:30")</label>
                      <input
                        type="text"
                        value={video.duration}
                        onChange={(e) => handleVideoChange(sectionIndex, videoIndex, 'duration', e.target.value)}
                        placeholder="mm:ss"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <label className="block mb-1 text-sm">Video File</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoFileChange(sectionIndex, videoIndex, e)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        disabled={video.uploading}
                      />
                      {video.uploading && (
                        <div className="text-yellow-500">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                      {video.video.url && !video.uploading && (
                        <div className="text-green-500">
                          ✓
                        </div>
                      )}
                    </div>
                    {video.file && (
                      <div className="mt-2">
                        <p className="text-sm">
                          {video.file.name} ({Math.round(video.file.size / 1024 / 1024 * 10) / 10} MB)
                          {video.video.url && <span className="text-green-600 ml-2">Uploaded successfully!</span>}
                        </p>
                        
                        {/* Progress bar */}
                        {video.uploading && (
                          <div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${video.progress}%` }}
                              ></div>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-gray-600">{video.progress}% uploaded</p>
                                <button 
                                  type="button"
                                  onClick={() => handleCancelUpload(sectionIndex, videoIndex)}
                                  className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => handleAddVideo(sectionIndex)}
                className="ml-4 text-blue-500 hover:text-blue-700 text-sm"
              >
                + Add Video to this Section
              </button>
            </div>
          ))}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || thumbnailUploading}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              loading || thumbnailUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecordedCourse;