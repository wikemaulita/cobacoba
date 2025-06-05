// src/pages/user/DetailCulture.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft } from "lucide-react";
import { getCultureDetail, getCultures } from '@/lib/api'; // Import API functions

export default function CultureDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [culture, setCulture] = useState(null);
  const [relatedCultures, setRelatedCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCultureDetails = async () => {
      try {
        setLoading(true);
        const response = await getCultureDetail(id);
        setCulture(response.data);
        setLoading(false);

        // Fetch related cultures (example: same province/type, exclude current)
        const allCulturesResponse = await getCultures();
        const filteredRelated = allCulturesResponse.data.filter(
          (item) => item.id !== Number(id) && item.province === response.data.province
        ).slice(0, 3); // Get up to 3 related items
        setRelatedCultures(filteredRelated);

      } catch (err) {
        console.error("Failed to fetch culture details:", err);
        setError("Failed to load cultural item details. It might not exist.");
        setLoading(false);
      }
    };

    fetchCultureDetails();
  }, [id]); // Re-fetch when ID changes

  if (loading) {
    return <div className="text-center py-10">Loading cultural item...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!culture) {
    return <div className="text-center py-10">Cultural item not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-1 -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Cultural Exhibitions
      </Button>

      <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
        <img
          src={culture.image || "/placeholder.svg?height=600&width=1200"}
          alt={culture.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 z-20 text-white max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{culture.name}</h1>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex items-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {culture.type}
              </Badge>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> {culture.region}, {culture.province}
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{culture.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-medium text-sm mb-1">Type</h3>
              <Badge variant="outline">{culture.type}</Badge>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Origin</h3>
              <p>{culture.region}, {culture.province}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {relatedCultures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Cultural Items</CardTitle>
            <CardDescription>
              Other cultural items you might be interested in from {culture.province}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedCultures.map((relatedCulture) => (
                <Card
                  key={relatedCulture.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/user/cultures/${relatedCulture.id}`)}
                >
                  <div className="h-32 relative">
                    <img
                      src={relatedCulture.image || "/placeholder.svg?height=200&width=400"}
                      alt={relatedCulture.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium line-clamp-1">{relatedCulture.name}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" /> {relatedCulture.region}, {relatedCulture.province}
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">{relatedCulture.type}</Badge>
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