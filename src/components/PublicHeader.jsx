import React, { useState } from 'react';
import AboutModal from './AboutModal';

function PublicHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <div></div> 
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 font-semibold text-white bg-black bg-opacity-40 rounded-lg hover:bg-opacity-60 transition-colors"
            style={{ textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)' }}
          >
            About
          </button>
        </nav>
      </header>
      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default PublicHeader;