import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventCard from "@/components/user/event-card";
import { mockProvinces, mockRegions, getProvinceFromRegion } from "@/lib/mock-data"; // Import getProvinceFromRegion

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [events, setEvents] = useState([]); // State untuk menyimpan event dari API
  const [loading, setLoading] = useState(true); // State loading
  const [error, setError] = useState(null); // State error
  const [availableRegions, setAvailableRegions] = useState([]);

  // Fungsi untuk mengambil data event dari backend
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/events');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Memetakan data dari backend ke format yang diharapkan frontend
      const mappedEvents = data.event.data.map(event => ({
        id: event.id,
        name: event.nama,
        description: event.deskripsi,
        image: event.gambar || "/placeholder.svg?height=400&width=800", // Fallback gambar
        location: event.lokasi,
        date: new Date(event.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), // Format tanggal
        region: event.daerah.nama, // Nama daerah
        province: getProvinceFromRegion(event.daerah.nama), // Dapatkan nama provinsi dari nama daerah
        // Anda bisa menambahkan rating, reviewCount, attendees jika API menyediakannya
        rating: 4.5, // Mock sementara
        reviewCount: 0, // Mock sementara
        attendees: Math.floor(Math.random() * 100) + 50, // Mock sementara
      }));
      setEvents(mappedEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Gagal memuat event. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // Panggil saat komponen dimuat
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvince = selectedProvince
      ? event.province === selectedProvince
      : true;
    
    const matchesRegion = selectedRegion
      ? event.region === selectedRegion
      : true;

    return matchesSearch && matchesProvince && matchesRegion;
  });

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedRegion("");
    setAvailableRegions(mockRegions[value] || []);
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProvince("");
    setSelectedRegion("");
    setAvailableRegions([]);
    // Re-fetch events to reset any internal filtering if needed
    // fetchEvents(); // Opsional: jika filter dilakukan di backend, panggil ini. Jika di frontend, tidak perlu.
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Events</h2>
        <p className="text-muted-foreground">
          Browse and join cultural events across Indonesia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find events by name, location, or description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="w-full md:w-[200px]">
              <Select
                value={selectedProvince}
                onValueChange={handleProvinceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  {mockProvinces.map((province) => (
                    <SelectItem key={province.id} value={province.name}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[200px]">
              <Select
                value={selectedRegion}
                onValueChange={handleRegionChange}
                disabled={!selectedProvince || availableRegions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  {availableRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            Results ({filteredEvents.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="date">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading events...</div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Error</h3>
              <p className="text-center text-muted-foreground mb-4">
                {error}
              </p>
              <Button variant="outline" onClick={fetchEvents}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-center text-muted-foreground mb-4">
                We couldn't find any events matching your search criteria.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}