import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext.jsx';
// import { useNavigate } from 'react-router-dom'; // We'll add this when routing is set up

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const { currentUser } = useAuth();
  // const navigate = useNavigate(); // For redirection after login

  // If user is already logged in, redirect (we'll add proper routing later)
  useEffect(() => {
    if (currentUser) {
      console.log("User already logged in, redirecting...");
      // navigate('/'); // Example redirect to homepage
    }
  }, [currentUser/*, navigate*/]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible', // Can also be 'normal'
        'callback': (response) => {
          console.log("reCAPTCHA resolved");
        },
        'expired-callback': () => {
          setError("reCAPTCHA response expired. Please try again.");
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.render().then(widgetId => {
              window.recaptchaVerifier.reset(widgetId);
            });
          }
        }
      });
      window.recaptchaVerifier.render().catch(err => {
        setError("Failed to render reCAPTCHA: " + err.message);
        console.error("reCAPTCHA render error:", err);
      });
    }
  };

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    if (!window.recaptchaVerifier) {
        setError("reCAPTCHA not initialized. Please refresh.");
        setLoading(false);
        return;
    }
    
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setError('');
      alert('OTP sent successfully!');
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(`Failed to send OTP: ${err.message}. Ensure the phone number is correct and enabled for testing in Firebase console if it's a test number, or that reCAPTCHA verified correctly.`);
      if (window.recaptchaVerifier) {
         window.recaptchaVerifier.render().then(function(widgetId) {
            grecaptcha.reset(widgetId);
         });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!confirmationResult) {
      setError("No OTP confirmation result found. Please request OTP first.");
      setLoading(false);
      return;
    }
    try {
      const result = await confirmationResult.confirm(otp);
      console.log("User signed in successfully:", result.user);
      setError('');
      alert('Login Successful!');
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(`Failed to verify OTP: ${err.message}. Check if OTP is correct.`);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <p className="text-xl font-semibold">You are already logged in as {currentUser.phoneNumber}.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login with OTP</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}

        {!showOtpInput ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (with country code e.g., +1xxxxxxxxxx)
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g., +12345678900"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                maxLength="6"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
                type="button"
                onClick={() => {
                    setShowOtpInput(false);
                    setError('');
                    setOtp('');
                }}
                className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Change Phone Number
            </button>
          </form>
        )}
        <div id="recaptcha-container" className="mt-4 flex justify-center"></div>
      </div>
    </div>
  );
};

export default LoginPage; 