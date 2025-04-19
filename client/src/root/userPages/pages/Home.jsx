import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Award, Users, BookOpen, Code, PenTool, Database } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    experts: 0,
    success: 0
  });

  // Animate stats on component mount
  useEffect(() => {
    const targetStats = {
      students: 10000,
      courses: 120,
      experts: 50,
      success: 95
    };

    const interval = setInterval(() => {
      setStats(prevStats => {
        const newStats = { ...prevStats };
        let completed = true;

        Object.keys(targetStats).forEach(key => {
          if (prevStats[key] < targetStats[key]) {
            const increment = Math.max(1, Math.floor(targetStats[key] / 20));
            newStats[key] = Math.min(targetStats[key], prevStats[key] + increment);
            completed = false;
          }
        });

        if (completed) clearInterval(interval);
        return newStats;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const featuredCourses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      image: "/api/placeholder/400/250",
      category: "Web Development",
      rating: 4.9,
      students: 1250,
      price: 149.99
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      image: "/api/placeholder/400/250",
      category: "AI & ML",
      rating: 4.8,
      students: 980,
      price: 179.99
    },
    {
      id: 3,
      title: "iOS App Development",
      image: "/api/placeholder/400/250",
      category: "Mobile Development",
      rating: 4.7,
      students: 820,
      price: 159.99
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn. <span className="text-purple-400">Grow.</span> Succeed.
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Gain cutting-edge tech skills with industry experts at AceTech Institute. Transform your future with our immersive learning experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors">
                  Explore Courses
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link to="/sign-up" className="border border-white hover:bg-white hover:text-gray-900 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors">
                  Join Today
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img 
                src="/api/placeholder/500/400" 
                alt="Learning Illustration" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-purple-600 mb-2">{stats.students.toLocaleString()}+</h3>
              <p className="text-gray-600">Students</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">{stats.courses}+</h3>
              <p className="text-gray-600">Courses</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-purple-600 mb-2">{stats.experts}+</h3>
              <p className="text-gray-600">Expert Instructors</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">{stats.success}%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular courses designed to help you master the skills needed for today's tech industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:transform hover:scale-105">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-purple-600 font-semibold mb-2">{course.category}</div>
                  <h3 className="text-xl font-bold mb-3">{course.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-700">{course.rating}</span>
                    </div>
                    <div className="text-gray-600 text-sm">{course.students} students</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">${course.price}</span>
                    <Link 
                      to={`/courses/${course.id}`} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/courses" 
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              View All Courses
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose AceTech Institute</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We provide an exceptional learning experience that sets our students up for success in the tech industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Industry-Recognized Certification</h3>
              <p className="text-gray-300">
                Earn certificates that are valued by top tech companies around the world.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Instructors</h3>
              <p className="text-gray-300">
                Learn from industry professionals with years of real-world experience.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Hands-on Projects</h3>
              <p className="text-gray-300">
                Apply your knowledge through practical projects that build your portfolio.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Comprehensive Curriculum</h3>
              <p className="text-gray-300">
                Our courses cover both foundational concepts and cutting-edge technologies.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <PenTool size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Learning</h3>
              <p className="text-gray-300">
                Self-paced courses with personalized feedback from instructors.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Database size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Job Placement Support</h3>
              <p className="text-gray-300">
                Career guidance and connections to hiring partners in the tech industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have advanced their careers with AceTech Institute's cutting-edge tech courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses" className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Courses
            </Link>
            <Link to="/sign-up" className="bg-transparent border-2 border-white hover:bg-white hover:text-purple-600 px-6 py-3 rounded-lg font-medium transition-colors">
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;