import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: LoginResponse = await response.json();
      
      // Store auth token
      localStorage.setItem('accessToken', data.access_token);
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Add token to all future requests
      setupAuthHeader(data.access_token);
      
      console.log(`🎉 Successfully logged in as ${data.user.username}`);
      
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Login failed: ${err.message}`);
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-xl">
          <Link 
            to="/" 
            className="block text-center text-red-300 hover:text-red-400 transition-colors mb-8"
          >
            ← Back to Home
          </Link>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-rose-400 tracking-tight text-center mb-8">
            Login
          </h2>
          {error && <p className="text-rose-300 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white/5 border border-red-200/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-white/5 border border-red-200/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-red-600 to-rose-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-red-500/50"
            >
              Login
            </button>
            <p className="text-center text-gray-300 mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-red-300 hover:text-red-400 transition-colors"
              >
                Sign up here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function to set up authentication header
function setupAuthHeader(token: string) {
  if (token) {
    window.localStorage.setItem('accessToken', token);
  }
}
