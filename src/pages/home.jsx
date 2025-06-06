import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import heroImage from '../assets/images/hero.webp'; // Pastikan path ini benar

import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { getEvents } from '@/lib/api';
import { Calendar, MapPin } from 'lucide-react';

const Home = () => {
  const [latestEvents, setLatestEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setErrorEvents(null); // Reset error state
        const response = await getEvents();

        // PERBAIKAN UTAMA: Pastikan response.data adalah array sebelum diolah
        if (response && Array.isArray(response.data)) {
          const sortedEvents = [...response.data].sort((a, b) => {
            // Tambahkan pengecekan jika date tidak valid
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (isNaN(dateA) || isNaN(dateB)) return 0; // Atau logika sortir lain jika tanggal tidak valid
            return dateB - dateA; // Urutkan dari yang terbaru
          });
          setLatestEvents(sortedEvents.slice(0, 3));
        } else {
          // Jika response.data bukan array, set ke array kosong atau tangani error
          console.warn("Expected response.data to be an array for events, but got:", response?.data);
          setLatestEvents([]);
          // Pertimbangkan untuk set error di sini jika format tidak sesuai harapan
          // setErrorEvents("Format data event tidak sesuai.");
        }
        setLoadingEvents(false);
      } catch (err) {
        console.error("Failed to fetch latest events:", err);
        setErrorEvents("Gagal memuat event terbaru. Silakan coba lagi nanti.");
        setLatestEvents([]); // Pastikan latestEvents adalah array kosong jika ada error
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex items-center py-20 md:py-32 bg-cover bg-center min-h-[70vh]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                Jelajah Budaya
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-lg mx-auto md:mx-0">
                Menyelami Keindahan Budaya Nusantara
              </p>
              <Link to="/user/events" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                Jelajahi Sekarang!
              </Link>
            </div>

            <div className="bg-white bg-opacity-90 rounded-xl p-8 md:w-2/5 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tentang Jelajah Budaya
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Jelajah Budaya adalah platform yang menyediakan informasi tentang kekayaan budaya Nusantara. Kami berkomitmen untuk melestarikan dan memperkenalkan keragaman budaya Indonesia kepada masyarakat luas melalui berbagai program dan kegiatan.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Dengan Jelajah Budaya, Anda dapat mengeksplorasi keunikan dan keindahan budaya Indonesia dari Sabang hingga Merauke. Bergabunglah dengan kami dalam petualangan budaya yang tak terlupakan!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Event Terbaru</h2>

          {loadingEvents ? (
            <div className="text-center text-gray-600">Memuat event...</div>
          ) : errorEvents ? (
            <div className="text-center text-red-500">{errorEvents}</div>
          ) : latestEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-xl transition-transform duration-300 hover:transform hover:scale-105 border border-gray-100">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg?height=400&width=800"}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{event.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-2" /> {event.date ? new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'}) : 'Tanggal tidak tersedia'}
                        <MapPin className="h-4 w-4 ml-4 mr-2" /> {event.location}, {event.region}
                    </div>
                    <Link
                      to={`/user/events/${event.id}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">Tidak ada event terbaru yang tersedia.</div>
          )}
        </div>
      </section>

      {/* Testimonial Section (Bonus) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Apa Kata Mereka</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial items */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">AS</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Andi Setiawan</h4>
                  <p className="text-gray-600 text-sm">Pengunjung Festival</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Festival Budaya Bali memberikan pengalaman yang luar biasa! Saya belajar banyak tentang budaya Bali yang kaya dan beragam."</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-red-600 font-bold">DP</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Dewi Pratiwi</h4>
                  <p className="text-gray-600 text-sm">Seniman Lokal</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Pameran Kesenian Jawa memberi kesempatan bagi seniman lokal seperti saya untuk menunjukkan karya dan melestarikan budaya."</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-green-600 font-bold">RA</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Rini Anggraini</h4>
                  <p className="text-gray-600 text-sm">Pelajar</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Karnaval Budaya Nusantara memberikan wawasan baru tentang keberagaman Indonesia. Sangat informatif dan menyenangkan!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Jelajahi Budaya Indonesia Bersama Kami</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Bergabunglah dengan komunitas Jelajah Budaya dan dapatkan informasi terbaru tentang event budaya di seluruh Indonesia.
          </p>
          <Link to="/register" className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-md">
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
              <a href="https://youtu.be/dQw4w9WgXcQ" className="text-white hover:text-gray-300 transition duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="https://youtu.be/dQw4w9WgXcQ" className="text-white hover:text-gray-300 transition duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="https://youtu.be/dQw4w9WgXcQ" className="text-white hover:text-gray-300 transition duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="https://youtu.be/dQw4w9WgXcQ" className="text-white hover:text-gray-300 transition duration-300">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
