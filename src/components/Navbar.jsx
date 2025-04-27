import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { UserIcon } from '@heroicons/react/24/outline'

function Navbar() {
  const navigate = useNavigate()

  // Simulasi login, ganti sesuai autentikasi kamu
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/Akun')
    } else {
      navigate('/Login')
    }
  }

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Logo kiri */}
      <Link to="/" className="text-2xl font-bold text-blue-700">
        Jelajah Budaya
      </Link>

      {/* Menu kanan */}
      <div className="flex items-center gap-6">
        <Link to="/Pulau" className="text-gray-700 hover:text-blue-700 font-medium">Pulau</Link>
        <Link to="/Event" className="text-gray-700 hover:text-blue-700 font-medium">Event Budaya</Link>

        {/* Search box */}
        <input
          type="text"
          placeholder="Cari..."
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Akun */}
        <button
          onClick={handleAccountClick}
          className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          <UserIcon className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-700">Akun</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
