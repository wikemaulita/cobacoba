import { Link } from "react-router-dom";
import eventImage from "../assets/images/eventImage.webp";

const EventBudaya = () => {
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
           Ikuti kemeriahan Lebaran Betawi 2025 dengan berbagai acara menarik, mulai dari bazaar kuliner hingga pertunjukan seni tradisional. Bergabunglah bersama kami untuk merayakan budaya Betawi yang kaya dan beragam.
         </p>
      <Link to="/Detailevent" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
         Lihat Event
       </Link>
     </div>
      </section>
    </div>
  );
};

export default EventBudaya;
