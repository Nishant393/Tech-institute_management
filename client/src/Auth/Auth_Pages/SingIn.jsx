import React, { useState } from 'react';
import { useInputValidation } from "6pp";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { LogIn, Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const password = useInputValidation("");
  const email = useInputValidation("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login", 
        {
          email: email.value,
          password: password.value,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-xl shadow-xl p-8 space-y-6"
      >
        <div className="flex items-center justify-center mb-6">
          <LogIn size={48} className="text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email.value}
            onChange={email.changeHandler}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password.value}
              onChange={password.changeHandler}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right">
            <a 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
        >
          {isLoading ? (
            <span>Logging in...</span>
          ) : (
            <>
              <LogIn size={20} className="mr-2" />
              Login
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account? {" "}
            <a 
              href="/sign-up" 
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;