import React, { useState } from 'react';
import Header from '../components/Header';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Message sent! We\'ll get back to you soon.');
    // Here you would typically handle the form submission to your backend
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-xl">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-rose-400 tracking-tight mb-8">
            Contact Us
          </h1>

          {status && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
              {status}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-white/5 border border-red-200/20 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-white/5 border border-red-200/20 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-white mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 bg-white/5 border border-red-200/20 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full p-3 bg-white/5 border border-red-200/20 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full transform hover:scale-105 transition-all duration-300 
                       bg-gradient-to-r from-red-600 to-rose-700 text-white 
                       px-8 py-4 rounded-lg text-lg font-semibold 
                       shadow-lg hover:shadow-red-500/50"
            >
              Send Message
            </button>
          </form>

          <div className="mt-12 text-center text-gray-300">
            <p>Or reach us directly at:</p>
            <a 
              href="mailto:contact@indigenousinsights.com"
              className="text-red-300 hover:text-red-400 transition-colors"
            >
              contact@indigenousinsights.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 