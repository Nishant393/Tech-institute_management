import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../../../cofig/config";
import axios from "axios";

export default function CourseEditForm() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    about: "",
    description: "",
    avgRating: 0,
    enrolledStudent: 0,
    language: "",
    instructor: "",
    curriculam: [],
    whatYouWillLearn: [],
    duration: 1,
    skill: "Beginner",
    certificate: false,
    lecture: 1,
    courseUrl: {
      public_id: "",
      url: ""
    }
  });

  // New item input states
  const [newCurriculumItem, setNewCurriculumItem] = useState("");
  const [newLearningItem, setNewLearningItem] = useState("");

  // Fetch existing course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        setIsLoading(true);
        axios.get(`${server}course/${courseId}`,{withCredentials:true}).then((course)=>{
            console.log("data",course.data.course)
            setFormData(course.data.course);
        }).catch((e)=>{
            console.log(e)
        })
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Handle individual field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("courseUrl.")) {
      // Handle nested courseUrl fields
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        courseUrl: {
          ...formData.courseUrl,
          [field]: value
        }
      });
    } else {
      // Handle other fields
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : 
               (type === "number" ? Number(value) : value)
      });
    }
  };

  // New array handling functions
  const addCurriculumItem = () => {
    if (newCurriculumItem.trim() !== "") {
      setFormData({
        ...formData,
        curriculam: [...formData.curriculam, newCurriculumItem]
      });
      setNewCurriculumItem("");
    }
  };

  const removeCurriculumItem = (index) => {
    const updatedItems = [...formData.curriculam];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      curriculam: updatedItems
    });
  };

  const addLearningItem = () => {
    if (newLearningItem.trim() !== "") {
      setFormData({
        ...formData,
        whatYouWillLearn: [...formData.whatYouWillLearn, newLearningItem]
      });
      setNewLearningItem("");
    }
  };

  const removeLearningItem = (index) => {
    const updatedItems = [...formData.whatYouWillLearn];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      whatYouWillLearn: updatedItems
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        setIsLoading(true);
        console.log(formData.courseUrl)
        axios.put(`${server}course/update/${courseId}`, formData, {withCredentials:true}).then((course)=>{
            console.log("data",course.data)
            
        }).catch((e)=>{
            console.log(e)
        })
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
  };

  if (isLoading && !formData.title) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          
          <div>
            <label className="block mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">About *</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        
        {/* Course Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Average Rating</label>
              <input
                type="number"
                name="avgRating"
                min="0"
                max="5"
                step="0.1"
                value={formData.avgRating}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Enrolled Students</label>
              <input
                type="number"
                name="enrolledStudent"
                min="0"
                value={formData.enrolledStudent}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Language *</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Instructor *</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Duration (months) *</label>
              <input
                type="number"
                name="duration"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Number of Lectures *</label>
              <input
                type="number"
                name="lecture"
                min="1"
                value={formData.lecture}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-1">Skill Level *</label>
              <select
                name="skill"
                value={formData.skill}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
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
                id="certificate"
                className="mr-2"
              />
              <label htmlFor="certificate">Certificate Available</label>
            </div>
          </div>
        </div>
        
        {/* Course Content - IMPROVED ARRAY UI */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course Content</h2>
          
          {/* Curriculum Items */}
          <div>
            <label className="block mb-1">Curriculum *</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newCurriculumItem}
                onChange={(e) => setNewCurriculumItem(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-l"
                placeholder="Add new curriculum item"
              />
              <button 
                type="button" 
                onClick={addCurriculumItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            
            {/* Display curriculum items in sequence */}
            <div className="border rounded overflow-hidden mt-2">
              {formData.curriculam.length > 0 ? (
                formData.curriculam.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCurriculumItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500 text-center">No curriculum items added yet</div>
              )}
            </div>
          </div>
          
          {/* What You Will Learn Items */}
          <div>
            <label className="block mb-1">What You Will Learn *</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newLearningItem}
                onChange={(e) => setNewLearningItem(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-l"
                placeholder="Add new learning outcome"
              />
              <button 
                type="button" 
                onClick={addLearningItem}
                className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            
            {/* Display learning items in sequence */}
            <div className="border rounded overflow-hidden mt-2">
              {formData.whatYouWillLearn.length > 0 ? (
                formData.whatYouWillLearn.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-2 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLearningItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500 text-center">No learning outcomes added yet</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Course URL */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course URL</h2>
          
          <div>
            <label className="block mb-1">Public ID</label>
            <input
              type="text"
              name="courseUrl.public_id"
              value={formData.courseUrl?.public_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">URL</label>
            <input
              type="text"
              name="courseUrl.url"
              value={formData.courseUrl?.url}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)} // Go back to previous page
            className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}