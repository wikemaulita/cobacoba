import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingStars({
  rating = 0,
  onRatingChange = null,
  editable = false,
  size = "default",
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (editable) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (editable && onRatingChange) {
      onRatingChange(index);
    }
  };

  const starSize =
    size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4";

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((index) => {
        const displayRating = hoverRating || rating;
        const isFilled = index <= displayRating;
        const isHalfFilled = !isFilled && index <= displayRating + 0.5;

        return (
          <span
            key={index}
            className={cn("cursor-default", editable && "cursor-pointer")}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            <Star
              className={cn(
                starSize,
                "text-muted-foreground",
                isFilled && "text-yellow-500 fill-yellow-500",
                isHalfFilled && "text-yellow-500 fill-yellow-500"
              )}
            />
          </span>
        );
      })}
    </div>
  );
}
