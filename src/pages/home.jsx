import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import heroImage from '../assets/images/hero.webp'; 
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
        setErrorEvents(null); 
        const response = await getEvents();

        // PERBAIKAN: Mengakses data dari response.data.event.data
        if (response.data && response.data.event && Array.isArray(response.data.event.data)) {
          const allEvents = response.data.event.data;
          // Mengurutkan event berdasarkan tanggal terbaru (descending)
          const sortedEvents = [...allEvents].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
          setLatestEvents(sortedEvents.slice(0, 3)); // Ambil 3 event terbaru
        } else {
          console.warn("Struktur API untuk event tidak sesuai harapan.", response.data);
          setLatestEvents([]);
        }
        setLoadingEvents(false);
      } catch (err) {
        console.error("Failed to fetch latest events:", err);
        setErrorEvents("Gagal memuat event terbaru. Silakan coba lagi nanti.");
        setLatestEvents([]); 
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
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
              <Link to="/events" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
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
                      src={event.gambar || "/placeholder.svg?height=400&width=800"}
                      alt={event.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{event.nama}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{event.deskripsi}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-2" /> {event.tanggal ? new Date(event.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'}) : 'Tanggal tidak tersedia'}
                        <MapPin className="h-4 w-4 ml-4 mr-2" /> {event.lokasi}, {event.daerah?.nama || 'N/A'}
                    </div>
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
          ) : (
            <div className="text-center text-gray-600">Tidak ada event terbaru yang tersedia.</div>
          )}
        </div>
      </section>
      
      {/* Bagian lainnya tetap sama */}

    </div>
  );
};

export default Home;
