import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Users, 
  MessageSquare, 
  UserCog, 
  Palette, 
  MessageCircle, 
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react";
import axios from "axios";
import server from "../../cofig/config";

const AdminRoot = () => {
  const [expandedMenu, setExpandedMenu] = useState({
    courses: false,
    students: false
  });

  const toggleSubmenu = (menu) => {
    setExpandedMenu({
      ...expandedMenu,
      [menu]: !expandedMenu[menu]
    });
  };

  const handleLogout = () => {
    try {
        axios.post(`${server}user/logout`,{},{withCredentials:true}).then((d)=>{
            toast.success('Logged out successfully');

            getAuthUser()
        }).catch((e)=>{
            console.log(e)
        })
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-700 text-white flex flex-col">
        <div className="p-4 border-b border-purple-600">
          <h1 className="text-xl font-bold">Admin Portal</h1>
        </div>
        
        {/* Changed from "overflow-y-auto" to "overflow-y-hidden" to hide the scrollbar */}
        <nav className="flex-1 overflow-y-hidden py-4">
          {/* Added a div with custom scrollbar styling */}
          <div className="h-full overflow-y-auto scrollbar-hide">
            <ul className="space-y-1 px-2">
              <li>
                <NavLink 
                  to="/admin/dashboard" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg ${isActive ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-800'}`
                  }
                >
                  <Home size={18} className="mr-3" />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              
              {/* Course Management with Dropdown */}
              <li>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg text-purple-100 hover:bg-purple-800 cursor-pointer"
                  onClick={() => toggleSubmenu('courses')}
                >
                  <div className="flex items-center">
                    <BookOpen size={18} className="mr-3" />
                    <span>Course Management</span>
                  </div>
                  {expandedMenu.courses ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                
                {expandedMenu.courses && (
                  <ul className="pl-10 mt-1 space-y-1">
                    <li>
                      <NavLink 
                        to="/admin/courses" 
                        className={({ isActive }) => 
                          `block p-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600'}`
                        }
                      >
                        All Courses
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/admin/courses/create" 
                        className={({ isActive }) => 
                          `block p-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600'}`
                        }
                      >
                        Create Course
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              
              {/* Student Management with Dropdown */}
              <li>
                <div 
                  className="flex items-center justify-between p-3 rounded-lg text-purple-100 hover:bg-purple-800 cursor-pointer"
                  onClick={() => toggleSubmenu('students')}
                >
                  <div className="flex items-center">
                    <Users size={18} className="mr-3" />
                    <span>Student Management</span>
                  </div>
                  {expandedMenu.students ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                
                {expandedMenu.students && (
                  <ul className="pl-10 mt-1 space-y-1">
                    <li>
                      <NavLink 
                        to="/admin/students" 
                        className={({ isActive }) => 
                          `block p-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600'}`
                        }
                      >
                        All Students
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/admin/students/enrollment" 
                        className={({ isActive }) => 
                          `block p-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600'}`
                        }
                      >
                        Enrollment
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/admin/students/progress" 
                        className={({ isActive }) => 
                          `block p-2 rounded-md ${isActive ? 'bg-purple-600 text-white' : 'text-purple-200 hover:bg-purple-600'}`
                        }
                      >
                        Progress Tracking
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              
              {/* Other menu items */}
              <li>
                <NavLink 
                  to="/admin/communications" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg ${isActive ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-800'}`
                  }
                >
                  <MessageSquare size={18} className="mr-3" />
                  <span>Communications</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/admin/user-management" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg ${isActive ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-800'}`
                  }
                >
                  <UserCog size={18} className="mr-3" />
                  <span>User Management</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/admin/website-customization" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg ${isActive ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-800'}`
                  }
                >
                  <Palette size={18} className="mr-3" />
                  <span>Website Design</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink 
                  to="/admin/feedback" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg ${isActive ? 'bg-purple-800 text-white' : 'text-purple-100 hover:bg-purple-800'}`
                  }
                >
                  <MessageCircle size={18} className="mr-3" />
                  <span>Feedback</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-purple-600">
          <button onClick={handleLogout} className="flex items-center text-purple-100 hover:text-white w-full">
            <LogOut size={18} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin User</span>
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                A
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminRoot;