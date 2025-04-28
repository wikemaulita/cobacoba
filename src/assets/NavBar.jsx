// src/assets/NavBar.jsx
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="flex justify-between items-center px-10 py-4">
        <span className="text-3xl font-bold">Logo</span>
        <ul className="flex gap-8 text-lg">
          <li><Link to="/home">Who are we</Link></li>
          <li><Link to="/pulau">Pulau</Link></li>
          <li><Link to="/eventbudaya">Event Budaya</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
