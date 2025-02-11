import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  if (!user) return null; // Wait for user data to load

  return (
    <div className="flex h-screen items-center justify-center bg-blue-500 text-white text-4xl">
      Welcome to the Dashboard, {user.displayName || 'User'}!
    </div>
  );
}
