import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { Eye, EyeOff, School, Check, ChevronDown } from 'lucide-react';
import server from '../../cofig/config';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!formData.email) {
      toast.error("Please enter email address");
      return;
    }

    setIsLoading(true);

    try {
      axios.post(`${server}otp/send-otp`, { email: formData.email }, { withCredentials: true }).then((e) => {
        setOtpSent(true);
        toast.success("otp send succsessfully ")
        setCurrentStep(2);
        console.log(e.data)

      }).catch((err) => {
        console.log(err)
        toast.error(err.response?.data?.message)

      })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length <= 1) {
      const newVerificationCode = [...verificationCode];
      newVerificationCode[index] = value;
      setVerificationCode(newVerificationCode);

      // Auto-focus next input
      if (value !== '' && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otp = verificationCode.join('');
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return false;
    }
    try {
      setIsLoading(true);
      axios.post(`${server}otp/verify-otp`, {
        email: formData.email,
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        otp
      }, { withCredentials: true }).then((e) => {

        navigate("/dashboard");
        toast.success("Email verified successfully");
        console.log(e)
      }).catch((err) => {
        console.log(err)
        toast.error(err.response?.data?.message || "Invalid OTP");

      })


    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full max-w-md">
      <form
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <div className="flex items-center justify-center mb-6">
          <School size={36} className="text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Institute Registration</h2>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-6">
          <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
              {currentStep > 1 ? <Check size={16} /> : 1}
            </div>
            <span className="text-xs mt-1">Details</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-0.5 w-full ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
          </div>
          <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
              {currentStep > 2 ? <Check size={16} /> : 2}
            </div>
            <span className="text-xs mt-1">Verify</span>
          </div>

        </div>

        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="tel"
              name="mobileNumber"
              placeholder="Contact Number"
              required
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              {isLoading ? "Processing..." : "Next: Verify Email"}
            </button>
          </div>
        )}

        {/* Step 2: Email Verification */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                We've sent a verification code to <span className="font-semibold">{formData.email}</span>
              </p>
              <div className="flex justify-center gap-2 my-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    className="w-10 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-bold"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Didn't receive the code? <button type="button" onClick={handleSendOTP} className="text-indigo-600 hover:underline">Resend</button>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </button>
            </div>
          </div>
        )}


        {currentStep === 1 && (
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already registered? {" "}
              <a
                href="/sign-in"
                className="text-indigo-600 hover:underline font-semibold"
              >
                Login
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignUp;