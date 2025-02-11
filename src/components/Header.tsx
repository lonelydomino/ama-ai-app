import { Link } from "react-router-dom";

const Header = () => {
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
            <li>
              <Link to="/" className="text-white text-lg hover:underline">
                Home
              </Link>
            </li>
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
              <Link to="/login" className="bg-white text-earthyBrown px-4 py-2 rounded-lg hover:bg-gray-200">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
