import React, { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Save, Upload, Image, Loader2, XCircle, CheckCircle } from 'lucide-react';
import axios from "axios";
import server from "../../../cofig/config";

const WebsiteCustomization = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Hero section
    heroTitle: '',
    heroSubtitle: '',
    websiteName: '',
    heroImage: { public_id: '', url: '' },
    iconImage: { public_id: '', url: '' },
    icon: { public_id: '', url: '' },
    
    // Meta data
    metaTitle: '',
    metaDescription: '',
    ogUrl: '',
    author: ''
  });
  
  // Track uploads in progress
  const [uploading, setUploading] = useState({
    heroImage: false,
    iconImage: false,
    icon: false
  });
  
  // Track upload progress
  const [uploadProgress, setUploadProgress] = useState({
    heroImage: 0,
    iconImage: 0,
    icon: 0
  });
  
  // Store upload controllers (for cancel functionality)
  const uploadControllers = useRef({
    heroImage: null,
    iconImage: null,
    icon: null
  });

  // Create refs for file inputs
  const heroImageRef = useRef(null);
  const iconImageRef = useRef(null);
  const iconRef = useRef(null);

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET = 'frontend_upload'; // Replace with your upload preset
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDANRY_UID;      // Replace with your cloud name
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${server}site-settings`);
        if (response.data) {
          setSettings(response.data);
        }
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load settings');
        console.error('Error fetching settings:', error);
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input changes with validation and Cloudinary upload
  const handleFileChange = async (e) => {
    const { name, files: uploadedFiles } = e.target;
    const file = uploadedFiles[0];
    
    if (!file) return;
    
    // Validate file types
    if (name === 'iconImage' || name === 'icon') {
      // Only PNG or SVG allowed for icons
      if (file.type !== 'image/png' && file.type !== 'image/svg+xml') {
        toast.error(`${name === 'iconImage' ? 'Icon Image' : 'Favicon'} must be PNG or SVG format`);
        return;
      }
      
      // Validate icon size (max 1MB)
      if (file.size > 1024 * 1024) {
        toast.error(`${name === 'iconImage' ? 'Icon Image' : 'Favicon'} must be less than 1MB`);
        return;
      }
    } else if (name === 'heroImage') {
      // PNG, JPG, or JPEG allowed for hero image
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        toast.error('Hero image must be PNG, JPG or JPEG format');
        return;
      }
      
      // Validate hero image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Hero image must be less than 5MB');
        return;
      }
    }
    
    // Set uploading state
    setUploading(prev => ({ ...prev, [name]: true }));
    setUploadProgress(prev => ({ ...prev, [name]: 0 }));
    
    // Create a new AbortController for this upload
    const controller = new AbortController();
    uploadControllers.current[name] = controller;
    
    try {
      // Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      // Folder path based on image type
      formData.append('folder', `site-settings/${name}`);
      
      // Upload to Cloudinary with progress tracking
      const response = await axios.post(CLOUDINARY_URL, formData, {
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [name]: percentCompleted }));
        }
      });
      
      // Get the Cloudinary response
      const imageData = response.data;
      
      // Update settings with Cloudinary data
      setSettings(prev => ({
        ...prev,
        [name]: {
          public_id: imageData.public_id,
          url: imageData.secure_url
        }
      }));
      
      toast.success(`${name === 'heroImage' ? 'Hero Image' : name === 'iconImage' ? 'Icon Image' : 'Favicon'} uploaded successfully`);
    } catch (error) {
      if (error.name === 'AbortError') {
        toast.error('Upload cancelled');
      } else {
        toast.error(`Failed to upload ${name === 'heroImage' ? 'hero image' : name === 'iconImage' ? 'icon image' : 'favicon'}`);
        console.error('Upload error:', error);
      }
    } finally {
      setUploading(prev => ({ ...prev, [name]: false }));
      setUploadProgress(prev => ({ ...prev, [name]: 0 }));
      uploadControllers.current[name] = null;
      
      // Reset file input
      if (name === 'heroImage') heroImageRef.current.value = '';
      if (name === 'iconImage') iconImageRef.current.value = '';
      if (name === 'icon') iconRef.current.value = '';
    }
  };

  // Cancel ongoing upload
  const cancelUpload = (name) => {
    if (uploadControllers.current[name]) {
      uploadControllers.current[name].abort();
      uploadControllers.current[name] = null;
    }
  };

  // URL validation helper
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Form validation
  const validateForm = () => {
    // Required fields
    if (activeTab === 'hero') {
      if (!settings.websiteName.trim()) {
        toast.error('Website Name is required');
        return false;
      }
      if (!settings.heroTitle.trim()) {
        toast.error('Hero Title is required');
        return false;
      }
    } else if (activeTab === 'meta') {
      if (!settings.metaTitle.trim()) {
        toast.error('Meta Title is required');
        return false;
      }
      if (!settings.metaDescription.trim()) {
        toast.error('Meta Description is required');
        return false;
      }
      
      // Validate URL format if provided
      if (settings.ogUrl && !isValidUrl(settings.ogUrl)) {
        toast.error('Please enter a valid URL');
        return false;
      }
    }
    
    // Check if any uploads are in progress
    if (Object.values(uploading).some(status => status === true)) {
      toast.error('Please wait for all uploads to complete');
      return false;
    }
    
    return true;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      toast.loading('Saving settings...', { id: 'saving' });
      
      // Create payload with all settings
      // All images are already uploaded to Cloudinary, so we just need to send the references
      const payload = {
        ...settings
      };
      
      // Send request as JSON
      const response = await axios.put(`${server}site-settings`, payload);
      console.log(payload,response)
      
      // Update state with response data if needed
      if (response.data) {
        setSettings(response.data);
      }
      
      toast.dismiss('saving');
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.dismiss('saving');
      toast.error(error.response?.data?.message || 'Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle file upload button clicks
  const handleUploadClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // Render upload area with progress and cancel button
  const renderUploadArea = (name, label, accept, inputRef, maxSize) => {
    const isUploading = uploading[name];
    const progress = uploadProgress[name];
    const imageData = settings[name];
    
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div 
          className={`border-2 border-dashed ${isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'} rounded-md p-4 text-center transition-colors relative`}
        >
          {/* Show image preview if available */}
          {imageData?.url && !isUploading && (
            <div className="mb-4 relative group">
              <img 
                src={imageData.url} 
                alt={`${label} Preview`} 
                className="h-20 w-auto mx-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setSettings(prev => ({ ...prev, [name]: { public_id: '', url: '' } }))}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <XCircle size={16} />
              </button>
            </div>
          )}
          
          {/* Show upload progress if uploading */}
          {isUploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                <span className="ml-2 text-sm text-blue-500">Uploading... {progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <button
                type="button"
                onClick={() => cancelUpload(name)}
                className="mt-2 px-3 py-1 bg-red-500 text-slate-700 text-xs rounded hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => !imageData?.url && handleUploadClick(inputRef)}
            >
              {!imageData?.url && (
                <>
                  <div className="flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Upload Image</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">Max {maxSize}</span>
                </>
              )}
              {imageData?.url && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadClick(inputRef);
                  }}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors flex items-center"
                >
                  <Upload size={14} className="mr-1" />
                  Change Image
                </button>
              )}
              <input
                id={name}
                ref={inputRef}
                type="file"
                name={name}
                onChange={handleFileChange}
                accept={accept}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster position="top-right" />
      
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Site Settings</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          type="button"
          className={`px-4 py-2 font-medium ${activeTab === 'hero' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('hero')}
          disabled={Object.values(uploading).some(status => status === true)}
        >
          Hero Section
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-medium ${activeTab === 'meta' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('meta')}
          disabled={Object.values(uploading).some(status => status === true)}
        >
          Meta Data
        </button>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Hero Section Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="websiteName" className="block text-sm font-medium text-gray-700 mb-2">
                  Website Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="websiteName"
                  type="text"
                  name="websiteName"
                  value={settings.websiteName || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tech Institute"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="heroTitle"
                  type="text"
                  name="heroTitle"
                  value={settings.heroTitle || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Welcome to Our Site"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 mb-2">
                Hero Subtitle
              </label>
              <input
                id="heroSubtitle"
                type="text"
                name="heroSubtitle"
                value={settings.heroSubtitle || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="We provide awesome services."
              />
            </div>
            
            {/* Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Icon Image Upload */}
              {renderUploadArea(
                'iconImage',
                'Icon Image (PNG/SVG only)',
                'image/png,image/svg+xml',
                iconImageRef,
                '1MB'
              )}
              
              {/* Favicon/Icon Upload */}
              {renderUploadArea(
                'icon',
                'Favicon/Icon (PNG/SVG only)',
                'image/png,image/svg+xml',
                iconRef,
                '1MB'
              )}
              
              {/* Hero Image Upload */}
              {renderUploadArea(
                'heroImage',
                'Hero Image (PNG, JPG, JPEG)',
                'image/png,image/jpeg,image/jpg',
                heroImageRef,
                '5MB'
              )}
            </div>
          </div>
        )}
        
        {/* Meta Data Tab */}
        {activeTab === 'meta' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  name="metaTitle"
                  value={settings.metaTitle || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Default Site Title"
                  required
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.metaTitle ? `${settings.metaTitle.length}/60 characters` : '0/60 characters'}
                </p>
              </div>
              
              <div>
                <label htmlFor="ogUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  OG URL
                </label>
                <input
                  id="ogUrl"
                  type="url"
                  name="ogUrl"
                  value={settings.ogUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourdomain.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={settings.metaDescription || ''}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Default meta description for SEO."
                required
                maxLength={160}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                {settings.metaDescription ? `${settings.metaDescription.length}/160 characters` : '0/160 characters'}
              </p>
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                id="author"
                type="text"
                name="author"
                value={settings.author || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Site Author"
              />
            </div>
          </div>
        )}
        
        {/* Save Button */}
        <div className="mt-8 flex space-x-4">
          <button
            type="submit"
            disabled={loading || Object.values(uploading).some(status => status === true)}
            className={`flex items-center justify-center px-6 py-3 ${loading || Object.values(uploading).some(status => status === true) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-md transition w-full md:w-auto`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Settings
              </>
            )}
          </button>
          
          {/* Reset button */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            disabled={loading || Object.values(uploading).some(status => status === true)}
            className={`flex items-center justify-center px-6 py-3 ${loading || Object.values(uploading).some(status => status === true) ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} text-gray-800 font-medium rounded-md transition md:w-auto`}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteCustomization;