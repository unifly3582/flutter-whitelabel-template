import React from 'react';
import { contentConfig } from '../../config/content.js';

const HomePageVariantA = () => {
  const { headline, subheadline } = contentConfig.homePage;

  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-secondary text-white">
      <h1 className="text-5xl font-bold mb-4">
        ✨ {headline} (Variant A Layout) ✨
      </h1>
      <p className="text-xl mb-6">
        {subheadline} - This is a distinct look and feel!
      </p>
      <button className="bg-accent text-text-primary px-8 py-3 rounded-md font-bold hover:opacity-90 transition-opacity text-lg">
        Variant A CTA!
      </button>
    </div>
  );
};

export default HomePageVariantA; 