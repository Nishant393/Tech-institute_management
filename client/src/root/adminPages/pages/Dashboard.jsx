import { 
    Users, 
    BookOpen, 
    GraduationCap, 
    MessageSquare,
    TrendingUp,
    Clock
  } from "lucide-react";
  
  const Dashboard = () => {
    // Sample data for the dashboard
    const statistics = [
      { title: "Total Students", value: 1245 , icon: <Users size={24} className="text-purple-500" /> },
      { title: "Active Courses", value: 42, icon: <BookOpen size={24} className="text-purple-500" /> },
      { title: "Completed Courses", value: 836, icon: <GraduationCap size={24} className="text-purple-500" /> },
      { title: "Pending Messages", value: 18, icon: <MessageSquare size={24} className="text-purple-500" /> },
    ];
  
    const recentActivities = [
      { id: 1, action: "New student enrollment", user: "John Doe", time: "10 minutes ago", course: "Advanced JavaScript" },
      { id: 2, action: "Course content updated", user: "Admin", time: "1 hour ago", course: "Web Development Bootcamp" },
      { id: 3, action: "Assignment submission", user: "Sarah Johnson", time: "2 hours ago", course: "Python Fundamentals" },
      { id: 4, action: "New review posted", user: "Michael Brown", time: "5 hours ago", course: "Data Science Essentials" },
      { id: 5, action: "Quiz completed", user: "Emily Wilson", time: "Yesterday", course: "UX Design Principles" },
    ];
  
    return (
      <div className="space-y-6 scrollbar-hide">
        <div className="flex items-center scrollbar-hide justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <div className="flex space-x-2">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              Export Report
            </button>
          </div>
        </div>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              <Clock size={20} className="text-gray-500" />
            </div>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-600">by {activity.user}</p>
                    <p className="text-sm text-purple-600">{activity.course}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Enrollment Trend Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Enrollment Trend</h2>
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Enrollment chart will appear here</p>
            </div>
          </div>
        </div>
  
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center justify-center transition">
              <Users size={24} className="text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Add Student</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center justify-center transition">
              <BookOpen size={24} className="text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">New Course</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center justify-center transition">
              <MessageSquare size={24} className="text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Send Message</span>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center justify-center transition">
              <GraduationCap size={24} className="text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">View Progress</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;