// src/pages/user/DetailProvince.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Landmark, Calendar, ArrowLeft } from "lucide-react";
import { getProvinceDetail } from '@/lib/api'; // Import API function

export default function ProvinceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [province, setProvince] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvinceDetails = async () => {
      try {
        setLoading(true);
        const response = await getProvinceDetail(id);
        setProvince(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch province details:", err);
        setError("Failed to load province details. It might not exist.");
        setLoading(false);
      }
    };

    fetchProvinceDetails();
  }, [id]); // Re-fetch when ID changes

  if (loading) {
    return <div className="text-center py-10">Loading province details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!province) {
    return <div className="text-center py-10">Province not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-1 -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Provinces
      </Button>

      <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
        <img
          src={province.image || "/placeholder.svg?height=600&width=1200"}
          alt={province.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 z-20 text-white max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{province.name}</h1>
          <p className="text-xl opacity-90">{province.description || "No description available."}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{province.regions ? province.regions.length : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Local administrative areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cultural Items</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{province.cultures ? province.cultures.length : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Unique cultural heritage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{province.events ? province.events.length : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Upcoming and past events</p>
          </CardContent>
        </Card>
      </div>

      {province.regions && province.regions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Regions in {province.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {province.regions.map((region) => (
                <Card key={region.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-lg">{region.name}</h4>
                    <p className="text-sm text-muted-foreground">{region.description || "No description."}</p>
                    {/* Optional: Add a link to region detail if exists */}
                    <Button variant="link" className="p-0 h-auto mt-2" onClick={() => console.log(`Maps to /user/regions/${region.id}`)}>View Details</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {province.cultures && province.cultures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cultural Items from {province.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {province.cultures.map((culture) => (
                <Card
                  key={culture.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/user/cultures/${culture.id}`)}
                >
                  <div className="relative h-32">
                    <img
                      src={culture.image || "/placeholder.svg?height=200&width=400"}
                      alt={culture.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 text-white">
                      <h4 className="font-bold text-lg">{culture.name}</h4>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <Badge variant="secondary">{culture.type}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {province.events && province.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Events in {province.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {province.events.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/user/events/${event.id}`)}
                >
                  <div className="relative h-32">
                    <img
                      src={event.image || "/placeholder.svg?height=200&width=400"}
                      alt={event.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 text-white">
                      <h4 className="font-bold text-lg">{event.name}</h4>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" /> {event.date}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}