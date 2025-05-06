// Mock data for events
export const mockEvents = [
  {
    id: 1,
    name: "Bali Arts Festival",
    description:
      "Annual arts and cultural festival showcasing Balinese arts, music, and dance.",
    image: "/placeholder.svg?height=400&width=800",
    location: "Denpasar Art Center",
    date: "2023-06-15",
    region: "Denpasar",
    province: "Bali",
    rating: 4.8,
    reviewCount: 32,
    attendees: 120,
  },
  {
    id: 2,
    name: "Yogyakarta Cultural Night",
    description:
      "A night of traditional Javanese performances and cultural exhibitions.",
    image: "/placeholder.svg?height=400&width=800",
    location: "Malioboro Street",
    date: "2023-07-22",
    region: "Yogyakarta City",
    province: "DI Yogyakarta",
    rating: 4.5,
    reviewCount: 18,
    attendees: 85,
  },
  {
    id: 3,
    name: "Bandung Jazz Festival",
    description:
      "Annual jazz music festival featuring local and international jazz musicians.",
    image: "/placeholder.svg?height=400&width=800",
    location: "Saung Angklung Udjo",
    date: "2023-08-10",
    region: "Bandung",
    province: "Jawa Barat",
    rating: 4.7,
    reviewCount: 24,
    attendees: 150,
  },
  {
    id: 4,
    name: "Wayang Kulit Performance",
    description:
      "Traditional shadow puppet theater performance telling stories from the Ramayana and Mahabharata.",
    image: "/placeholder.svg?height=400&width=800",
    location: "Keraton Palace",
    date: "2023-09-05",
    region: "Yogyakarta City",
    province: "DI Yogyakarta",
    rating: 4.9,
    reviewCount: 42,
    attendees: 95,
  },
  {
    id: 5,
    name: "Batik Exhibition",
    description:
      "Exhibition showcasing the artistry and cultural significance of traditional batik patterns.",
    image: "/placeholder.svg?height=400&width=800",
    location: "Museum Tekstil",
    date: "2023-09-18",
    region: "Bogor",
    province: "Jawa Barat",
    rating: 4.6,
    reviewCount: 15,
    attendees: 70,
  },
  {
    id: 6,
    name: "Surabaya Cultural Parade",
    description:
      "Annual parade featuring dancers, musicians, and cultural performances from East Java.",
    image: "/placeholder.svg?height=400&width=800",
    location: "Tugu Pahlawan",
    date: "2023-10-02",
    region: "Surabaya",
    province: "Jawa Timur",
    rating: 4.4,
    reviewCount: 30,
    attendees: 200,
  },
];

// Mock data for provinces
export const mockProvinces = [
  {
    id: 1,
    name: "Bali",
    image: "/placeholder.svg?height=200&width=400",
    regionCount: 5,
    cultureCount: 15,
    eventCount: 8,
  },
  {
    id: 2,
    name: "DI Yogyakarta",
    image: "/placeholder.svg?height=200&width=400",
    regionCount: 3,
    cultureCount: 10,
    eventCount: 6,
  },
  {
    id: 3,
    name: "Jawa Barat",
    image: "/placeholder.svg?height=200&width=400",
    regionCount: 6,
    cultureCount: 15,
    eventCount: 9,
  },
  {
    id: 4,
    name: "Jawa Tengah",
    image: "/placeholder.svg?height=200&width=400",
    regionCount: 4,
    cultureCount: 8,
    eventCount: 5,
  },
  {
    id: 5,
    name: "Jawa Timur",
    image: "/placeholder.svg?height=200&width=400",
    regionCount: 5,
    cultureCount: 14,
    eventCount: 7,
  },
];

// Mock data for cultures
export const mockCultures = [
  {
    id: 1,
    name: "Kecak Dance",
    description:
      "Traditional Balinese dance and music drama developed in the 1930s.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Dance",
    region: "Denpasar",
    province: "Bali",
  },
  {
    id: 2,
    name: "Wayang Kulit",
    description:
      "Traditional shadow puppet theatre in Indonesia and other parts of Southeast Asia.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Puppet",
    region: "Yogyakarta City",
    province: "DI Yogyakarta",
  },
  {
    id: 3,
    name: "Angklung",
    description:
      "Traditional musical instrument made of bamboo tubes attached to a bamboo frame.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Music",
    region: "Bandung",
    province: "Jawa Barat",
  },
  {
    id: 4,
    name: "Batik",
    description:
      "Traditional textile art using wax-resist dyeing techniques to create intricate patterns.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Craft",
    region: "Yogyakarta City",
    province: "DI Yogyakarta",
  },
  {
    id: 5,
    name: "Gamelan",
    description:
      "Traditional ensemble music with percussion instruments like metallophones and gongs.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Music",
    region: "Surabaya",
    province: "Jawa Timur",
  },
  {
    id: 6,
    name: "Reog Ponorogo",
    description:
      "Traditional dance performance featuring a large lion-like mask and elaborate costumes.",
    image: "/placeholder.svg?height=200&width=400",
    type: "Dance",
    region: "Ponorogo",
    province: "Jawa Timur",
  },
];

// Mock data for regions by province
export const mockRegions = {
  Bali: ["Denpasar", "Kuta", "Ubud"],
  "DI Yogyakarta": ["Yogyakarta City", "Bantul", "Sleman"],
  "Jawa Barat": ["Bandung", "Bogor", "Cirebon"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang"],
  "Jawa Timur": ["Surabaya", "Malang", "Banyuwangi"],
};
