import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Landmark, ChevronRight } from "lucide-react";
import EventCard from "@/components/user/event-card";
import ExhibitionCard from "@/components/user/exhibition-card";
import { useNavigate } from "react-router-dom";
import { getEvents, getProvinces, getCultures } from '@/lib/api';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [totalEventsCount, setTotalEventsCount] = useState(0);
  const [totalProvincesCount, setTotalProvincesCount] = useState(0);
  const [totalCulturesCount, setTotalCulturesCount] = useState(0);
  const [popularCultures, setPopularCultures] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await getEvents();
        const eventsData = eventsResponse.data;
        const sortedEvents = [...eventsData].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setUpcomingEvents(sortedEvents.slice(0, 4));
        setFeaturedEvent(sortedEvents[0] || null);
        setTotalEventsCount(eventsData.length);

        // Fetch provinces
        const provincesResponse = await getProvinces();
        setTotalProvincesCount(provincesResponse.data.length);

        // Fetch cultures
        const culturesResponse = await getCultures();
        const culturesData = culturesResponse.data;
        setTotalCulturesCount(culturesData.length);
        setPopularCultures(culturesData.slice(0, 4)); // Asumsi 4 pertama adalah yang populer
        setRecommendedItems([...eventsData.slice(0, 2), ...culturesData.slice(0, 2)]);

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Selamat Datang, User</h2>
        <p className="text-muted-foreground">
          Jelajahi event dan pameran budaya dari seluruh Indonesia.
        </p>
      </div>

      {featuredEvent && (
        <Card className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-64 w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
              <img
                src={
                  featuredEvent.image || "/placeholder.svg?height=400&width=800"
                }
                alt={featuredEvent.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 z-20 text-white max-w-3xl">
                <h3 className="text-2xl font-bold">{featuredEvent.name}</h3>
                <p className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-2" /> {featuredEvent.date}
                  <MapPin className="h-4 w-4 ml-4 mr-2" />{" "}
                  {featuredEvent.location}, {featuredEvent.region}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => navigate(`/events/${featuredEvent.id}`)} 
                >
                  Lihat Detail
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Event Mendatang
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEventsCount}</div>
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/events")} 
            >
              Lihat semua event <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provinsi</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProvincesCount}</div>
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/user/provinces")}
            >
              Jelajahi provinsi <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pameran Budaya
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCulturesCount}</div>
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/user/cultures")}
            >
              Temukan budaya <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Event Mendatang</TabsTrigger>
          <TabsTrigger value="popular">Pameran Populer</TabsTrigger>
          <TabsTrigger value="recommended">Rekomendasi Untuk Anda</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/events")}> {/* Diperbarui ke /events */}
              Lihat semua event
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {popularCultures.map((culture) => (
              <ExhibitionCard key={culture.id} item={culture} type="culture" />
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/user/cultures")}
            >
              Lihat semua pameran budaya
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="recommended" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {recommendedItems.map((item) => (
              item.type ? (
                <ExhibitionCard key={item.id} item={item} type="culture" />
              ) : (
                <EventCard key={item.id} event={item} />
              )
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}