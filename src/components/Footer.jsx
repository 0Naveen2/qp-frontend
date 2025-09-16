import React from 'react';

// The component now accepts a 'theme' prop, defaulting to 'light'
function Footer({ theme = 'light' }) {
  const currentYear = new Date().getFullYear();

  // Conditionally set styles based on the theme prop
  const isDarkTheme = theme === 'dark';
  const footerClasses = isDarkTheme
    ? 'w-full text-white text-center py-4 text-sm mt-auto' // Styles for dark background pages
    : 'w-full bg-white shadow-inner text-gray-600 text-center py-6 mt-auto'; // Styles for light background pages
  
  const textShadowStyle = isDarkTheme 
    ? { textShadow: '0px 1px 4px rgba(0, 0, 0, 0.7)' } 
    : {};

  return (
    <footer className={footerClasses} style={textShadowStyle}>
      <div className="container mx-auto px-6">
        <p>
          Copyright © {currentYear} Alliance University. All Rights Reserved.
        </p>
        <p className={`text-xs mt-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-500'}`}>
          Developed by Naveen Kumar, Deepak Kumar, HansRaj
        </p>
      </div>
    </footer>
  );
}

export default Footer;