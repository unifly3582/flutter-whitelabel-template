import React from 'react';
import Navbar from './Navbar.jsx';
// import Footer from './Footer'; // If you create a Footer component

const PageLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      {/* <Footer /> */}
      {/* <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        © {new Date().getFullYear()} OurApp. All rights reserved.
      </footer> */}
    </div>
  );
};

export default PageLayout; 