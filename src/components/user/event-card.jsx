import { cn } from "@/lib/utils";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RatingStars from "@/components/user/rating-stars";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);

    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? `${event.name} has been removed from your favorites`
        : `${event.name} has been added to your favorites`,
    });
  };

  const handleCardClick = () => {
    navigate(`/user/events/${event.id}`);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="relative h-40">
        <img
          src={event.image || "/placeholder.svg?height=200&width=400"}
          alt={event.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:bg-black/20 z-10"
          onClick={handleFavoriteClick}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            )}
          />
        </Button>
        <div className="absolute bottom-2 left-2 text-white">
          <h3 className="font-bold text-lg">{event.name}</h3>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" /> {event.date}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" /> {event.location}, {event.region}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" /> {event.attendees || "86"}{" "}
            attending
          </div>

          <div className="flex justify-between items-center pt-2">
            <RatingStars rating={event.rating || 4.5} size="sm" />
            <Badge variant="outline" className="text-xs">
              Cultural
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
