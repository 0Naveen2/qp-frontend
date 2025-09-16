import React from 'react';

function AboutModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      {/* Modal content */}
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Project</h2>
        
        {/* Added scrolling for smaller screens */}
        <div className="text-gray-600 space-y-4 max-h-[70vh] overflow-y-auto pr-4">
          <p>
            The core idea of this project is to solve a common problem faced by students at Alliance University: the difficulty of finding and organizing <strong>previous year papers</strong> for exam preparation. This platform aims to create a single, centralized, and user-friendly web portal to replace scattered, inefficient resources.
          </p>
          <p>
            The motive is to empower students by giving them a reliable tool to aid their studies. It’s a collaborative platform where the community benefits, as any student can contribute by uploading new papers. Ultimately, the goal of the <strong>Previous Year Paper Archive</strong> is to save students time, reduce stress before exams, and build a lasting digital library that will benefit future batches of students.
          </p>

          <h3 className="text-xl font-semibold text-gray-700 mt-6 pt-4 border-t">
            Technologies Used
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <h4 className="font-bold text-gray-800">Backend</h4>
              <ul className="list-disc list-inside text-sm">
                <li>Java & Spring Boot</li>
                <li>Spring Security & JWT</li>
                <li>Spring Data JPA (Hibernate)</li>
                <li>PostgreSQL Database</li>
                <li>Spring Mail for Verification</li>
                <li>Maven</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Frontend</h4>
              <ul className="list-disc list-inside text-sm">
                <li>React & Vite</li>
                <li>React Router</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
