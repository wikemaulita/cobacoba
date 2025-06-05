import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  Eye,
  Pencil,
  Plus,
  Trash2,
  CalendarClock,
  Map,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { mockProvinces, mockRegions, getProvinceFromRegion, getDaerahIdFromRegion } from "@/lib/mock-data"; // Import fungsi pembantu

export default function EventManagement() {
  const { toast } = useToast();
  const { token } = useAuth(); // Ambil token dari AuthContext
  const [events, setEvents] = useState([]); // Inisialisasi kosong, akan diisi dari API
  const [loading, setLoading] = useState(true); // State loading untuk tabel
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [formData, setFormData] = useState({
    nama: "", // Sesuai API backend
    deskripsi: "", // Sesuai API backend
    gambar: null, // Untuk file gambar
    gambarPreview: "", // Untuk pratinjau gambar
    lokasi: "", // Sesuai API backend
    tanggal: "", // Sesuai API backend
    daerahId: "", // Sesuai API backend, penting!
    // Frontend-specific fields for dropdowns (not sent to API directly)
    province: "",
    region: "",
  });

  // Fungsi untuk mengambil event dari backend
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/events');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mappedEvents = data.event.data.map(event => ({
        id: event.id,
        nama: event.nama,
        deskripsi: event.deskripsi,
        gambar: event.gambar,
        tanggal: event.tanggal, // Tetap string ISO untuk konsistensi
        lokasi: event.lokasi,
        daerahId: event.daerahId,
        // Properti tambahan untuk frontend display
        region: event.daerah?.nama || "N/A", // Gunakan optional chaining
        province: getProvinceFromRegion(event.daerah?.nama || ""),
      }));
      setEvents(mappedEvents);
    } catch (error) {
      toast({
        title: "Gagal Memuat Event",
        description: `Terjadi kesalahan: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(); // Panggil saat komponen dimuat
  }, []);

  const handleAddNew = () => {
    setSelectedEvent(null);
    setFormData({
      nama: "",
      deskripsi: "",
      gambar: null,
      gambarPreview: "",
      lokasi: "",
      tanggal: "",
      daerahId: "",
      province: "",
      region: "",
    });
    setAvailableRegions([]);
    setIsDialogOpen(true);
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      nama: event.nama,
      deskripsi: event.deskripsi,
      gambar: null, // Jangan set file langsung, hanya preview
      gambarPreview: event.gambar, // URL gambar yang sudah ada
      lokasi: event.lokasi,
      tanggal: event.tanggal,
      daerahId: event.daerahId,
      province: event.province,
      region: event.region,
    });
    setAvailableRegions(mockRegions[event.province] || []);
    setIsDialogOpen(true);
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar" && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        gambar: files[0],
        gambarPreview: URL.createObjectURL(files[0]), // Buat URL preview
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProvinceChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      province: value,
      region: "", // Reset region when province changes
      daerahId: "", // Reset daerahId
    }));
    setAvailableRegions(mockRegions[value] || []);
  };

  const handleRegionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      region: value,
      daerahId: getDaerahIdFromRegion(value), // Dapatkan daerahId dari nama region
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      tanggal: date ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") : "", // Format ISO 8601
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki otorisasi. Silakan login kembali.",
        variant: "destructive",
      });
      return;
    }

    const endpoint = selectedEvent
      ? `http://localhost:3000/events/${selectedEvent.id}`
      : 'http://localhost:3000/events/create-event';
    const method = selectedEvent ? 'PUT' : 'POST';

    // Buat FormData untuk mengirim data termasuk file
    const formDataToSend = new FormData();
    formDataToSend.append('nama', formData.nama);
    formDataToSend.append('deskripsi', formData.deskripsi);
    if (formData.gambar) { // Hanya tambahkan gambar jika ada file baru
      formDataToSend.append('gambar', formData.gambar);
    }
    formDataToSend.append('lokasi', formData.lokasi);
    formDataToSend.append('tanggal', formData.tanggal);
    if (formData.daerahId) { // Hanya tambahkan daerahId jika ada
        formDataToSend.append('daerahId', formData.daerahId);
    } else {
        // Fallback jika daerahId kosong, mungkin menggunakan ID default atau error
        toast({
            title: "Gagal",
            description: "Daerah ID harus dipilih.",
            variant: "destructive",
        });
        return;
    }
    
    // Untuk PUT, kita tidak perlu kirim semua field jika tidak berubah,
    // tapi FormData akan mengirim semua yang di-append. Backend harus menangani ini.

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Penting: Jangan set 'Content-Type': 'multipart/form-data' secara manual
          // Browser akan mengaturnya secara otomatis dengan boundary yang benar saat Anda menggunakan FormData
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: selectedEvent ? "Event Diperbarui" : "Event Ditambahkan",
          description: data.message || `${formData.nama} berhasil ${selectedEvent ? 'diperbarui' : 'ditambahkan'}`,
        });
        setIsDialogOpen(false);
        fetchEvents(); // Ambil ulang data event setelah sukses
      } else {
        toast({
          title: selectedEvent ? "Gagal Memperbarui Event" : "Gagal Menambahkan Event",
          description: data.message || "Terjadi kesalahan. Silakan coba lagi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Tidak dapat terhubung ke server. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!token) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki otorisasi. Silakan login kembali.",
          variant: "destructive",
        });
        return;
    }

    try {
      const response = await fetch(`http://localhost:3000/events/${selectedEvent.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Event Dihapus",
          description: data.message || `${selectedEvent.nama} berhasil dihapus.`,
        });
        setIsDeleteDialogOpen(false);
        fetchEvents(); // Ambil ulang data event setelah penghapusan
      } else {
        toast({
          title: "Gagal Menghapus Event",
          description: data.message || "Terjadi kesalahan saat menghapus event.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Tidak dapat terhubung ke server. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manajemen Event</CardTitle>
          <CardDescription>
            Tambah, edit, atau hapus event budaya dalam sistem
          </CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Event Mendatang
              </CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* Hitung event mendatang dari data API */}
                {events.filter(event => new Date(event.tanggal) > new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Di 30 hari ke depan
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Provinsi Teraktif
              </CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* Hitung provinsi teraktif dari data API */}
                {
                  Object.entries(events.reduce((acc, event) => {
                    acc[event.province] = (acc[event.province] || 0) + 1;
                    return acc;
                  }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {
                  Object.entries(events.reduce((acc, event) => {
                    acc[event.province] = (acc[event.province] || 0) + 1;
                    return acc;
                  }, {})).sort((a, b) => b[1] - a[1])[0]?.[1] || 0
                } event tahun ini
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bulan Tersibuk
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* Hitung bulan tersibuk dari data API */}
                {
                    (() => {
                        const monthCounts = events.reduce((acc, event) => {
                            const month = new Date(event.tanggal).toLocaleString('en-US', { month: 'long' });
                            acc[month] = (acc[month] || 0) + 1;
                            return acc;
                        }, {});
                        return Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
                    })()
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {
                    (() => {
                        const monthCounts = events.reduce((acc, event) => {
                            const month = new Date(event.tanggal).toLocaleString('en-US', { month: 'long' });
                            acc[month] = (acc[month] || 0) + 1;
                            return acc;
                        }, {});
                        return Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]?.[1] || 0;
                    })()
                } event terjadwal
              </p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Memuat event...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">Tidak ada event untuk ditampilkan.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Daerah</TableHead>
                <TableHead>Provinsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <img
                      src={event.gambar || "/placeholder.svg"}
                      alt={event.nama}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{event.nama}</TableCell>
                  <TableCell>{new Date(event.tanggal).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{event.lokasi}</TableCell>
                  <TableCell>{event.region}</TableCell>
                  <TableCell>{event.province}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleView(event)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(event)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDelete(event)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}


        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Detail Event</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="grid gap-4">
                <div className="flex justify-center">
                  <img
                    src={selectedEvent.gambar || "/placeholder.svg"}
                    alt={selectedEvent.nama}
                    className="h-40 w-40 rounded-md object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nama</p>
                    <p className="text-sm">{selectedEvent.nama}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tanggal</p>
                    <p className="text-sm">{new Date(selectedEvent.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lokasi</p>
                    <p className="text-sm">{selectedEvent.lokasi}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Daerah</p>
                    <p className="text-sm">{selectedEvent.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Provinsi</p>
                    <p className="text-sm">{selectedEvent.province}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Deskripsi</p>
                  <p className="text-sm">{selectedEvent.deskripsi}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Tutup
              </Button>
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEdit(selectedEvent);
                }}
              >
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? "Edit Event" : "Tambah Event Baru"}
              </DialogTitle>
              <DialogDescription>
                {selectedEvent
                  ? "Perbarui detail event di bawah ini"
                  : "Isi detail untuk event baru"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nama">Nama Event</Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tanggal">Tanggal</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.tanggal ? (
                          format(new Date(formData.tanggal), "PPP HH:mm")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          formData.tanggal ? new Date(formData.tanggal) : undefined
                        }
                        onSelect={handleDateChange}
                        // Anda mungkin perlu menambahkan picker waktu juga jika diperlukan
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lokasi">Lokasi</Label>
                  <Input
                    id="lokasi"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Select
                    value={formData.province}
                    onValueChange={handleProvinceChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProvinces.map((province) => (
                        <SelectItem key={province.id} value={province.name}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="region">Daerah</Label>
                  <Select
                    value={formData.region}
                    onValueChange={handleRegionChange}
                    disabled={!formData.province || availableRegions.length === 0}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih daerah" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gambar">Gambar Event</Label>
                  <Input
                    id="gambar"
                    name="gambar"
                    type="file"
                    onChange={handleInputChange}
                    // required={!selectedEvent} // Hanya wajib jika menambah baru
                  />
                  {(formData.gambarPreview || (selectedEvent && selectedEvent.gambar)) && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">
                        Pratinjau:
                      </p>
                      <img
                        src={formData.gambarPreview || selectedEvent?.gambar || "/placeholder.svg"}
                        alt="Pratinjau"
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {selectedEvent ? "Simpan Perubahan" : "Tambah Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus{" "}
                <span className="font-medium">{selectedEvent?.nama}</span>?
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Batal
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}