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
import { Calendar, Search, Filter } from "lucide-react";
import EventCard from "@/components/user/event-card";
import { mockEvents, mockProvinces, mockRegions } from "@/lib/mock-data";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [availableRegions, setAvailableRegions] = useState([]);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedRegion("");
    setAvailableRegions(mockRegions[value] || []);

    applyFilters(searchQuery, value, "");
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    applyFilters(searchQuery, selectedProvince, value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, selectedProvince, selectedRegion);
  };

  const applyFilters = (query, province, region) => {
    let filtered = [...mockEvents];

    if (query) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (province) {
      filtered = filtered.filter((event) => event.province === province);
    }

    if (region) {
      filtered = filtered.filter((event) => event.region === region);
    }

    setFilteredEvents(filtered);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProvince("");
    setSelectedRegion("");
    setAvailableRegions([]);
    setFilteredEvents(mockEvents);
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
