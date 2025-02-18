import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUsername(userData.username);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUsername(null);
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-earthyBrown to-ochreYellow shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Site Title */}
        <h1 className="text-3xl font-bold text-white tracking-wide">
          <Link to="/">Indigenous Insights</Link>
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6">
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/dashboard" className="text-white text-lg hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/editor" className="text-white text-lg hover:underline">
                    Editor
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/about" className="text-white text-lg hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-white text-lg hover:underline">
                Contact
              </Link>
            </li>
            <li>
              {username ? (
                <div className="flex items-center gap-4">
                  <span className="text-white">Welcome, {username}!</span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-earthyBrown px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-earthyBrown px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
