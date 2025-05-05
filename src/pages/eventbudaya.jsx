const EventBudaya = () => {
  const events = [
    {
      id: 1,
      title: "Festival Tari Tradisional",
      date: "2025-05-01",
      description: "Pertunjukan tari budaya Nusantara di Taman Budaya Yogyakarta.",
    },
    {
      id: 2,
      title: "Pameran Batik Nasional",
      date: "2025-04-20",
      description: "Pameran karya batik dari seluruh Indonesia, terbuka untuk umum.",
    },
    {
      id: 3,
      title: "Musik Etnik Nusantara",
      date: "2025-03-15",
      description: "Konser musik alat tradisional dari berbagai daerah.",
    },
  ];

  const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-[#FDECEC] px-6 py-10">
      <h1 className="text-3xl font-bold text-[#C70039] mb-8 text-center">
        Daftar Event Budaya
      </h1>

      <div className="grid gap-6 max-w-3xl mx-auto">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#C70039] transition hover:shadow-lg"
            style={{ aspectRatio: '5 / 7' }}
          >
            <h2 className="text-xl font-bold text-[#C70039]">{event.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-700">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventBudaya;
