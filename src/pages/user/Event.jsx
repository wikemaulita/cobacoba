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
// import { mockEvents, mockProvinces, mockRegions } from "@/lib/mock-data"; // Remove this line
import { getEvents, getProvinces, getRegions } from '@/lib/api'; // Import API functions

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [allEvents, setAllEvents] = useState([]); // Store all events
  const [filteredEvents, setFilteredEvents] = useState([]); // Store filtered events
  const [provinces, setProvinces] = useState([]); // State for provinces from API
  const [availableRegions, setAvailableRegions] = useState([]); // State for regions from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const eventsResponse = await getEvents();
        setAllEvents(eventsResponse.data);
        setFilteredEvents(eventsResponse.data); // Initialize filtered events with all events

        const provincesResponse = await getProvinces();
        setProvinces(provincesResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch initial event data:", err);
        setError("Failed to load events or provinces. Please try again later.");
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    // This effect runs when filters change
    applyFilters(searchQuery, selectedProvince, selectedRegion);
  }, [searchQuery, selectedProvince, selectedRegion, allEvents]); // Depend on allEvents too, if it changes after initial load

  const handleProvinceChange = async (value) => {
    setSelectedProvince(value);
    setSelectedRegion(""); // Reset region when province changes
    if (value) {
      try {
        // Filter regions by provinceId (assuming backend accepts this)
        const provinceObj = provinces.find(p => p.name === value);
        if (provinceObj) {
          const regionsResponse = await getRegions({ provinceId: provinceObj.id });
          setAvailableRegions(regionsResponse.data);
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
  };

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const applyFilters = (query, provinceName, regionName) => {
    let currentFiltered = [...allEvents];

    if (query) {
      currentFiltered = currentFiltered.filter(
        (event) =>
          event.name.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (provinceName) {
      currentFiltered = currentFiltered.filter((event) => event.province === provinceName);
    }

    if (regionName) {
      currentFiltered = currentFiltered.filter((event) => event.region === regionName);
    }

    setFilteredEvents(currentFiltered);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProvince("");
    setSelectedRegion("");
    setAvailableRegions([]);
    setFilteredEvents(allEvents); // Reset to all original events
  };

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

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
                  <SelectItem value="">All Provinces</SelectItem> {/* Option to select all */}
                  {provinces.map((province) => (
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
                  <SelectItem value="">All Regions</SelectItem> {/* Option to select all */}
                  {availableRegions.map((region) => (
                    <SelectItem key={region.id} value={region.name}> {/* Assuming region also has an ID */}
                      {region.name}
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
                {/* Add more sorting options as needed */}
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