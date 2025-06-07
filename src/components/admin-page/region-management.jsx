// src/components/admin-page/region-management.jsx
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
import { Pencil, Plus, Trash2, MapPin, Map, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Import API functions
import { getRegions, getProvinces, createRegion, updateRegion, deleteRegion } from '@/lib/api';

export default function RegionManagement() {
  const { toast } = useToast();
  const [regions, setRegions] = useState([]); 
  const [provinces, setProvinces] = useState([]); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    provinceId: "", 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRegionsAndProvinces = async () => {
    try {
      setLoading(true);
      const [regionsResponse, provincesResponse] = await Promise.all([
        getRegions(),
        getProvinces()
      ]);
      const regionsData = regionsResponse.data.map(region => ({
        ...region,
        provinceName: provincesResponse.data.find(p => p.id === region.provinceId)?.name || 'Unknown Province'
      }));
      setRegions(regionsData);
      setProvinces(provincesResponse.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch regions or provinces:", err);
      setError("Failed to load regions or provinces. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionsAndProvinces();
  }, []);

  const handleAddNew = () => {
    setSelectedRegion(null);
    setFormData({
      name: "",
      image: "",
      provinceId: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (region) => {
    setSelectedRegion(region);
    setFormData({
      name: region.name,
      image: region.image,
      provinceId: region.provinceId, 
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (region) => {
    setSelectedRegion(region);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      provinceId: Number(value), 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRegion) {
        await updateRegion(selectedRegion.id, formData);
        toast({
          title: "Region Updated",
          description: `${formData.name} has been updated successfully`,
        });
      } else {
        await createRegion(formData);
        toast({
          title: "Region Added",
          description: `${formData.name} has been added successfully`,
        });
      }
      fetchRegionsAndProvinces(); 
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save region:", err);
      toast({
        title: "Operation Failed",
        description: err.response?.data?.message || "Failed to save region. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteRegion(selectedRegion.id);
      toast({
        title: "Region Deleted",
        description: `${selectedRegion.name} has been deleted successfully`,
      });
      fetchRegionsAndProvinces(); 
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete region:", err);
      toast({
        title: "Deletion Failed",
        description: err.response?.data?.message || "Failed to delete region. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading regions...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Region Management</CardTitle>
          <CardDescription>
            Add, edit, or remove regions in the system
          </CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Region
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Regions
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{regions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Provinces Covered
              </CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{provinces.length}</div>
              <p className="text-xs text-muted-foreground">
                All provinces represented
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Populous
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div> 
              <p className="text-xs text-muted-foreground">Data from backend</p>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Province</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions.length > 0 ? (
              regions.map((region) => (
                <TableRow key={region.id}>
                  <TableCell>
                    <img
                      src={region.image || "/placeholder.svg"}
                      alt={region.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{region.name}</TableCell>
                  <TableCell>{region.provinceName}</TableCell> 
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(region)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDelete(region)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No regions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedRegion ? "Edit Region" : "Add New Region"}
              </DialogTitle>
              <DialogDescription>
                {selectedRegion
                  ? "Update the region details below"
                  : "Fill in the details for the new region"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Region Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="province">Province</Label>
                  <Select
                    value={String(formData.provinceId)} 
                    onValueChange={handleProvinceSelectChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={String(province.id)}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="/placeholder.svg?height=100&width=100"
                    required
                  />
                  {formData.image && (
                    <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-1">
                            Preview:
                          </p>
                          <img
                            src={formData.image || "/placeholder.svg"}
                            alt="Preview"
                            className="h-20 w-20 rounded-md object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {selectedRegion ? "Save Changes" : "Add Region"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-medium">{selectedRegion?.name}</span>?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      );
    }