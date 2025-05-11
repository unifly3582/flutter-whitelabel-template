// src/config/theme.js
export const themeConfig = {
  appName: "Default App Name", // Global app name fallback
  logoUrl: "/default-logo.png", // Path relative to public folder
  fontFamily: {
    primary: "'Inter', sans-serif", // Example primary font
    secondary: "'Roboto', sans-serif", // Example secondary font
  },
  colors: {
    primary: "#4F46E5",    // Indigo-600
    secondary: "#10B981",  // Emerald-500
    accent: "#F59E0B",     // Amber-500
    background: "#F9FAFB", // Gray-50
    textPrimary: "#1F2937",  // Gray-800
    textSecondary: "#4B5563", // Gray-600
  },
  borderRadius: {
    small: '0.25rem', // 4px
    medium: '0.5rem', // 8px
    large: '0.75rem', // 12px
    full: '9999px',
  },
}; 