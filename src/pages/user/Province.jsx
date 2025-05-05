import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockProvinces } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

export default function ProvincesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProvinces = mockProvinces.filter((province) =>
    province.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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
        {filteredProvinces.map((province) => (
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
                  <p className="text-sm text-muted-foreground">
                    {province.regionCount || 5} Regions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {province.cultureCount || 10} Cultural Items
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Explore
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
