// src/pages/user/DetailPulau.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Map } from "lucide-react";

// Hapus import sections dari pulau.jsx karena kita akan mengambil data dari backend
// import { sections } from "@/pages/pulau";

// Impor fungsi API yang diperlukan
import { getProvinceDetail, getRegions } from '@/lib/api'; // Pastikan path ini benar

export default function DetailPulauPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pulau, setPulau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk daerah terkait
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [errorRegions, setErrorRegions] = useState(null);

  useEffect(() => {
    const fetchPulauDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProvinceDetail(id); // Panggil API untuk detail provinsi
        console.log("Respons API Detail Pulau:", response); // Log respons untuk debugging

        // PERBAIKAN: Akses data detail provinsi dari response.data.provinsi
        if (response && response.data && response.data.provinsi) {
          setPulau(response.data.provinsi);
        } else {
          setError("Pulau tidak ditemukan atau format data tidak sesuai.");
          setPulau(null);
        }
      } catch (err) {
        console.error("Gagal memuat detail pulau:", err);
        setError("Gagal memuat detail pulau. Silakan coba lagi nanti.");
        setPulau(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegionsByProvince = async () => {
      setLoadingRegions(true);
      setErrorRegions(null);
      try {
        // Panggil API untuk daerah terkait dengan provinsi ini
        const response = await getRegions({ provinsiId: id }); // Asumsi API getRegions menerima params
        console.log("Respons API Daerah Terkait:", response); // Log respons untuk debugging

        // PERBAIKAN: Akses data daerah dari response.data.daerah.data
        if (response && response.data && response.data.daerah && Array.isArray(response.data.daerah.data)) {
          setRegions(response.data.daerah.data);
        } else {
          console.warn("Format data daerah terkait tidak sesuai harapan.");
          setRegions([]); // Set ke array kosong jika tidak sesuai
        }
      } catch (err) {
        console.error("Gagal memuat daerah terkait:", err);
        setErrorRegions("Gagal memuat daerah terkait.");
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchPulauDetail();
    fetchRegionsByProvince(); // Panggil juga untuk daerah terkait
  }, [id]); // id sebagai dependency agar effect berjalan lagi jika ID berubah

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
          src={pulau.gambar || "/placeholder.svg?height=600&width=1200"} // Menggunakan `pulau.gambar` dari API
          alt={pulau.nama} // Menggunakan `pulau.nama` dari API
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 z-20 text-white max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{pulau.nama}</h1> {/* Menggunakan `pulau.nama` */}
          {/* Anda mungkin ingin menambahkan deskripsi dari API jika ada, atau buat dinamis seperti ini: */}
          <p className="text-xl opacity-90">Jelajahi keindahan budaya {pulau.nama}.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deskripsi Pulau</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Menggunakan `pulau.description` jika ada, atau buat dinamis */}
          <p className="whitespace-pre-line">
            {pulau.description || `Jelajahi keindahan dan kekayaan budaya dari ${pulau.nama}. Setiap sudut provinsi ini menyimpan cerita dan tradisi yang memukau.`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daerah Terkait</CardTitle> {/* Mengubah judul menjadi "Daerah Terkait" */}
          <CardDescription>
            Daftar daerah yang ada di provinsi {pulau.nama}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRegions ? (
            <div className="text-center flex items-center justify-center h-24 text-muted-foreground">
              <Map className="h-6 w-6 mr-2" /> Memuat data daerah...
            </div>
          ) : errorRegions ? (
            <div className="text-center text-red-500">{errorRegions}</div>
          ) : regions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((region) => (
                <Card key={region.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium">{region.nama}</h4>
                    {/* Asumsi properti nama dan deskripsi di objek daerah */}
                    {region.description && <p className="text-sm text-muted-foreground">{region.description}</p>}
                    {/* Tambahkan link ke detail daerah jika ada route-nya */}
                    {/* <Link to={`/daerah/${region.id}`} className="text-blue-600 hover:underline mt-2 inline-block">Lihat Detail</Link> */}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center flex items-center justify-center h-24 text-muted-foreground">
              Tidak ada daerah terkait saat ini untuk {pulau.nama}.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}