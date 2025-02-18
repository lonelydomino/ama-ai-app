import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      const data = await response.json();
      console.log(data);
      localStorage.setItem('accessToken', data.access_token);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Sign up failed: ${err.message}`);
      } else {
        setError('Sign up failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-800 to-rose-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto backdrop-blur-lg bg-white/10 p-8 rounded-xl">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-rose-400 tracking-tight text-center mb-8">
            Sign Up
          </h2>
          {error && <p className="text-rose-300 text-center mb-4">{error}</p>}
          <form onSubmit={handleSignUp} className="space-y-6">
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
              <label htmlFor="username" className="block text-white mb-2">Username</label>
              <input 
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <div>
              <label htmlFor="confirmPassword" className="block text-white mb-2">Confirm Password</label>
              <input 
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-white/5 border border-red-200/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-red-600 to-rose-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-red-500/50"
            >
              Sign Up
            </button>
            <p className="text-center text-gray-300 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-red-300 hover:text-red-400 transition-colors"
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 