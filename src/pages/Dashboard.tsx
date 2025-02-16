import React from 'react';
import Header from '../components/Header';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      {/* Header Component */}
      <Header />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center p-8 mt-8">
          {/* Main Circular Interface */}
          <div className="relative w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full 
                        border-2 border-red-200/20 backdrop-blur-lg bg-white/10
                        transition-all duration-300">
            {/* Center Button */}
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        bg-gradient-to-r from-red-600 to-rose-700 text-white py-6 px-12 
                        rounded-full text-2xl hover:shadow-red-500/50 hover:scale-105 
                        transition-all duration-300"
            >
              Generate Report
            </button>

            {/* Top: Upload Documents Button */}
            <button
              className="absolute top-0 left-1/2 transform -translate-x-1/2 
                        bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 
                        rounded-full hover:shadow-red-500/50 hover:scale-105 
                        transition-all duration-300"
            >
              Upload Documents
            </button>

            {/* Right: Upload Media Button */}
            <button
              className="absolute top-1/2 right-0 transform translate-x-[20px] -translate-y-1/2 
                        bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 
                        rounded-full hover:shadow-red-500/50 hover:scale-105 
                        transition-all duration-300"
            >
              Upload Media
            </button>

            {/* Left: Upload Audio Button */}
            <button
              className="absolute top-1/2 left-0 transform -translate-x-[20px] -translate-y-1/2 
                        bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 px-4 
                        rounded-full hover:shadow-red-500/50 hover:scale-105 
                        transition-all duration-300"
            >
              Upload Audio
            </button>

            {/* Bottom: Type Context Box */}
            <textarea
              placeholder="Type context..."
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 
                        bg-white/10 border border-red-200/20 rounded-lg p-2 resize-none
                        w-64 h-16 text-white placeholder-red-200/50 focus:outline-none 
                        focus:ring-2 focus:ring-red-500"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
