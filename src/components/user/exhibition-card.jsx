import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function ExhibitionCard({ item, type }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);

    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? `${item.name} has been removed from your favorites`
        : `${item.name} has been added to your favorites`,
    });
  };

  const handleCardClick = () => {
    navigate(`/user/${type}s/${item.id}`);
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="relative h-40">
        <img
          src={item.image || "/placeholder.svg?height=200&width=400"}
          alt={item.name}
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

        {item.type && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary">{item.type}</Badge>
          </div>
        )}

        <div className="absolute bottom-2 left-2 text-white">
          <h3 className="font-bold text-lg">{item.name}</h3>
        </div>
      </div>
      <CardContent className="p-3">
        {item.description && (
          <p className="text-sm line-clamp-2 text-muted-foreground mb-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          {item.region}, {item.province}
        </div>
      </CardContent>
    </Card>
  );
}
