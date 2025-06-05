import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  ThumbsUp,
  ArrowLeft,
  Share2,
  Star,
} from "lucide-react";
// import { mockEvents } from "@/lib/mock-data"; // Hapus import mockEvents
import RatingStars from "@/components/user/rating-stars";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { getProvinceFromRegion } from "@/lib/mock-data"; // Import fungsi pembantu

// Mock review data (tetap pakai mock untuk review, karena tidak ada API review)
const mockReviews = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder.svg?height=50&width=50",
    date: "2023-08-15",
    rating: 5,
    comment:
      "This was an amazing event! The cultural performances were spectacular and I learned a lot about the local traditions.",
    likes: 12,
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "/placeholder.svg?height=50&width=50",
    date: "2023-08-12",
    rating: 4,
    comment:
      "Truly enjoyed the experience. The venue was a bit crowded but the performances made up for it.",
    likes: 8,
  },
  {
    id: 3,
    author: "Michael Johnson",
    avatar: "/placeholder.svg?height=50&width=50",
    date: "2023-08-10",
    rating: 5,
    comment:
      "One of the best cultural events I've attended. Highly recommended for anyone interested in Indonesian culture!",
    likes: 15,
  },
];

export default function EventDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState(mockReviews);

  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventId = params.id;
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Memetakan data dari backend ke format yang diharapkan frontend
        const mappedEvent = {
          id: data.event.id,
          name: data.event.nama,
          description: data.event.deskripsi,
          image: data.event.gambar || "/placeholder.svg?height=600&width=1200", // Fallback gambar
          location: data.event.lokasi,
          date: new Date(data.event.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
          region: data.event.daerah.nama,
          province: getProvinceFromRegion(data.event.daerah.nama), // Dapatkan nama provinsi
          // Tambahkan properti lain yang mungkin tidak ada di API tapi dibutuhkan (misal: rating, attendees)
          rating: 4.7, // Mock sementara
          attendees: Math.floor(Math.random() * 200) + 50, // Mock sementara
        };
        setEvent(mappedEvent);
      } catch (err) {
        console.error("Failed to fetch event detail:", err);
        setError("Gagal memuat detail event. Silakan coba lagi nanti.");
        navigate("/user/events"); // Arahkan kembali jika ada error fatal
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [params.id, navigate]); // Dependensi: id dan navigate

  const handleJoinEvent = () => {
    setIsJoined(!isJoined);

    if (!isJoined) {
      toast({
        title: "Event Joined",
        description: "You have successfully joined this event",
      });
    } else {
      toast({
        title: "Event Left",
        description: "You have left this event",
      });
    }
  };

  const handleSubmitRating = () => {
    if (userRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      author: "You",
      avatar: "/placeholder.svg?height=50&width=50",
      date: new Date().toISOString().split("T")[0],
      rating: userRating,
      comment: userComment,
      likes: 0,
    };

    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setUserComment("");
    setIsRatingOpen(false);

    toast({
      title: "Review Submitted",
      description: "Thank you for sharing your experience!",
    });
  };

  const handleLikeReview = (reviewId) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, likes: review.likes + 1 } : review
    );

    setReviews(updatedReviews);
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading event details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="text-center py-10 text-muted-foreground">Event not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-1 -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Button>

      <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
        <img
          src={event.image || "/placeholder.svg?height=600&width=1200"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 z-20 text-white max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> {event.date}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> {event.location},{" "}
              {event.region}, {event.province}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" /> {event.attendees || "86"}{" "}
              attending
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className={isJoined ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={handleJoinEvent}
            >
              {isJoined ? "Joined" : "Join Event"}
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20"
            >
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/20"
                >
                  <Star className="h-4 w-4 mr-2" /> Rate Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Rate this Event</DialogTitle>
                  <DialogDescription>
                    Share your experience about "{event.name}"
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-center text-sm font-medium">
                      Your Rating
                    </p>
                    <RatingStars
                      rating={userRating}
                      onRatingChange={setUserRating}
                      editable={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Your Review (Optional)
                    </p>
                    <Textarea
                      placeholder="Share your experience about this event..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsRatingOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitRating}>Submit Rating</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          {/* Untuk sementara, related event menggunakan mock data */}
          <TabsTrigger value="related">Related</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">
                {event.description}
                {"\n\n"}
                Join us for an unforgettable cultural experience at {event.name}
                . This event celebrates the rich cultural heritage of{" "}
                {event.region} in {event.province}.{"\n\n"}
                You will have the opportunity to witness traditional
                performances, participate in interactive cultural activities,
                and enjoy authentic local cuisine. This event is perfect for
                families, tourists, and anyone interested in learning more about
                Indonesia's diverse cultural landscape.
                {"\n\n"}
                Don't miss this chance to immerse yourself in the beauty and
                richness of Indonesian culture!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-sm mb-1">Date & Time</h3>
                  <p>{event.date} • 10:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Location</h3>
                  <p>
                    {event.location}, {event.region}, {event.province}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Organizer</h3>
                  <p>Cultural Department of {event.province}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Category</h3>
                  <Badge variant="outline">Cultural</Badge>
                  <Badge variant="outline" className="ml-2">
                    Exhibition
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md overflow-hidden h-[300px] bg-muted flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Map view for {event.location}, {event.region},{" "}
                    {event.province}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Ratings & Reviews</CardTitle>
              <CardDescription>
                See what others are saying about this event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold mr-2">4.7</span>
                    <span className="text-sm text-muted-foreground">
                      out of 5
                    </span>
                  </div>
                  <RatingStars rating={4.7} />
                  <p className="text-sm text-muted-foreground">
                    Based on {reviews.length} reviews
                  </p>
                </div>
                <div className="md:flex-1">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsRatingOpen(true)}
                  >
                    <Star className="h-4 w-4 mr-2" /> Write a Review
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.author}
                          />
                          <AvatarFallback>
                            {review.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{review.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <RatingStars rating={review.rating} />
                    </div>
                    <p className="text-sm mb-3">{review.comment}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleLikeReview(review.id)}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" /> {review.likes}{" "}
                      Helpful
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Related Events</CardTitle>
              <CardDescription>
                Other events you might be interested in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Untuk sementara, related event masih menggunakan mockEvents */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* Impor mockEvents jika ingin menampilkan Related Events dari mock data.
                    Atau implementasi API untuk mengambil related events */}
                {([]).slice(0, 3).map((relatedEvent) => ( // Ganti [] dengan mockEvents jika ingin tampilkan mock data
                  <Card
                    key={relatedEvent.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      navigate(`/user/events/${relatedEvent.id}`)
                    }
                  >
                    <div className="h-32 relative">
                      <img
                        src={
                          relatedEvent.image ||
                          "/placeholder.svg?height=200&width=400"
                        }
                        alt={relatedEvent.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium line-clamp-1">
                        {relatedEvent.name}
                      </h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />{" "}
                        {relatedEvent.date}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />{" "}
                        {relatedEvent.region}, {relatedEvent.province}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}