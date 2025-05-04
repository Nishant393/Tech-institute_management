import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Users, BookOpen, Code, PenTool, Database, Loader } from 'lucide-react';
import server from '../../../cofig/config';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [recordedCourses, setRecordedCourses] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const getSiteSettings = async () => {
    try {
      const { data } = await axios.get(`${server}site-settings`);
      return data;
    } catch (error) {
      toast.error('Failed to load site settings');
      console.error(error);
      return null;
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${server}recorded/get?page=${1}`);
      setRecordedCourses(data.courses);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch recorded courses');
      console.error(error);
    }
  };

  const getCourses = async () => {
    try {
      const { data } = await axios.get(`${server}course/get`, { withCredentials: true });
      setFeaturedCourses(data.courses);
    } catch (error) {
      toast.error('Failed to fetch featured courses');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Use Promise.all to fetch data concurrently
        await Promise.all([
          getCourses(),
          fetchCourses(),
          getSiteSettings().then(data => setMeta(data))
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-purple-700 text-lg font-medium">Loading AceTech Institute...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section - Fully Responsive */}
      <section className="relative bg-gradient-to-br from-purple-800 to-purple-600 text-white pt-20 md:pt-32 pb-16 md:pb-20 px-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-500 opacity-20 transform rotate-12 translate-x-1/4 hidden md:block"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
              <div className="bg-purple-900 bg-opacity-30 p-2 rounded-lg inline-block mb-3 md:mb-4">
                <span className="text-purple-200 text-sm md:text-base font-medium">Welcome to AceTech Institute</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                {meta?.heroTitle || "Master Tech Skills for the Future"}
              </h1>
              <p className="text-lg md:text-xl mb-6 md:mb-8 text-purple-100">
                {meta?.heroSubtitle || "Join our expert-led courses and transform your career with cutting-edge skills in programming, design, and digital innovation."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link to="/courses" className="bg-white text-purple-700 px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-medium flex items-center justify-center transition-colors hover:bg-purple-100 text-sm md:text-base">
                  Explore Courses
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link to="/sign-up" className="border border-white hover:bg-white hover:text-purple-700 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-medium flex items-center justify-center transition-colors text-sm md:text-base">
                  Join Today
                </Link>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative scale-75 md:scale-90 lg:scale-100">
                {/* Decorative elements with responsive sizing */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl transform rotate-3"></div>
                <div className="absolute inset-0 w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl shadow-2xl transform -rotate-3 -translate-x-3 translate-y-3 md:-translate-x-4 md:translate-y-4"></div>
                <div className="absolute inset-0 w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-white rounded-xl shadow-2xl overflow-hidden">
                  {meta?.heroImage?.url ? (
                    <img 
                      src={meta.heroImage.url} 
                      alt={meta.heroImage.public_id || "AceTech Hero"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-300 flex items-center justify-center">
                      <div className="text-purple-800 text-center p-4 md:p-6">
                        <BookOpen size={48} className="mx-auto mb-3 md:mb-4" />
                        <h3 className="text-lg md:text-xl font-bold">Transform Your Career</h3>
                        <p className="text-xs md:text-sm mt-2">Learn, Practice, Succeed</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses - Responsive Grid */}
      <section className="py-12 md:py-16 bg-white px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-3 md:mb-4">Featured Courses</h2>
          </div>
          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {featuredCourses.map(course => (
                <div key={course._id} className="bg-purple-50 rounded-lg overflow-hidden shadow hover:shadow-lg hover:scale-102 transition-all duration-300">
                  <img 
                    src={course.courseUrl?.url || '/placeholder-course.jpg'} 
                    alt={course.title} 
                    className="w-full h-40 md:h-48 object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-course.jpg';
                    }}
                  />
                  <div className="p-4 md:p-6">
                    <div className="text-xs md:text-sm text-purple-600 font-semibold mb-1 md:mb-2">{course.category}</div>
                    <h3 className="text-lg md:text-xl font-bold text-purple-900 mb-2 md:mb-3 line-clamp-2">{course.title}</h3>
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                      <div className="text-purple-600 text-sm">{course.avgRating || '4.5'} ★</div>
                      <div className="text-purple-500 text-xs md:text-sm">{course.lecture || 0} lecture</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base md:text-lg font-bold text-purple-800">₹{course.price}</span>
                      <Link to={`/courses/${course._id}`} className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-10">
              <p className="text-purple-600">No featured courses available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recorded Courses Section - Responsive */}
      <section className="py-12 md:py-16 bg-purple-100 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-3 md:mb-4">Recorded Courses</h2>
            <p className="text-purple-700 max-w-2xl mx-auto text-sm md:text-base">
              Learn at your own pace with our pre-recorded, expert-led video courses.
            </p>
          </div>
          {recordedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              {recordedCourses.map(course => (
                <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={course.thumbnail || '/placeholder-course.jpg'} 
                    alt={course.title} 
                    className="w-full h-40 md:h-48 object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-course.jpg';
                    }}
                  />
                  <div className="p-4 md:p-6">
                    <div className="text-xs md:text-sm text-purple-600 font-semibold mb-1 md:mb-2">{course.category}</div>
                    <h3 className="text-lg md:text-xl font-bold text-purple-900 mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                      <span className="text-purple-600 text-sm">{course.rating || '4.0'} ★</span>
                      <span className="text-xs md:text-sm text-purple-700">{course.videos?.length || 0} videos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base md:text-lg font-bold text-purple-800">{course.isPaid ? "₹" + course.price : "Free"}</span>
                      <Link to={`/rcourse/${course._id}`} className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-10">
              <p className="text-purple-600">No recorded courses available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section - Responsive */}
      <section className="py-12 md:py-16 bg-purple-800 text-white px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Why Choose AceTech Institute</h2>
            <p className="text-purple-200 max-w-2xl mx-auto text-sm md:text-base">
              Gain real-world skills with industry experts and practical learning experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                Icon: Award,
                title: "Industry Certification",
                description: "Globally recognized certificates."
              },
              {
                Icon: Users,
                title: "Expert Instructors",
                description: "Learn from top-tier professionals."
              },
              {
                Icon: Code,
                title: "Hands-on Projects", 
                description: "Real projects to build your portfolio."
              },
              {
                Icon: BookOpen,
                title: "Comprehensive Curriculum",
                description: "Deep dive into fundamentals and trends."
              },
              {
                Icon: PenTool,
                title: "Personalized Learning",
                description: "Adaptive learning paths for each student."
              },
              {
                Icon: Database,
                title: "Job Support",
                description: "Access to hiring partners & coaching."
              }
            ].map((item, index) => (
              <div key={index} className="bg-purple-700 p-4 md:p-6 rounded-lg hover:bg-purple-600 transition-colors">
                <div className="bg-white text-purple-700 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <item.Icon size={20} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm md:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;