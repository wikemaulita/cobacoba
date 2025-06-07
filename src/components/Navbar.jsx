import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

// Import icons for social media
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDashboardClick = () => {
    if (user) {
      if (user.role === 'SUPER_ADMIN') {
        navigate('/super-admin/dashboard');
      } else if (user.role === 'ADMIN_DAERAH') {
        navigate('/admin-daerah/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-lg bg-white bg-opacity-70 shadow-md py-3"
          : "backdrop-blur-sm bg-white bg-opacity-30 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 hover:text-red-600 transition duration-300"
            >
              Jelajah Budaya
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link to="/user/events" className="text-gray-800 hover:text-red-600 px-3 py-2 font-medium transition duration-300"> {/* Diperbarui ke /events */}
                Event
              </Link>
              <Link to="/pulau" className="text-gray-800 hover:text-red-600 px-3 py-2 font-medium transition duration-300">
                Provinsi
              </Link>

              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className="text-gray-800 hover:text-red-600 px-3 py-2 font-medium transition duration-300"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition duration-300">
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden transition-all duration-300`}
      >
        <div className="backdrop-blur-lg bg-white bg-opacity-90 px-4 pt-2 pb-4 space-y-1 border-t border-gray-200">
          <Link
            to="/user/events" 
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Event
          </Link>
          <Link
            to="/pulau"
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Provinsi
          </Link>
          {isLoggedIn ? (
            <>
              <button
                onClick={handleDashboardClick}
                className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;