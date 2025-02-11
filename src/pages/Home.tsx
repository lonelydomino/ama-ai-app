import React from 'react';
import Header from '../components/Header'; // Updated import path

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Component */}
      <Header />

      {/* Main Content with added margin-top */}
      <div className="flex items-center justify-center p-8 mt-12">
        {/* Larger Circular Container */}
        <div className="relative w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full border-2 border-gray-300">
          {/* Center: Generate Report Button (Even Bigger) */}
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       bg-blue-500 text-white py-6 px-12 rounded-full text-2xl hover:bg-blue-600"
          >
            Generate Report
          </button>

          {/* Top: Upload Documents Button */}
          <button
            className="absolute top-0 left-1/2 transform -translate-x-1/2 
                       bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600"
          >
            Upload Documents
          </button>

          {/* Right: Upload Media Button with extra spacing */}
          <button
            className="absolute top-1/2 right-0 transform translate-x-[20px] -translate-y-1/2 
                       bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600"
          >
            Upload Media
          </button>

          {/* Left: Upload Audio Button with extra spacing */}
          <button
            className="absolute top-1/2 left-0 transform -translate-x-[20px] -translate-y-1/2 
                       bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
          >
            Upload Audio
          </button>

          {/* Bottom: Type Context Box with increased width */}
          <textarea
            placeholder="Type context..."
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                       bg-white border border-gray-300 rounded-lg p-2 resize-none
                       w-64 h-16"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
