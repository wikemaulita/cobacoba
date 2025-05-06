import { useState } from "react";
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
import { mockCultures, mockProvinces, mockRegions } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

const cultureTypes = [
  "All Types",
  "Dance",
  "Music",
  "Craft",
  "Puppet",
  "Ceremony",
  "Culinary",
  "Clothing",
  "Architecture",
];

export default function CulturesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [availableRegions, setAvailableRegions] = useState([]);

  const filteredCultures = mockCultures.filter((culture) => {
    const matchesSearch =
      culture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      culture.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvince = selectedProvince
      ? culture.province === selectedProvince
      : true;
    const matchesRegion = selectedRegion
      ? culture.region === selectedRegion
      : true;
    const matchesType =
      selectedType === "All Types" ? true : culture.type === selectedType;

    return matchesSearch && matchesProvince && matchesRegion && matchesType;
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedRegion("");
    setAvailableRegions(mockRegions[value] || []);
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Cultural Exhibitions
        </h2>
        <p className="text-muted-foreground">
          Explore cultural heritage from across Indonesia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find cultural items by name, type, or location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cultural items..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
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
            <div>
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
            <div className="flex items-center">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">
            Results ({filteredCultures.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="name">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="type">Sort by Type</SelectItem>
                <SelectItem value="region">Sort by Region</SelectItem>
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
                    src={culture.image || "/placeholder.svg"}
                    alt={culture.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary">{culture.type}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-bold text-xl">{culture.name}</h3>
                    <p className="text-sm opacity-90">
                      {culture.region}, {culture.province}
                    </p>
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-sm line-clamp-2 text-muted-foreground mb-4">
                    {culture.description}
                  </p>
                  <div className="flex justify-end">
                    <Button size="sm">View Details</Button>
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
                No cultural items found
              </h3>
              <p className="text-center text-muted-foreground mb-4">
                We couldn't find any cultural items matching your search
                criteria.
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
