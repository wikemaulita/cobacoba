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
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Pencil,
  Plus,
  Trash2,
  Landmark,
  Music,
  Map,
  Crown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCultures, getProvinces, getRegions, createCulture, updateCulture, deleteCulture } from '@/lib/api';

const cultureTypes = [
  "Tarian",
  "Musik",
  "Kerajinan",
  "Wayang",
  "Upacara",
  "Kuliner",
  "Pakaian",
  "Arsitektur",
];

export default function CultureManagement() {
  const { toast } = useToast();
  const [cultures, setCultures] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    gambar: "",
    tipe: "",
    daerahId: "",
    provinsiId: "", // Helper untuk filter
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCulturesProvincesAndRegions = async () => {
    try {
      setLoading(true);
      setError(null);
      const [culturesResponse, provincesResponse, regionsResponse] = await Promise.all([
        getCultures(),
        getProvinces(),
        getRegions()
      ]);

      const culturesArray = culturesResponse.data?.budaya?.data || [];
      const provincesArray = provincesResponse.data?.provinsi?.data || [];
      const regionsArray = regionsResponse.data?.daerah?.data || [];

      const culturesData = culturesArray.map(culture => {
        const region = regionsArray.find(r => r.id === culture.daerahId);
        const province = provincesArray.find(p => p.id === region?.provinsiId);
        return {
          ...culture,
          provinceName: province?.nama || 'N/A',
          regionName: region?.nama || 'N/A'
        };
      });

      setCultures(culturesData);
      setProvinces(provincesArray);
      setAllRegions(regionsArray);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCulturesProvincesAndRegions();
  }, []);

  const handleAddNew = () => {
    setSelectedCulture(null);
    setFormData({
      nama: "",
      deskripsi: "",
      gambar: "",
      tipe: "",
      daerahId: "",
      provinsiId: "",
    });
    setAvailableRegions([]);
    setIsDialogOpen(true);
  };

  const handleView = (culture) => {
    setSelectedCulture(culture);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (culture) => {
    const region = allRegions.find(r => r.id === culture.daerahId);
    setSelectedCulture(culture);
    setFormData({
      nama: culture.nama || "",
      deskripsi: culture.deskripsi || "",
      gambar: culture.gambar || "",
      tipe: culture.tipe || "",
      daerahId: culture.daerahId || "",
      provinsiId: region?.provinsiId || "",
    });
    setAvailableRegions(allRegions.filter(r => r.provinsiId === region?.provinsiId));
    setIsDialogOpen(true);
  };

  const handleDelete = (culture) => {
    setSelectedCulture(culture);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (value) => {
    const provinceId = Number(value);
    setFormData((prev) => ({ ...prev, provinsiId: provinceId, daerahId: "" }));
    setAvailableRegions(allRegions.filter(region => region.provinsiId === provinceId));
  };

  const handleRegionChange = (value) => {
    setFormData((prev) => ({ ...prev, daerahId: Number(value) }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, tipe: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { provinsiId, ...payload } = formData;
    try {
      if (selectedCulture) {
        await updateCulture(selectedCulture.id, payload);
        toast({ title: "Culture Updated", description: `${payload.nama} has been updated.` });
      } else {
        await createCulture(payload);
        toast({ title: "Culture Added", description: `${payload.nama} has been added.` });
      }
      fetchCulturesProvincesAndRegions();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save culture:", err);
      toast({ title: "Operation Failed", description: err.response?.data?.message || "Failed to save cultural item.", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCulture(selectedCulture.id);
      toast({ title: "Culture Deleted", description: `${selectedCulture.nama} has been deleted.` });
      fetchCulturesProvincesAndRegions();
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete culture:", err);
      toast({ title: "Deletion Failed", description: err.response?.data?.message || "Failed to delete cultural item.", variant: "destructive" });
    }
  };

  if (loading) return <div className="text-center py-10">Loading cultural items...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Culture Management</CardTitle>
          <CardDescription>Add, edit, or remove cultural items in the system</CardDescription>
        </div>
        <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add Culture</Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-4">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Cultures</CardTitle><Landmark className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{cultures.length}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Most Common Type</CardTitle><Music className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">N/A</div><p className="text-xs text-muted-foreground">Data from backend</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Provinces Covered</CardTitle><Map className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{provinces.length}</div><p className="text-xs text-muted-foreground">All provinces represented</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Richest Province</CardTitle><Crown className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">N/A</div><p className="text-xs text-muted-foreground">Data from backend</p></CardContent></Card>
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Region</TableHead><TableHead>Province</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {cultures.length > 0 ? (
              cultures.map((culture) => (
                <TableRow key={culture.id}>
                  <TableCell><img src={culture.gambar || "/placeholder.svg"} alt={culture.nama} className="h-10 w-10 rounded-md object-cover" /></TableCell>
                  <TableCell className="font-medium">{culture.nama}</TableCell>
                  <TableCell><Badge variant="outline">{culture.tipe}</Badge></TableCell>
                  <TableCell>{culture.regionName}</TableCell>
                  <TableCell>{culture.provinceName}</TableCell>
                  <TableCell className="text-right"><div className="flex justify-end space-x-2"><Button variant="outline" size="icon" onClick={() => handleView(culture)}><Eye className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => handleEdit(culture)}><Pencil className="h-4 w-4" /></Button><Button variant="outline" size="icon" className="text-red-600" onClick={() => handleDelete(culture)}><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                </TableRow>
              ))
            ) : (<TableRow><TableCell colSpan={6} className="text-center py-4">No cultural items found.</TableCell></TableRow>)}
          </TableBody>
        </Table>
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader><DialogTitle>Culture Details</DialogTitle></DialogHeader>
            {selectedCulture && (
              <div className="grid gap-4">
                <div className="flex justify-center"><img src={selectedCulture.gambar || "/placeholder.svg"} alt={selectedCulture.nama} className="h-40 w-40 rounded-md object-cover" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm font-medium">Name</p><p className="text-sm">{selectedCulture.nama}</p></div>
                  <div><p className="text-sm font-medium">Type</p><Badge variant="outline">{selectedCulture.tipe}</Badge></div>
                  <div><p className="text-sm font-medium">Region</p><p className="text-sm">{selectedCulture.regionName}</p></div>
                  <div><p className="text-sm font-medium">Province</p><p className="text-sm">{selectedCulture.provinceName}</p></div>
                </div>
                <div><p className="text-sm font-medium">Description</p><p className="text-sm">{selectedCulture.deskripsi}</p></div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              <Button onClick={() => { setIsViewDialogOpen(false); handleEdit(selectedCulture); }}>Edit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{selectedCulture ? "Edit Culture" : "Add New Culture"}</DialogTitle>
              <DialogDescription>{selectedCulture ? "Update the culture details below" : "Fill in the details for the new culture"}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2"><Label htmlFor="nama">Culture Name</Label><Input id="nama" name="nama" value={formData.nama} onChange={handleInputChange} required /></div>
                <div className="grid gap-2"><Label htmlFor="tipe">Type</Label>
                  <Select value={formData.tipe} onValueChange={handleTypeChange} required>
                    <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                    <SelectContent>{cultureTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label htmlFor="province">Province</Label>
                  <Select value={String(formData.provinsiId)} onValueChange={handleProvinceChange} required>
                    <SelectTrigger><SelectValue placeholder="Select a province" /></SelectTrigger>
                    <SelectContent>{provinces.map((province) => (<SelectItem key={province.id} value={String(province.id)}>{province.nama}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label htmlFor="daerah">Region</Label>
                  <Select value={String(formData.daerahId)} onValueChange={handleRegionChange} disabled={!formData.provinsiId || availableRegions.length === 0} required>
                    <SelectTrigger><SelectValue placeholder="Select a region" /></SelectTrigger>
                    <SelectContent>{availableRegions.map((region) => (<SelectItem key={region.id} value={String(region.id)}>{region.nama}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label htmlFor="deskripsi">Description</Label><Textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} rows={4} required /></div>
                <div className="grid gap-2"><Label htmlFor="gambar">Image URL</Label><Input id="gambar" name="gambar" value={formData.gambar} onChange={handleInputChange} placeholder="/placeholder.svg?height=100&width=100" required />
                  {formData.gambar && (<div className="mt-2"><p className="text-sm text-muted-foreground mb-1">Preview:</p><img src={formData.gambar || "/placeholder.svg"} alt="Preview" className="h-20 w-20 rounded-md object-cover"/></div>)}
                </div>
              </div>
              <DialogFooter><Button type="submit">{selectedCulture ? "Save Changes" : "Add Culture"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>Are you sure you want to delete <span className="font-medium">{selectedCulture?.nama}</span>? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
