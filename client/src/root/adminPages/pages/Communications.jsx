import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import server from '../../../cofig/config';
import {useUserContext} from "../../../Provider/AuthContext"

const Communications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { user } = useUserContext();
  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [mainLink, setMainLink] = useState('');
  const [anchorLinks, setAnchorLinks] = useState([{ label: '', url: '' }]);
  const [emailImage, setEmailImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // API base URL - replace with your actual API endpoint
  const API_BASE_URL = '/api';

  // Fetch all notifications on component mount
  useEffect(() => {
    fetchAllNotifications();
  }, []);

  // Fetch all notifications
  const fetchAllNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}notify`,{withCredentials:true});
      if (response.data.success) {
        setNotifications(response.data.notifications);
        toast.success(`Loaded ${response.data.count} notifications`);
      }
    } catch (error) {
      toast.error(`Error fetching notifications: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notification by ID
  const fetchNotificationById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}notify/${id}`);
      if (response.data.success) {
        setSelectedNotification(response.data.notification);
        toast.success('Notification details loaded');
        
        // Populate form fields for editing if needed
        populateFormFields(response.data.notification);
      }
    } catch (error) {
      toast.error(`Error fetching notification: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create new notification
  const createNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create form data for file upload
      const formData  = {
        "title":title,
        "message":message,
        "mainLink":mainLink,
        "anchorLinks":anchorLinks,
        "emailImage":emailImage,
        "sentBy":user.id
      };
     
      console.log(formData)
      const response = await axios.post(`${server}notify`, formData, {
        withCredentials:true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Notification created and sent successfully!');
        resetForm();
        fetchAllNotifications(); // Refresh list
      }
    } catch (error) {
      toast.error(`Failed to create notification: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Populate form fields with notification data for viewing/editing
  const populateFormFields = (notification) => {
    setTitle(notification.title || '');
    setMessage(notification.message || '');
    setMainLink(notification.mainLink || '');
    
    if (notification.anchorLinks && notification.anchorLinks.length > 0) {
      setAnchorLinks(notification.anchorLinks);
    } else {
      setAnchorLinks([{ label: '', url: '' }]);
    }
    
    // Set image preview if available
    if (notification.image && notification.image.url) {
      setImagePreview(notification.image.url);
    } else {
      setImagePreview(null);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setMessage('');
    setMainLink('');
    setAnchorLinks([{ label: '', url: '' }]);
    setEmailImage(null);
    setImagePreview(null);
    setSelectedNotification(null);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmailImage(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle anchor links changes
  const handleAnchorLinksChange = (index, field, value) => {
    const updatedLinks = [...anchorLinks];
    updatedLinks[index][field] = value;
    setAnchorLinks(updatedLinks);
  };

  // Add more anchor links
  const addAnchorLink = () => {
    setAnchorLinks([...anchorLinks, { label: '', url: '' }]);
  };

  // Remove anchor link
  const removeAnchorLink = (index) => {
    if (anchorLinks.length > 1) {
      const updatedLinks = anchorLinks.filter((_, i) => i !== index);
      setAnchorLinks(updatedLinks);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      
      <h1 className="text-3xl font-bold mb-6 text-blue-800">
        Tech Management Institute - Notification System
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Notification Creation Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedNotification ? 'View Notification Details' : 'Create New Notification'}
          </h2>
          
          <form onSubmit={createNotification}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
                disabled={loading}
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Main Link (Optional)</label>
              <input
                type="url"
                value={mainLink}
                onChange={(e) => setMainLink(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
                disabled={loading}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Anchor Links
                <button 
                  type="button" 
                  onClick={addAnchorLink}
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-md text-sm"
                  disabled={loading}
                >
                  + Add Link
                </button>
              </label>
              
              {anchorLinks.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleAnchorLinksChange(index, 'label', e.target.value)}
                    className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link Label"
                    disabled={loading}
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => handleAnchorLinksChange(index, 'url', e.target.value)}
                    className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                  {anchorLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAnchorLink(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md"
                      disabled={loading}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || selectedNotification}
              />
              
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-auto max-h-40 rounded-md"
                  />
                </div>
              )}
            </div>
            
            {!selectedNotification && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create & Send Notification'}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md w-full"
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            )}
            
            {selectedNotification && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md w-full"
              >
                Close Details
              </button>
            )}
          </form>
        </div>
        
        {/* Notifications List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent Notifications</h2>
            <button
              onClick={fetchAllNotifications}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notifications found.</p>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className="border-b border-gray-200 py-4 last:border-b-0"
                >
                  <h3 className="text-lg font-medium text-blue-700">{notification.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{notification.message}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()} • 
                      {notification.recipients?.length || 0} recipients
                    </span>
                    
                    <button
                      onClick={() => fetchNotificationById(notification._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communications;