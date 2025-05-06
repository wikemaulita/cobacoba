import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import RatingStars from "@/components/user/rating-stars";
import { useNavigate } from "react-router-dom";

export default function FeaturedEventCard({ event }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/events/${event.id}`);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="relative h-64 w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <img
          src={event.image || "/placeholder.svg?height=400&width=800"}
          alt={event.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <h3 className="text-2xl font-bold">{event.name}</h3>
          <div className="flex flex-wrap items-center mt-2 gap-x-4">
            <p className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> {event.date}
            </p>
            <p className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> {event.location},{" "}
              {event.region}
            </p>
            <p className="flex items-center">
              <Users className="h-4 w-4 mr-2" /> {event.attendees || "86"}{" "}
              attending
            </p>
          </div>
          <div className="flex items-center mt-3">
            <RatingStars rating={event.rating || 4.5} />
            <span className="ml-2 text-sm">
              ({event.reviewCount || 24} reviews)
            </span>
          </div>
          <Button className="mt-4">View Details</Button>
        </div>
      </div>
    </Card>
  );
}
