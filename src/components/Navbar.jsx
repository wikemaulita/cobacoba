import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 hover:text-red-600 transition duration-300"
            >
              Jelajah Budaya
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                to="/eventbudaya"
                className="text-gray-800 hover:text-red-600 px-3 py-2 font-medium transition duration-300"
              >
                Event
              </Link>
              <Link
                to="/pulau"
                className="text-gray-800 hover:text-red-600 px-3 py-2 font-medium transition duration-300"
              >
                Pulau
              </Link>
              <Link
                to="/login"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition duration-300"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
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

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden transition-all duration-300`}
      >
        <div className="backdrop-blur-lg bg-white bg-opacity-90 px-4 pt-2 pb-4 space-y-1 border-t border-gray-200">
          <Link
            to="/eventbudaya"
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
            Pulau
          </Link>
          <Link
            to="/login"
            className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
