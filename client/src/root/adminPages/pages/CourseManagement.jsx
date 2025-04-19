import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, PlusCircle, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import axios from "axios";
import server from "../../../cofig/config.js";
import { Autocomplete, TextField } from "@mui/material";

const CourseManagement = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchData, setSearchData] = useState("");

  // Sample courses data
  const [courses, setCourses] = useState([]);
  const handleChange = (e) => {
    axios.get(`${server}course/search?keyword=${searchData}`, { withCredentials: true }).then((c) => {
      // setCourses(c.data.courses)
      setCourses(c.data.courses)
    }).catch((e)=>{
      console.log(e)
    })
  }
  const getCourses = () => {
    try {
      axios.get(`${server}course/get`, { withCredentials: true }).then((c) => {
        setCourses(c.data.courses)
        
      }).catch((e)=>{
        console.log(e)
      })
    } catch (error) {
      console.log(error)
    }
  }
  // Filter courses based on status
  const filteredCourses = filterStatus === "all"
    ? courses
    : courses.filter(course => course.status === filterStatus);

  useEffect(() => {
    getCourses()
  },[])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <Link
          to="/admin/courses/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          <span>Add New Course</span>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            
            <Autocomplete
              placeholder="Search anything"
              inputValue={searchData}
              freeSolo
              disableClearable
              options={courses}
              getOptionLabel={(option) => option.title || ''}
              onInputChange={(event, newInputValue) => {
                setSearchData(newInputValue);
                handleChange();
              }}
              // onChange={(event, value) => {
              //   if (value._id !== undefined) {
              //     navigate(`/p/${value._id}`)
              //   }
              // }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
           
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.instructor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.students}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{course.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/admin/courses/content/${course._id}`} className="text-indigo-600 hover:text-indigo-900">
                        <Eye size={18} />
                      </Link>
                      <Link to={`/admin/courses/edit/${course._id}`} className="text-blue-600 hover:text-blue-900">
                        <Edit size={18} />
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                      <div className="relative">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCourses.length}</span> of <span className="font-medium">{filteredCourses.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;