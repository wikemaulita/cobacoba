// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import heroImage from '../assets/images/hero.webp';
import baliImage from '../assets/images/bali.webp';

// Import icons for social media
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Home = () => {
  // Sample event data
  const events = [
    {
      id: 1,
      title: "Festival Budaya Bali",
      description: "Nikmati keindahan tarian dan ritual adat Bali dalam festival budaya tahunan yang spektakuler.",
      image: baliImage,
    },
    {
      id: 2,
      title: "Pameran Kesenian Jawa",
      description: "Pameran seni dan kerajinan tangan khas Jawa yang menampilkan keindahan budaya dan sejarah.",
      image: baliImage,
    },
    {
      id: 3,
      title: "Karnaval Budaya Nusantara",
      description: "Karnaval kolosal yang menampilkan keberagaman budaya dari seluruh penjuru Nusantara.",
      image: baliImage,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative flex items-center py-20 md:py-32 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Jelajah Budaya
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                Menyelami Keindahan Budaya Nusantara
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
                Jelajahi Sekarang
              </button>
            </div>
            
            <div className="bg-white bg-opacity-90 rounded-lg p-6 md:w-2/5">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tentang Jelajah Budaya
              </h2>
              <p className="text-gray-700 mb-4">
                Jelajah Budaya adalah platform yang menyediakan informasi tentang kekayaan budaya Nusantara. Kami berkomitmen untuk melestarikan dan memperkenalkan keragaman budaya Indonesia kepada masyarakat luas melalui berbagai program dan kegiatan.
              </p>
              <p className="text-gray-700">
                Dengan Jelajah Budaya, Anda dapat mengeksplorasi keunikan dan keindahan budaya Indonesia dari Sabang hingga Merauke. Bergabunglah dengan kami dalam petualangan budaya yang tak terlupakan!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Events Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Event Terbaru</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Link 
                    to={`/events/${event.id}`} 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section (Bonus) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Apa Kata Mereka</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">AS</span>
                </div>
                <div>
                  <h4 className="font-bold">Andi Setiawan</h4>
                  <p className="text-gray-600 text-sm">Pengunjung Festival</p>
                </div>
              </div>
              <p className="text-gray-700">"Festival Budaya Bali memberikan pengalaman yang luar biasa! Saya belajar banyak tentang budaya Bali yang kaya dan beragam."</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold">DP</span>
                </div>
                <div>
                  <h4 className="font-bold">Dewi Pratiwi</h4>
                  <p className="text-gray-600 text-sm">Seniman Lokal</p>
                </div>
              </div>
              <p className="text-gray-700">"Pameran Kesenian Jawa memberi kesempatan bagi seniman lokal seperti saya untuk menunjukkan karya dan melestarikan budaya."</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">RA</span>
                </div>
                <div>
                  <h4 className="font-bold">Rini Anggraini</h4>
                  <p className="text-gray-600 text-sm">Pelajar</p>
                </div>
              </div>
              <p className="text-gray-700">"Karnaval Budaya Nusantara memberikan wawasan baru tentang keberagaman Indonesia. Sangat informatif dan menyenangkan!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Jelajahi Budaya Indonesia Bersama Kami</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas Jelajah Budaya dan dapatkan informasi terbaru tentang event budaya di seluruh Indonesia.
          </p>
          <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300">
              Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Jelajah Budaya</h3>
              <p>Menyelami Keindahan Budaya Nusantara</p>
            </div>
            
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a href="#" className="text-white hover:text-gray-300 transition duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition duration-300">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>Jelajah Budaya - © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;