import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getProvinces } from '@/lib/api'; 

export default function ProvincesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [provinces, setProvinces] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        setError(null); 
        const response = await getProvinces();

        if (response && Array.isArray(response.data)) {
          setProvinces(response.data);
        } else {
          console.warn("Expected response.data to be an array for provinces, but got:", response?.data);
          setProvinces([]); 
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch provinces:", err);
        setError("Gagal memuat data provinsi. Silakan coba lagi nanti.");
        setProvinces([]); 
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const filteredProvinces = Array.isArray(provinces)
    ? provinces.filter((province) =>
        province.name && province.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="text-center py-10">Memuat provinsi...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Provinsi</h2>
        <p className="text-muted-foreground">
          Jelajahi pameran budaya berdasarkan provinsi
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari provinsi..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProvinces.length > 0 ? (
          filteredProvinces.map((province) => (
            <Card
              key={province.id}
              className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate(`/user/provinces/${province.id}`)}
            >
              <div className="relative h-40">
                <img
                  src={province.image || "/placeholder.svg?height=200&width=400"}
                  alt={province.name || "Nama Provinsi"}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg?height=200&width=400&text=Error+Load+Image"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-xl">{province.name || "Nama Tidak Tersedia"}</h3>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {province.regionCount || 0} Daerah
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {province.cultureCount || 0} Item Budaya
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Jelajahi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">Tidak ada provinsi yang ditemukan.</p>
        )}
      </div>
    </div>
  );
}
