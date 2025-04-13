import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { School } from 'lucide-react';

const Auth = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-8 flex flex-col justify-center items-center text-center">
          <School size={64} className="mb-6 text-white" />
          <h1 className="text-3xl font-bold mb-4">AceTech Institute</h1>
          <p className="text-lg opacity-80 mb-6">
            Join our learning platform to teach courses and reach students worldwide.
          </p>
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Offering Courses In:</h3>
            <ul className="space-y-1 text-sm">
              <li className="bg-white/20 px-3 py-1 rounded-full">Web Development</li>
              <li className="bg-white/20 px-3 py-1 rounded-full">Data Science</li>
              <li className="bg-white/20 px-3 py-1 rounded-full">Digital Marketing</li>
              <li className="bg-white/20 px-3 py-1 rounded-full">UI/UX Design</li>
            </ul>
          </div>
          <Link 
            to="/" 
            className="w-full"
          >
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white font-semibold">
              Back to Home
            </button>
          </Link>
        </div>

        {/* Right Content Area (Outlet) */}
        <div className="md:w-3/5 p-8 md:p-12 flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Auth;