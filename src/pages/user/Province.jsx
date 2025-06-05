import { useState, useEffect } from "react"; // Add useEffect
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { mockProvinces } from "@/lib/mock-data"; // Remove this line
import { useNavigate } from "react-router-dom";
// Import API function
import { getProvinces } from '@/lib/api';

export default function ProvincesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [provinces, setProvinces] = useState([]); // State for provinces
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await getProvinces(); // Call the API
        // Assuming response.data is an array of provinces
        setProvinces(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch provinces:", err);
        setError("Failed to load provinces. Please try again later.");
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const filteredProvinces = provinces.filter((province) =>
    province.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <div className="text-center py-10">Loading provinces...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Provinces</h2>
        <p className="text-muted-foreground">
          Explore cultural exhibitions by province
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search provinces..."
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
                  alt={province.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-xl">{province.name}</h3>
                </div>
              </div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    {/* These counts might need separate API calls or be included in province detail */}
                    <p className="text-sm text-muted-foreground">
                      {province.regionCount || "N/A"} Regions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {province.cultureCount || "N/A"} Cultural Items
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No provinces found.</p>
        )}
      </div>
    </div>
  );
}