import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-12 animate-fadeIn">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-rose-400 tracking-tight">
            Indigenous Insights
          </h1>
          
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Bridging ancient wisdom with modern technology to preserve and share indigenous cultures
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link 
              to="/dashboard" 
              className="transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-red-600 to-rose-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-red-500/50"
            >
              Enter Dashboard
            </Link>
            <Link 
              to="/about" 
              className="transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-rose-700 to-red-800 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-rose-500/50"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Discover</h3>
              <p className="text-gray-300">Explore rich cultural heritage and traditions</p>
            </div>
            <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Connect</h3>
              <p className="text-gray-300">Bridge the gap between past and present</p>
            </div>
            <div className="backdrop-blur-lg bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Learn</h3>
              <p className="text-gray-300">Immerse yourself in indigenous knowledge</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 