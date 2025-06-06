import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Search, Filter } from "lucide-react";
import EventCard from "@/components/user/event-card";
import { getEvents, getProvinces, getRegions } from '@/lib/api';

// Definisikan nilai konstanta untuk opsi "Semua"
const ALL_PROVINCES_VALUE = "__ALL_PROVINCES__";
const ALL_REGIONS_VALUE = "__ALL_REGIONS__";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(""); // "" berarti semua
  const [selectedRegion, setSelectedRegion] = useState("");   // "" berarti semua
  const [allEvents, setAllEvents] = useState([]); // Inisialisasi sebagai array kosong
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error
        const eventsResponse = await getEvents();
        const provincesResponse = await getProvinces();

        // PERBAIKAN: Pastikan eventsResponse.data adalah array
        if (eventsResponse && Array.isArray(eventsResponse.data)) {
          setAllEvents(eventsResponse.data);
          setFilteredEvents(eventsResponse.data);
        } else {
          console.warn("Expected eventsResponse.data to be an array, but got:", eventsResponse?.data);
          setAllEvents([]);
          setFilteredEvents([]);
        }

        // PERBAIKAN: Pastikan provincesResponse.data adalah array
        if (provincesResponse && Array.isArray(provincesResponse.data)) {
          setProvinces(provincesResponse.data);
        } else {
          console.warn("Expected provincesResponse.data to be an array, but got:", provincesResponse?.data);
          setProvinces([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch initial event data:", err);
        setError("Gagal memuat data event atau provinsi. Silakan coba lagi nanti.");
        setAllEvents([]); // Fallback ke array kosong jika error
        setFilteredEvents([]);
        setProvinces([]);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const applyFilters = (query, provinceName, regionName) => {
    // PERBAIKAN: Pastikan allEvents adalah array sebelum di-spread
    let currentFiltered = Array.isArray(allEvents) ? [...allEvents] : [];

    if (query) {
      currentFiltered = currentFiltered.filter(
        (event) =>
          (event.name && event.name.toLowerCase().includes(query.toLowerCase())) ||
          (event.description && event.description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (provinceName) { // Filter jika provinceName tidak kosong
      currentFiltered = currentFiltered.filter((event) => event.province === provinceName);
    }

    if (regionName) { // Filter jika regionName tidak kosong
      currentFiltered = currentFiltered.filter((event) => event.region === regionName);
    }

    setFilteredEvents(currentFiltered);
  };

  useEffect(() => {
    applyFilters(searchQuery, selectedProvince, selectedRegion);
  }, [searchQuery, selectedProvince, selectedRegion, allEvents]);


  const handleProvinceChange = async (valueFromSelect) => {
    if (valueFromSelect === ALL_PROVINCES_VALUE) {
      setSelectedProvince("");
      setSelectedRegion("");
      setAvailableRegions([]);
    } else {
      setSelectedProvince(valueFromSelect);
      setSelectedRegion("");
      if (valueFromSelect) {
        try {
          const provinceObj = provinces.find(p => p.name === valueFromSelect);
          if (provinceObj) {
            const regionsResponse = await getRegions({ provinceId: provinceObj.id });
            if (regionsResponse && Array.isArray(regionsResponse.data)) {
              setAvailableRegions(regionsResponse.data);
            } else {
              console.warn("Expected regionsResponse.data to be an array for province change, but got:", regionsResponse?.data);
              setAvailableRegions([]);
            }
          } else {
            setAvailableRegions([]);
          }
        } catch (err) {
          console.error("Failed to fetch regions for province:", err);
          setAvailableRegions([]);
        }
      } else {
        setAvailableRegions([]);
      }
    }
  };

  const handleRegionChange = (valueFromSelect) => {
    if (valueFromSelect === ALL_REGIONS_VALUE) {
      setSelectedRegion("");
    } else {
      setSelectedRegion(valueFromSelect);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProvince("");
    setSelectedRegion("");
    setAvailableRegions([]);
    setFilteredEvents(Array.isArray(allEvents) ? allEvents : []); // Pastikan allEvents adalah array
  };

  if (loading) {
    return <div className="text-center py-10">Memuat event...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Event</h2>
        <p className="text-muted-foreground">
          Telusuri dan ikuti event budaya di seluruh Indonesia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cari & Filter</CardTitle>
          <CardDescription>
            Temukan event berdasarkan nama, lokasi, atau deskripsi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari event..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="w-full md:w-[200px]">
              <Select
                value={selectedProvince} // Bisa ""
                onValueChange={handleProvinceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {/* PERBAIKAN: Gunakan nilai konstanta untuk opsi "Semua" */}
                  <SelectItem value={ALL_PROVINCES_VALUE}>Semua Provinsi</SelectItem>
                  {Array.isArray(provinces) && provinces.map((province) => (
                    <SelectItem key={province.id} value={province.name}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[200px]">
              <Select
                value={selectedRegion} // Bisa ""
                onValueChange={handleRegionChange}
                disabled={!selectedProvince || !Array.isArray(availableRegions) || availableRegions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Daerah" />
                </SelectTrigger>
                <SelectContent>
                   {/* PERBAIKAN: Gunakan nilai konstanta untuk opsi "Semua" */}
                  <SelectItem value={ALL_REGIONS_VALUE}>Semua Daerah</SelectItem>
                  {Array.isArray(availableRegions) && availableRegions.map((region) => (
                    <SelectItem key={region.id} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            Hasil ({filteredEvents.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="date">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Tanggal</SelectItem>
                <SelectItem value="name">Nama</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Tidak ada event yang ditemukan</h3>
              <p className="text-center text-muted-foreground mb-4">
                Kami tidak dapat menemukan event yang sesuai dengan kriteria pencarian Anda.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Hapus Filter
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
