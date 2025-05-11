import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { themeConfig } from '../../config/theme.js';
import { contentConfig } from '../../config/content.js';

// Later, we'll get appName and logo from themeConfig/contentConfig
// import { themeConfig } from '../../config/theme'; 

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const appDisplayName = contentConfig.appName || themeConfig.appName;
  const logoPath = themeConfig.logoUrl;
  // const appName = themeConfig.appName || "MyApp"; // Fallback for app name
  // const logoUrl = themeConfig.logoUrl || "/default-logo.png"; // Fallback for logo

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login after logout
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Failed to log out:', error);
      // Handle logout error (e.g., show a notification)
    }
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {logoPath && <img className="h-8 w-auto mr-2" src={logoPath} alt={`${appDisplayName} Logo`} />}
              <span className="font-bold text-xl tracking-tight">
                {appDisplayName}
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            >
              Home
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/checkout"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                >
                  Checkout
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 