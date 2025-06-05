// src/pages/user/DetailPulau.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Map } from "lucide-react";
// Import sections data directly from pulau.jsx for temporary local mock data
import { sections } from "@/pages/pulau"; //

export default function DetailPulauPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pulau, setPulau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Find the island data from the local 'sections' array
    // In a real application, you would fetch this from a backend API:
    // const response = await getPulauDetail(id);
    // setPulau(response.data);
    const foundPulau = sections.find(p => String(p.id) === id); //

    if (foundPulau) {
      setPulau(foundPulau);
    } else {
      setError("Pulau tidak ditemukan.");
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Memuat detail pulau...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!pulau) {
    return <div className="text-center py-10">Pulau tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="flex items-center gap-1 -ml-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Pulau
      </Button>

      <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
        <img
          src={pulau.imageUrl || "/placeholder.svg?height=600&width=1200"} //
          alt={pulau.title} //
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 z-20 text-white max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{pulau.title}</h1> {/* */}
          <p className="text-xl opacity-90">{pulau.description}</p> {/* */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deskripsi Pulau</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{pulau.description}</p> {/* */}
          <p className="mt-4 text-muted-foreground">
            Jelajahi keindahan dan kekayaan budaya dari {pulau.title}. Setiap sudut pulau ini menyimpan cerita dan tradisi yang memukau.
          </p>
        </CardContent>
      </Card>

      {/* Bagian opsional untuk menampilkan provinsi, budaya, atau event terkait */}
      {/* Anda akan membutuhkan endpoint backend atau logika filtering untuk mengisi bagian ini */}
      <Card>
        <CardHeader>
          <CardTitle>Provinsi Terkait</CardTitle>
          <CardDescription>
            Daftar provinsi yang ada di pulau {pulau.title}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            <Map className="h-6 w-6 mr-2" /> Data provinsi akan dimuat di sini dari backend.
          </div>
          {/* Contoh struktur jika data provinsi sudah ada */}
          {/* {pulau.provinces && pulau.provinces.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pulau.provinces.map((province) => (
                <Card key={province.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium">{province.name}</h4>
                    <p className="text-sm text-muted-foreground">{province.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Tidak ada data provinsi terkait saat ini.</p>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}