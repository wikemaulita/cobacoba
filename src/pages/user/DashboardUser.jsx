import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Landmark, ChevronRight } from "lucide-react";
import EventCard from "@/components/user/event-card";
import ExhibitionCard from "@/components/user/exhibition-card";
import { mockEvents, mockProvinces, mockCultures } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);

  useEffect(() => {
    // Sort events by date to get upcoming ones
    const sortedEvents = [...mockEvents].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setUpcomingEvents(sortedEvents.slice(0, 4));
    setFeaturedEvent(sortedEvents[0]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, User</h2>
        <p className="text-muted-foreground">
          Explore cultural events and exhibitions from across Indonesia.
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
              <div className="absolute bottom-4 left-4 z-20 text-white">
                <h3 className="text-2xl font-bold">{featuredEvent.name}</h3>
                <p className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-2" /> {featuredEvent.date}
                  <MapPin className="h-4 w-4 ml-4 mr-2" />{" "}
                  {featuredEvent.location}, {featuredEvent.region}
                </p>
                <Button
                  className="mt-4"
                  onClick={() => navigate(`/user/events/${featuredEvent.id}`)}
                >
                  View Details
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
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEvents.length}</div>
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/user/events")}
            >
              View all events <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provinces</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProvinces.length}</div>
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/user/provinces")}
            >
              Explore provinces <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cultural Exhibitions
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCultures.length}</div>
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/user/cultures")}
            >
              Discover cultures <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="popular">Popular Exhibitions</TabsTrigger>
          <TabsTrigger value="recommended">Recommended For You</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/user/events")}>
              View all events
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockCultures.slice(0, 4).map((culture) => (
              <ExhibitionCard key={culture.id} item={culture} type="culture" />
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/user/cultures")}
            >
              View all cultural exhibitions
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="recommended" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockEvents.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {mockCultures.slice(0, 2).map((culture) => (
              <ExhibitionCard key={culture.id} item={culture} type="culture" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
