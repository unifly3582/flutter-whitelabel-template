import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { contentConfig } from '../../config/content.js';

const HomePage = () => {
  const { currentUser } = useAuth();
  const { headline, subheadline, ctaButtonText } = contentConfig.homePage;

  return (
    <div className="flex flex-col items-center justify-center text-center p-10">
      <h1 className="text-4xl font-bold text-text-primary mb-4">
        {headline}
      </h1>
      <p className="text-lg text-text-secondary mb-6">
        {subheadline}
      </p>
      {!currentUser && (
        <button className="bg-accent text-white px-6 py-3 rounded-md font-semibold hover:opacity-90">
          {ctaButtonText}
        </button>
      )}
      {currentUser ? (
        <p className="text-md text-secondary mt-4">
          You are logged in as {currentUser.phoneNumber}.
        </p>
      ) : null}
    </div>
  );
};

export default HomePage; 