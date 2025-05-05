import eventImage from "../assets/images/eventImage.webp";

const DetailEvent = () => { 
    return (
      <div className="flex flex-col min-h-screen pt-24">  
        {/* Hero Section */}
        <section
          className="relative flex items-center justify-center py-32 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${eventImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "85vh",
          }}
        >
          <div className="container mx-auto px-4 text-left text-white">
            <h1 className="text-5xl font-bold mb-4">Lebaran Betawi 2025</h1>
            <p className="text-xl mb-8">
              {/* Tambahkan teks deskripsi di sini */}
              Detail tentang event ini akan ditampilkan di sini...
            </p>
          </div>
        </section>
      </div>
    );
  };
  
  export default DetailEvent;