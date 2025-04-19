import React, { useEffect, useState } from 'react';
import { BookOpen, User, Star, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import server from '../../../cofig/config';
import { Link } from 'react-router-dom';



// Star rating component
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    className={`${i < Math.floor(rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : i < rating
                            ? "text-yellow-400 fill-yellow-400 opacity-50"
                            : "text-gray-300"
                        }`}
                />
            ))}
            <span className="ml-1 text-sm font-medium">{rating}</span>
        </div>
    );
};

// Course card component with animations
const CourseCard = ({ course }) => {
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(108, 92, 231, 0.1)" }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.courseUrl.url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold text-purple-700">
                    {course.skill}
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="bg-purple-100 text-purple-700 rounded-full px-3 py-1">{course.category}</span>
                </div>

                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{course.title}</h3>

                <div className="flex items-center mb-2 text-sm text-gray-600">
                    <User size={16} className="mr-1" />
                    <span>{course.instructor}</span>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <StarRating rating={course.avgRating} />
                    <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-1" />
                        <span>{course.duration} mo</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="font-bold text-lg text-purple-700">${course.price.toFixed(2)}</div>
                    <Link to={`/course/${course._id}`}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-lg transition-colors duration-300"
                    >
                        <Eye size={16} className="mr-1" />
                        <span>View</span>
                    </motion.button>
                        </Link>
                </div>
            </div>
        </motion.div>
    );
};

// Filter bar component
const FilterBar = ({ onFilterChange, activeFilter }) => {
    const filters = ["All", "Programming", "Data Science", "Design", "Marketing"];
    
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(filter => (
          <motion.button
            key={filter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === filter 
                ? "bg-purple-700 text-white" 
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </motion.button>
        ))}
      </div>
    );
  };

// Main Courses Page
export default function Courses() {

    const [courses, setCourses] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = courses.filter(course => {
        const matchesFilter = activeFilter === "All" || course.category === activeFilter;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    const getCourses = () => {
        try {
            axios.get(`${server}course/get`, { withCredentials: true }).then((c) => {
                setCourses(c.data.courses)
    
            }).catch((e) => {
                console.log(e)
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        getCourses()
    }, [])
    
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Courses</h1>
                    <p className="text-gray-600">Discover top-rated courses to boost your skills</p>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search courses or instructors..."
                            className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <FilterBar onFilterChange={setActiveFilter} activeFilter={activeFilter} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-600">No courses found matching your criteria</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
                    </div>
                )}
            </main>
        </div>
    );
}