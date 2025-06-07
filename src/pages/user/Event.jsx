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

const ALL_PROVINCES_VALUE = "__ALL_PROVINCES__";
const ALL_REGIONS_VALUE = "__ALL_REGIONS__";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState(ALL_PROVINCES_VALUE);
  const [selectedRegion, setSelectedRegion] = useState(ALL_REGIONS_VALUE);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [provinceRegionMap, setProvinceRegionMap] = useState({});
  const [regionIdToProvinceIdMap, setRegionIdToProvinceIdMap] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const eventsResponse = await getEvents();
        console.log("Raw Events API Response:", eventsResponse);

        let fetchedEvents = [];
        if (eventsResponse && eventsResponse.data && eventsResponse.data.event && Array.isArray(eventsResponse.data.event.data)) {
          fetchedEvents = eventsResponse.data.event.data;
        } else {
          console.warn("Expected eventsResponse.data.event.data to be an array for events, but got:", eventsResponse?.data);
        }
        setAllEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);

        const provincesResponse = await getProvinces();
        console.log("Raw Provinces API Response:", provincesResponse);

        let fetchedProvinces = [];
        if (provincesResponse && provincesResponse.data && provincesResponse.data.provinsi && Array.isArray(provincesResponse.data.provinsi.data)) {
          fetchedProvinces = provincesResponse.data.provinsi.data;
        } else {
          console.warn("Expected provincesResponse.data.provinsi.data to be an array for provinces, but got:", provincesResponse?.data);
        }
        setProvinces(fetchedProvinces);

        const allRegionsResponse = await getRegions();
        console.log("Raw All Regions API Response:", allRegionsResponse);

        let regionToProvMap = {};
        let provRegionMap = {};

        if (allRegionsResponse && allRegionsResponse.data && allRegionsResponse.data.daerah && Array.isArray(allRegionsResponse.data.daerah.data)) {
            allRegionsResponse.data.daerah.data.forEach(region => {
                regionToProvMap[region.id] = region.provinsiId;
                if (region.provinsiId) {
                    if (!provRegionMap[region.provinsiId]) {
                        provRegionMap[region.provinsiId] = [];
                    }
                    provRegionMap[region.provinsiId].push(region.id);
                }
            });
        }
        setRegionIdToProvinceIdMap(regionToProvMap);
        setProvinceRegionMap(provRegionMap);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch initial event data:", err);
        setError("Gagal memuat data event, provinsi, atau daerah. Silakan coba lagi nanti.");
        setAllEvents([]);
        setFilteredEvents([]);
        setProvinces([]);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let currentFiltered = Array.isArray(allEvents) ? [...allEvents] : [];

    if (searchQuery) {
      currentFiltered = currentFiltered.filter(
        (event) =>
          (event.nama && event.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (event.deskripsi && event.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedProvince !== ALL_PROVINCES_VALUE) {
      const selectedProvinceObj = provinces.find(p => p.nama === selectedProvince);
      if (selectedProvinceObj) {
        const regionIdsInSelectedProvince = provinceRegionMap[selectedProvinceObj.id] || [];

        currentFiltered = currentFiltered.filter(event =>
          event.daerahId && regionIdsInSelectedProvince.includes(event.daerahId)
        );
      } else {
        currentFiltered = [];
      }
    }

    if (selectedRegion !== ALL_REGIONS_VALUE) {
      currentFiltered = currentFiltered.filter(event =>
        event.daerah && event.daerah.nama === selectedRegion
      );
    }

    setFilteredEvents(currentFiltered);
  }, [searchQuery, selectedProvince, selectedRegion, allEvents, provinces, provinceRegionMap]);

  const handleProvinceChange = async (valueFromSelect) => {
    setSelectedProvince(valueFromSelect);
    setSelectedRegion(ALL_REGIONS_VALUE);
    setAvailableRegions([]);

    if (valueFromSelect !== ALL_PROVINCES_VALUE) {
      try {
        const provinceObj = provinces.find(p => p.nama === valueFromSelect);
        if (provinceObj) {
          const regionsResponse = await getRegions({ provinsiId: provinceObj.id });
          console.log("Raw Regions API Response for Province Change:", regionsResponse);

          if (regionsResponse && regionsResponse.data && regionsResponse.data.daerah && Array.isArray(regionsResponse.data.daerah.data)) {
            setAvailableRegions(regionsResponse.data.daerah.data);
          } else {
            console.warn("Expected regionsResponse.data.daerah.data to be an array for province change, but got:", regionsResponse?.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch regions for province:", err);
        setAvailableRegions([]);
      }
    }
  };

  const handleRegionChange = (valueFromSelect) => {
    setSelectedRegion(valueFromSelect);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProvince(ALL_PROVINCES_VALUE);
    setSelectedRegion(ALL_REGIONS_VALUE);
    setAvailableRegions([]);
    setFilteredEvents(Array.isArray(allEvents) ? allEvents : []);
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
                value={selectedProvince}
                onValueChange={handleProvinceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PROVINCES_VALUE}>Semua Provinsi</SelectItem>
                  {Array.isArray(provinces) && provinces.map((province) => (
                    <SelectItem key={province.id} value={province.nama}>
                      {province.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-[200px]">
              <Select
                value={selectedRegion}
                onValueChange={handleRegionChange}
                disabled={selectedProvince === ALL_PROVINCES_VALUE || !Array.isArray(availableRegions) || availableRegions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Daerah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_REGIONS_VALUE}>Semua Daerah</SelectItem>
                  {Array.isArray(availableRegions) && availableRegions.map((region) => (
                    <SelectItem key={region.id} value={region.nama}>
                      {region.nama}
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
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  name: event.nama,
                  description: event.deskripsi,
                  image: event.gambar,
                  date: event.tanggal,
                  location: event.lokasi,
                  region: event.daerah?.nama || 'N/A',
                }}
              />
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