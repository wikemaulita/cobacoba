import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import RatingStars from "@/components/user/rating-stars";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Import fungsi API
import {
  getEventDetail,
  getEventRatings,
  getAverageRating,
  getUserRatingForEvent,
  joinEvent,
  submitUserRating,
  deleteRatingParticipation,
  getProvinces, // Diperlukan untuk memetakan nama provinsi
  getRegions,   // Diperlukan untuk memetakan nama daerah ke provinsi
} from '@/lib/api';

// PERBAIKAN DI SINI: Ubah nama fungsi menjadi EventDetailPage
export default function EventDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState(null); // Akan menyimpan objek event yang sudah dikonversi
  const [isJoined, setIsJoined] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State tambahan untuk menampilkan nama provinsi (karena API event tidak menyediakan langsung)
  const [provinceName, setProvinceName] = useState('N/A');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const eventId = Number(params.id);

        // --- 1. Ambil data utama event ---
        const eventResponse = await getEventDetail(eventId);
        console.log("Respons API Detail Event Mentah:", eventResponse); // DEBUG: Log respons detail event

        if (eventResponse && eventResponse.data && eventResponse.data.event) {
          const apiEvent = eventResponse.data.event;
          // Konversi properti API ke properti yang digunakan di JSX
          const formattedEvent = {
            id: apiEvent.id,
            name: apiEvent.nama,
            description: apiEvent.deskripsi,
            image: apiEvent.gambar,
            date: new Date(apiEvent.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'}),
            rawDate: apiEvent.tanggal, // Simpan tanggal mentah jika perlu
            location: apiEvent.lokasi,
            regionId: apiEvent.daerahId, // Simpan ID daerah untuk pemetaan
            region: apiEvent.daerah?.nama || 'N/A', // Nama daerah dari API
            attendees: apiEvent.jumlah_peserta || 0, // Asumsi ada properti jumlah_peserta di API
          };
          setEvent(formattedEvent);

          // --- 1a. Ambil dan petakan nama provinsi berdasarkan daerahId event ---
          if (apiEvent.daerahId) {
            try {
              const allRegionsResponse = await getRegions();
              if (allRegionsResponse && allRegionsResponse.data && allRegionsResponse.data.daerah && Array.isArray(allRegionsResponse.data.daerah.data)) {
                const foundRegion = allRegionsResponse.data.daerah.data.find(r => r.id === apiEvent.daerahId);
                if (foundRegion && foundRegion.provinsiId) {
                  const provincesResponse = await getProvinces();
                  if (provincesResponse && provincesResponse.data && provincesResponse.data.provinsi && Array.isArray(provincesResponse.data.provinsi.data)) {
                    const foundProvince = provincesResponse.data.provinsi.data.find(p => p.id === foundRegion.provinsiId);
                    if (foundProvince) {
                      setProvinceName(foundProvince.nama);
                    }
                  }
                }
              }
            } catch (provRegionErr) {
              console.error("Gagal memetakan daerah ke provinsi:", provRegionErr);
              setProvinceName('N/A'); // Fallback jika gagal
            }
          } else {
             setProvinceName('N/A'); // Jika event tidak punya daerahId
          }

        } else {
          setError("Event tidak ditemukan atau format data tidak sesuai.");
          setEvent(null);
        }

        // --- 2. Ambil data rating & ulasan ---
        const reviewsResponse = await getEventRatings(eventId);
        console.log("Respons API Ulasan Mentah:", reviewsResponse); // DEBUG: Log respons ulasan

        // Asumsi struktur respons API ulasan: { message: "success", data: [...] }
        if (reviewsResponse && reviewsResponse.data && Array.isArray(reviewsResponse.data.data)) {
          setReviews(reviewsResponse.data.data);
        } else {
          console.warn("Diharapkan reviewsResponse.data.data adalah array untuk ulasan, tetapi mendapatkan:", reviewsResponse?.data);
          setReviews([]);
        }

        // --- 3. Ambil rata-rata rating ---
        const averageRatingResponse = await getAverageRating(eventId);
        console.log("Respons API Rating Rata-rata Mentah:", averageRatingResponse); // DEBUG: Log respons rating rata-rata

        // Asumsi struktur respons API rating rata-rata: { message: "success", averageRating: X, reviewCount: Y }
        if (averageRatingResponse && averageRatingResponse.data) {
          setAverageRating(averageRatingResponse.data.averageRating || 0);
          setReviewCount(averageRatingResponse.data.reviewCount || 0);
        } else {
          console.warn("Diharapkan averageRatingResponse.data mengandung averageRating dan reviewCount, tetapi mendapatkan:", averageRatingResponse?.data);
          setAverageRating(0);
          setReviewCount(0);
        }

        // --- 4. Cek status bergabung/rating pengguna (jika pengguna login) ---
        if (user) {
          try {
            // Panggil getUserRatingForEvent dengan DUA argumen: userId dan eventId
            const userRatingResponse = await getUserRatingForEvent(user.id, eventId);
            console.log("Respons API Status Rating/Bergabung Pengguna Mentah:", userRatingResponse); // DEBUG: Log respons status pengguna

            // Asumsi struktur respons API status rating pengguna: { message: "success", hasRated: bool, isJoined: bool, rating: { rating: X, comment: "Y" } }
            if (userRatingResponse.data) {
                if (userRatingResponse.data.hasRated && userRatingResponse.data.rating) {
                    setUserRating(userRatingResponse.data.rating.rating);
                    setUserComment(userRatingResponse.data.rating.comment || "");
                    setIsJoined(true); // Pengguna sudah bergabung jika sudah memberi rating
                } else if (userRatingResponse.data.isJoined) { // Hanya bergabung, belum memberi rating
                    setIsJoined(true);
                } else {
                    setIsJoined(false); // Tidak bergabung dan tidak memberi rating
                    setUserRating(0);
                    setUserComment("");
                }
            }
          } catch (userCheckError) {
              // Menangkap error jika pengguna belum bergabung/rating, ini normal
              console.log("Info: Pengguna belum memberi rating/bergabung atau error saat cek status.", userCheckError.response?.data?.message || userCheckError.message);
              setIsJoined(false);
              setUserRating(0);
              setUserComment("");
          }
        } else {
            // Reset jika pengguna tidak login
            setIsJoined(false);
            setUserRating(0);
            setUserComment("");
        }

        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat detail event:", err);
        setError("Gagal memuat detail event. Mungkin event tidak ditemukan atau ada masalah server.");
        setLoading(false);
      }
    };

    fetchEventData();
  }, [params.id, user]); // Dependensi `user` agar data pengguna diperbarui ketika login/logout

  const handleJoinEvent = async () => {
    if (!user) { // Pengecekan Autentikasi
        toast({
            title: "Login Diperlukan",
            description: "Anda perlu login untuk bergabung dengan event ini.",
            variant: "destructive",
            action: {
                label: "Login",
                onClick: () => navigate('/login'),
            },
        });
        return;
    }

    try {
        if (!isJoined) {
            await joinEvent(event.id, user.id); // Panggil API untuk bergabung
            setIsJoined(true);
            toast({
                title: "Event Berhasil Diikuti",
                description: "Anda telah berhasil bergabung dengan event ini!",
            });
        } else {
            await deleteRatingParticipation(event.id); // Panggil API untuk membatalkan bergabung
            setIsJoined(false);
            // Reset user rating/comment jika user meninggalkan event
            setUserRating(0);
            setUserComment("");
            toast({
                title: "Berhasil Meninggalkan Event",
                description: "Anda telah meninggalkan event ini.",
            });
        }
        // Opsional: Muat ulang detail event untuk memperbarui jumlah peserta jika ada
        const eventResponse = await getEventDetail(Number(params.id));
        if (eventResponse && eventResponse.data && eventResponse.data.event) {
            const apiEvent = eventResponse.data.event;
            setEvent(prev => ({
                ...prev,
                attendees: apiEvent.jumlah_peserta || 0, // Update attendees
            }));
        }
    } catch (err) {
        console.error("Gagal mengubah status bergabung:", err);
        toast({
            title: "Aksi Gagal",
            description: err.response?.data?.message || "Tidak dapat memperbarui status bergabung. Silakan coba lagi.",
            variant: "destructive",
        });
    }
  };

  const handleSubmitRating = async () => {
    if (!user) { // Pengecekan Autentikasi
        toast({
            title: "Login Diperlukan",
            description: "Anda perlu login untuk mengirim ulasan.",
            variant: "destructive",
            action: {
                label: "Login",
                onClick: () => navigate('/login'),
            },
        });
        return;
    }

    if (userRating === 0) {
      toast({
        title: "Rating Diperlukan",
        description: "Silakan pilih rating sebelum mengirim.",
        variant: "destructive",
      });
      return;
    }

    try {
        await submitUserRating({ // Panggil API untuk mengirim rating
            eventId: event.id,
            userId: user.id, // Pastikan userId dikirim atau diturunkan oleh backend dari token
            rating: userRating,
            comment: userComment,
        });
        toast({
            title: "Ulasan Terkirim",
            description: "Terima kasih telah berbagi pengalaman Anda!",
        });
        setUserRating(0); // Reset form
        setUserComment(""); // Reset form
        setIsRatingOpen(false); // Tutup dialog

        // Muat ulang ulasan dan rating rata-rata untuk memperbarui UI
        const reviewsResponse = await getEventRatings(event.id);
        if (reviewsResponse && reviewsResponse.data && Array.isArray(reviewsResponse.data.data)) {
          setReviews(reviewsResponse.data.data);
        } else {
          setReviews([]);
        }

        const averageRatingResponse = await getAverageRating(event.id);
        if (averageRatingResponse && averageRatingResponse.data) {
          setAverageRating(averageRatingResponse.data.averageRating || 0);
          setReviewCount(averageRatingResponse.data.reviewCount || 0);
        } else {
          setAverageRating(0);
          setReviewCount(0);
        }

        // Pastikan status bergabung juga diupdate jika ini aksi pertama pengguna
        setIsJoined(true);
    } catch (err) {
        console.error("Gagal mengirim ulasan:", err);
        toast({
            title: "Pengiriman Gagal",
            description: err.response?.data?.message || "Tidak dapat mengirim ulasan Anda. Silakan coba lagi.",
            variant: "destructive",
        });
    }
  };

  const handleLikeReview = (reviewId) => {
    // Fungsionalitas ini memerlukan endpoint backend untuk menyukai ulasan
    // Untuk saat ini, tetap sebagai pembaruan mock lokal untuk menunjukkan interaksi
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, likes: (review.likes || 0) + 1 } : review
    );
    setReviews(updatedReviews);
    toast({
        title: "Ulasan Disukai",
        description: "Anda menemukan ulasan ini membantu!",
    });
  };

  if (loading) {
    return <div className="text-center py-10">Memuat detail event...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="text-center py-10">Event tidak ditemukan.</div>;
  }

  // Helper untuk format tanggal
  const formattedDate = event.date ? event.date : 'Tanggal tidak tersedia';
  const displayLocation = event.location ? `${event.location}, ${event.region}` : 'Lokasi tidak tersedia';

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-1 -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Events
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
              <Calendar className="h-4 w-4 mr-2" /> {formattedDate}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> {displayLocation},{" "}
              {provinceName} {/* Menggunakan state provinceName */}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" /> {event.attendees || "N/A"}{" "}
              attending
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className={isJoined ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={handleJoinEvent}
            >
              {isJoined ? "Tinggalkan Event" : "Gabung Event"}
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20"
            >
              <Share2 className="h-4 w-4 mr-2" /> Bagikan
            </Button>
            <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/20"
                >
                  <Star className="h-4 w-4 mr-2" /> Beri Rating
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Beri Rating Event ini</DialogTitle>
                  <DialogDescription>
                    Bagikan pengalaman Anda tentang "{event.name}"
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-center text-sm font-medium">
                      Rating Anda
                    </p>
                    <RatingStars
                      rating={userRating}
                      onRatingChange={setUserRating}
                      editable={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Ulasan Anda (Opsional)
                    </p>
                    <Textarea
                      placeholder="Bagikan pengalaman Anda tentang event ini..."
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
                    Batal
                  </Button>
                  <Button onClick={handleSubmitRating}>Kirim Rating</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Detail</TabsTrigger>
          <TabsTrigger value="reviews">Ulasan ({reviewCount})</TabsTrigger>
          <TabsTrigger value="related">Terkait</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deskripsi Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">
                {event.description}
                {"\n\n"}
                Bergabunglah bersama kami untuk pengalaman budaya yang tak terlupakan di {event.name}
                . Event ini merayakan warisan budaya yang kaya dari{" "}
                {event.region} di {provinceName}.{"\n\n"}
                Anda akan memiliki kesempatan untuk menyaksikan pertunjukan tradisional, berpartisipasi dalam aktivitas budaya interaktif,
                dan menikmati kuliner lokal otentik. Event ini sempurna untuk
                keluarga, wisatawan, dan siapa saja yang tertarik untuk belajar lebih banyak tentang
                lanskap budaya Indonesia yang beragam.
                {"\n\n"}
                Jangan lewatkan kesempatan ini untuk membenamkan diri dalam keindahan dan
                kekayaan budaya Indonesia!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detail Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-medium text-sm mb-1">Tanggal & Waktu</h3>
                  <p>{formattedDate} • 10:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Lokasi</h3>
                  <p>
                    {displayLocation}, {provinceName}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Penyelenggara</h3>
                  <p>Dinas Kebudayaan {provinceName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Kategori</h3>
                  <Badge variant="outline">Budaya</Badge>
                  <Badge variant="outline" className="ml-2">
                    Pameran
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lokasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md overflow-hidden h-[300px] bg-muted flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Tampilan peta untuk {event.location}, {event.region},{" "}
                    {provinceName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating & Ulasan Event</CardTitle>
              <CardDescription>
                Lihat apa kata orang lain tentang event ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      dari 5
                    </span>
                  </div>
                  <RatingStars rating={averageRating} />
                  <p className="text-sm text-muted-foreground">
                    Berdasarkan {reviewCount} ulasan
                  </p>
                </div>
                <div className="md:flex-1">
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsRatingOpen(true)}
                    >
                      <Star className="h-4 w-4 mr-2" /> Tulis Ulasan
                    </Button>
                  </DialogTrigger>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                        {/* Asumsi review.user.username atau review.username */}
                                        <AvatarImage src={review.user?.avatar || "/placeholder.svg"} alt={review.user?.username || "Pengguna"} />
                                        <AvatarFallback>
                                            {review.user?.username ? review.user.username.charAt(0).toUpperCase() : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{review.user?.username || "Pengguna Anonim"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString()}
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
                                <ThumbsUp className="h-3 w-3 mr-1" /> {review.likes || 0}{" "}
                                Membantu
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-10">Belum ada ulasan. Jadilah yang pertama memberikan ulasan!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Terkait</CardTitle>
              <CardDescription>
                Event lain yang mungkin Anda minati
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <p className="col-span-full text-center text-muted-foreground">Event terkait akan dimuat di sini.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}