import React, { useState } from "react";
import axios from "axios";

// Helper function to get CSRF token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  }
});

const Signup = () => {
  // State for form steps
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!username || !email) {
      alert("Please enter both username and email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/send-otp/', {
        email,
        username
      });
      
      if (response.data.success) {
        setGeneratedOtp(response.data.otp);
        alert("OTP sent to your email.");
        setStep(2);
      } else {
        alert(response.data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      alert(error.response?.data?.error || "Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    if (otp === generatedOtp) {
      alert("OTP verified successfully.");
      setStep(3);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!username || !email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/register/', {
        username,
        email,
        password,
        confirm_password: confirmPassword
      });
      
      if (response.data.success) {
        alert("Account created successfully!");
        window.location.href = "/login";
      } else {
        alert(response.data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.detail || 
                         "Registration failed. Please check your details and try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-800 via-indigo-800 to-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Create Account
            </h2>
            <form onSubmit={sendOtp}>
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Verify OTP
            </h2>
            <form onSubmit={verifyOtp}>
              <div className="mb-4">
                <label className="block text-gray-700">Enter OTP</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Enter the OTP sent to your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-300"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Set Password
            </h2>
            <form onSubmit={createAccount}>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;