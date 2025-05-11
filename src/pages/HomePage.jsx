import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // To display welcome message

// Later, we'll get appName from contentConfig
// import { contentConfig } from '../config/content';

const HomePage = () => {
  const { currentUser } = useAuth();
  // const appName = contentConfig.appName || "My Awesome App"; // Fallback

  return (
    <div className="flex flex-col items-center justify-center text-center p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {/* Welcome to {appName} */}
        Welcome to Our App!
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        This is the homepage. We will make this much more configurable later!
      </p>
      {currentUser ? (
        <p className="text-md text-green-600">
          You are logged in as {currentUser.phoneNumber}.
        </p>
      ) : (
        <p className="text-md text-indigo-600">
          Please log in or sign up to continue.
        </p>
      )}
    </div>
  );
};

export default HomePage; 