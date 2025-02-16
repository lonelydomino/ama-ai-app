import React from 'react';
import Header from '../components/Header';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-xl">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-rose-400 tracking-tight mb-8">
            About Indigenous Insights
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <p>
              Indigenous Insights is a platform dedicated to preserving and sharing indigenous knowledge 
              through modern technology. Our mission is to bridge the gap between traditional wisdom 
              and contemporary digital solutions.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300">
                <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
                <p className="text-gray-300">
                  To create a digital platform that respectfully preserves and shares indigenous 
                  knowledge while empowering communities to tell their own stories.
                </p>
              </div>

              <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300">
                <h2 className="text-xl font-bold text-white mb-3">Our Vision</h2>
                <p className="text-gray-300">
                  A world where indigenous wisdom is preserved, respected, and accessible for 
                  future generations through sustainable digital solutions.
                </p>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300">
                Have questions or want to learn more? Reach out to us at{' '}
                <a href="mailto:contact@indigenousinsights.com" 
                   className="text-red-300 hover:text-red-400 transition-colors">
                  contact@indigenousinsights.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 