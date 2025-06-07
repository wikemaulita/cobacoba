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
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCultures, getProvinces, getRegions } from '@/lib/api'; // Import API functions

const cultureTypes = [
  "All Types", "Dance", "Music", "Craft", "Puppet",
  "Ceremony", "Culinary", "Clothing", "Architecture",
];

// Definisikan nilai konstanta untuk opsi "Semua"
const ALL_PROVINCES_VALUE = "__ALL_PROVINCES__";
const ALL_REGIONS_VALUE = "__ALL_REGIONS__";

export default function CulturesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [allCultures, setAllCultures] = useState([]);
  const [filteredCultures, setFilteredCultures] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        const culturesResponse = await getCultures();
        const provincesResponse = await getProvinces();

        if (culturesResponse && Array.isArray(culturesResponse.data)) {
          setAllCultures(culturesResponse.data);
          setFilteredCultures(culturesResponse.data);
        } else {
          console.warn("Expected culturesResponse.data to be an array, but got:", culturesResponse?.data);
          setAllCultures([]);
          setFilteredCultures([]);
        }

        if (provincesResponse && Array.isArray(provincesResponse.data)) {
          setProvinces(provincesResponse.data);
        } else {
          console.warn("Expected provincesResponse.data to be an array, but got:", provincesResponse?.data);
          setProvinces([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch initial culture data:", err);
        setError("Gagal memuat data budaya atau provinsi. Silakan coba lagi nanti.");
        setAllCultures([]);
        setFilteredCultures([]);
        setProvinces([]);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const applyFilters = (query, provinceName, regionName, type) => {
    let currentFiltered = Array.isArray(allCultures) ? [...allCultures] : [];

    if (query) {
      currentFiltered = currentFiltered.filter(
        (culture) =>
          (culture.name && culture.name.toLowerCase().includes(query.toLowerCase())) ||
          (culture.description && culture.description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (provinceName) { 
      currentFiltered = currentFiltered.filter((culture) => culture.province === provinceName);
    }

    if (regionName) { 
      currentFiltered = currentFiltered.filter((culture) => culture.region === regionName);
    }

    if (type !== "All Types") {
      currentFiltered = currentFiltered.filter((culture) => culture.type === type);
    }

    setFilteredCultures(currentFiltered);
  };


  useEffect(() => {
    applyFilters(searchQuery, selectedProvince, selectedRegion, selectedType);
  }, [searchQuery, selectedProvince, selectedRegion, selectedType, allCultures]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProvince("");
    setSelectedRegion("");
    setSelectedType("All Types");
    setAvailableRegions([]);
    setFilteredCultures(Array.isArray(allCultures) ? allCultures : []);
  };

  if (loading) {
    return <div className="text-center py-10">Memuat item budaya...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Pameran Budaya
        </h2>
        <p className="text-muted-foreground">
          Jelajahi warisan budaya dari seluruh Indonesia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cari & Filter</CardTitle>
          <CardDescription>
            Temukan item budaya berdasarkan nama, tipe, atau lokasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari item budaya..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  {cultureTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedProvince} onValueChange={handleProvinceChange} >
                <SelectTrigger>
                  <SelectValue placeholder="Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_PROVINCES_VALUE}>Semua Provinsi</SelectItem>
                  {Array.isArray(provinces) && provinces.map((province) => (
                    <SelectItem key={province.id} value={province.name}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={selectedRegion}
                onValueChange={handleRegionChange}
                disabled={!selectedProvince || availableRegions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Daerah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_REGIONS_VALUE}>Semua Daerah</SelectItem>
                  {Array.isArray(availableRegions) && availableRegions.map((region) => (
                    <SelectItem key={region.id} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            Hasil ({filteredCultures.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="name">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nama</SelectItem>
                <SelectItem value="type">Tipe</SelectItem>
                <SelectItem value="region">Daerah</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredCultures.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCultures.map((culture) => (
              <Card
                key={culture.id}
                className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
                onClick={() => navigate(`/user/cultures/${culture.id}`)}
              >
                <div className="relative h-48">
                  <img
                    src={culture.image || "/placeholder.svg?height=200&width=400"}
                    alt={culture.name || "Nama Budaya"}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg?height=200&width=400&text=Error+Load+Image"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary">{culture.type || "Tipe Tidak Ada"}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-bold text-xl">{culture.name || "Nama Tidak Tersedia"}</h3>
                    <p className="text-sm opacity-90">
                      {culture.region || "Daerah Tidak Ada"}, {culture.province || "Provinsi Tidak Ada"}
                    </p>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-sm line-clamp-2 text-muted-foreground mb-4">
                    {culture.description || "Deskripsi tidak tersedia."}
                  </p>
                  <div className="flex justify-end">
                    <Button size="sm">Lihat Detail</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">
                Tidak ada item budaya yang ditemukan
              </h3>
              <p className="text-center text-muted-foreground mb-4">
                Kami tidak dapat menemukan item budaya yang sesuai dengan kriteria pencarian Anda.
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
