import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Assuming you use react-toastify for notifications
import server from '../../../cofig/config';

const CreateCourse = () => {
  // Initial form state
  const initialState = {
    title: '',
    category: '',
    about: '',
    description: '',
    language: '',
    instructor: '',
    curriculam: [],
    whatYouWillLearn: [],
    duration: 1,
    skill: 'Beginner',
    certificate: false,
    lecture: 1,
  };

  // State hooks
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [courseImage, setCourseImage] = useState(null);
  const [curriculamItem, setCurriculamItem] = useState('');
  const [learnItem, setLearnItem] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setCourseImage(e.target.files[0]);
  };

  // Add item to curriculam array
  const addCurriculamItem = () => {
    if (curriculamItem.trim()) {
      setFormData({
        ...formData,
        curriculam: [...formData.curriculam, curriculamItem.trim()],
      });
      setCurriculamItem('');
    }
  };

  // Add item to whatYouWillLearn array
  const addLearnItem = () => {
    if (learnItem.trim()) {
      setFormData({
        ...formData,
        whatYouWillLearn: [...formData.whatYouWillLearn, learnItem.trim()],
      });
      setLearnItem('');
    }
  };

  // Remove item from curriculam array
  const removeCurriculamItem = (index) => {
    const updatedCurriculam = [...formData.curriculam];
    updatedCurriculam.splice(index, 1);
    setFormData({ ...formData, curriculam: updatedCurriculam });
  };

  // Remove item from whatYouWillLearn array
  const removeLearnItem = (index) => {
    const updatedLearn = [...formData.whatYouWillLearn];
    updatedLearn.splice(index, 1);
    setFormData({ ...formData, whatYouWillLearn: updatedLearn });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!courseImage) {
      toast.error('Please select a course image');
      return;
    }
    
    if (formData.curriculam.length === 0) {
      toast.error('Please add at least one curriculum item');
      return;
    }
    
    if (formData.whatYouWillLearn.length === 0) {
      toast.error('Please add at least one learning outcome');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a FormData object to send multipart/form-data
      const formDataToSend  = {
        title: formData.title,
        category: formData.category,
        about: formData.about,
        description: formData.description,
        language: formData.language,
        instructor: formData.instructor,
        curriculam: formData.curriculam,
        whatYouWillLearn:formData.whatYouWillLearn,
        duration: formData.duration,
        skill: formData.skill,
        certificate: formData.certificate,
        lecture: formData.lecture,
        courseImage:courseImage
      }
      
      // Append course image
      
      console.log(formDataToSend)
      // Send API request
      const response = await axios.post(`${server}course/add`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true 
      });
      
      toast.success('Course added successfully!');
      setFormData(initialState);
      setCourseImage(null);
      
      console.log('Course created:', response.data);
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error(error.response?.data?.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Course Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category*</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Language*</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Instructor*</label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Duration (months)*</label>
            <input
              type="number"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Number of Lectures*</label>
            <input
              type="number"
              name="lecture"
              min="1"
              value={formData.lecture}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Skill Level*</label>
            <select
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="certificate"
              checked={formData.certificate}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Certificate Available</label>
          </div>
        </div>
        
        {/* About & Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">About Course*</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="5"
              required
            ></textarea>
          </div>
        </div>
        
        {/* Course Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Course Image*</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        {/* Curriculum Items */}
        <div>
          <label className="block text-sm font-medium mb-1">Curriculum Items*</label>
          <div className="flex">
            <input
              type="text"
              value={curriculamItem}
              onChange={(e) => setCurriculamItem(e.target.value)}
              className="flex-grow p-2 border rounded-l"
              placeholder="Add curriculum item"
            />
            <button
              type="button"
              onClick={addCurriculamItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
            >
              Add
            </button>
          </div>
          
          <ul className="mt-2 space-y-1">
            {formData.curriculam.map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeCurriculamItem(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* What You Will Learn */}
        <div>
          <label className="block text-sm font-medium mb-1">What You Will Learn*</label>
          <div className="flex">
            <input
              type="text"
              value={learnItem}
              onChange={(e) => setLearnItem(e.target.value)}
              className="flex-grow p-2 border rounded-l"
              placeholder="Add learning outcome"
            />
            <button
              type="button"
              onClick={addLearnItem}
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
            >
              Add
            </button>
          </div>
          
          <ul className="mt-2 space-y-1">
            {formData.whatYouWillLearn.map((item, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeLearnItem(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Adding Course...' : 'Add Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;