import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Google login failed: ${err.message}`);
      } else {
        setError('Google login failed');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');  // Redirect to dashboard after successful login
    } catch (err: unknown) {
      // Type checking for the error
      if (err instanceof Error) {
        setError(`Login failed: ${err.message}`);
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password</label>
            <input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
          <button type="button" onClick={handleGoogleLogin} className="w-full bg-red-500 text-white p-2 rounded mt-4">
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
}
