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
// Import API functions
import { getCultures, getProvinces, getRegions, createCulture, updateCulture, deleteCulture } from '@/lib/api';

const cultureTypes = [
  "Dance",
  "Music",
  "Craft",
  "Puppet",
  "Ceremony",
  "Culinary",
  "Clothing",
  "Architecture",
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
    name: "",
    description: "",
    image: "",
    type: "",
    regionId: "", 
    provinceId: "", 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchCulturesProvincesAndRegions = async () => {
    try {
      setLoading(true);
      const [culturesResponse, provincesResponse, regionsResponse] = await Promise.all([
        getCultures(),
        getProvinces(),
        getRegions() 
      ]);

      const culturesData = culturesResponse.data.map(culture => {
        const province = provincesResponse.data.find(p => p.id === culture.provinceId);
        const region = regionsResponse.data.find(r => r.id === culture.regionId);
        return {
          ...culture,
          provinceName: province?.name || 'Unknown Province',
          regionName: region?.name || 'Unknown Region'
        };
      });

      setCultures(culturesData);
      setProvinces(provincesResponse.data);
      setAllRegions(regionsResponse.data); 
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
      name: "",
      description: "",
      image: "",
      type: "",
      regionId: "",
      provinceId: "",
    });
    setAvailableRegions([]); 
    setIsDialogOpen(true);
  };

  const handleView = (culture) => {
    setSelectedCulture(culture);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (culture) => {
    setSelectedCulture(culture);
    setFormData({
      name: culture.name,
      description: culture.description,
      image: culture.image,
      type: culture.type,
      regionId: culture.regionId,
      provinceId: culture.provinceId,
    });
    setAvailableRegions(allRegions.filter(region => region.provinceId === culture.provinceId));
    setIsDialogOpen(true);
  };

  const handleDelete = (culture) => {
    setSelectedCulture(culture);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (value) => {
    const provinceId = Number(value);
    setFormData((prev) => ({
      ...prev,
      provinceId: provinceId,
      regionId: "", 
    }));
    setAvailableRegions(allRegions.filter(region => region.provinceId === provinceId));
  };

  const handleRegionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      regionId: Number(value),
    }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCulture) {
        await updateCulture(selectedCulture.id, formData);
        toast({
          title: "Culture Updated",
          description: `${formData.name} has been updated successfully`,
        });
      } else {
        await createCulture(formData);
        toast({
          title: "Culture Added",
          description: `${formData.name} has been added successfully`,
        });
      }
      fetchCulturesProvincesAndRegions(); 
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save culture:", err);
      toast({
        title: "Operation Failed",
        description: err.response?.data?.message || "Failed to save cultural item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCulture(selectedCulture.id);
      toast({
        title: "Culture Deleted",
        description: `${selectedCulture.name} has been deleted successfully`,
      });
      fetchCulturesProvincesAndRegions(); 
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete culture:", err);
      toast({
        title: "Deletion Failed",
        description: err.response?.data?.message || "Failed to delete cultural item. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading cultural items...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Culture Management</CardTitle>
          <CardDescription>
            Add, edit, or remove cultural items in the system
          </CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Culture
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Cultures
              </CardTitle>
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cultures.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Common Type
              </CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">Data from backend</p>
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
                Richest Province
              </CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
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
              <TableHead>Type</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Province</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cultures.length > 0 ? (
              cultures.map((culture) => (
                <TableRow key={culture.id}>
                  <TableCell>
                    <img
                      src={culture.image || "/placeholder.svg"}
                      alt={culture.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{culture.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{culture.type}</Badge>
                  </TableCell>
                  <TableCell>{culture.regionName}</TableCell>
                  <TableCell>{culture.provinceName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleView(culture)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(culture)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDelete(culture)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No cultural items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Culture Details</DialogTitle>
            </DialogHeader>
            {selectedCulture && (
              <div className="grid gap-4">
                <div className="flex justify-center">
                  <img
                    src={selectedCulture.image || "/placeholder.svg"}
                    alt={selectedCulture.name}
                    className="h-40 w-40 rounded-md object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm">{selectedCulture.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <Badge variant="outline">{selectedCulture.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Region</p>
                    <p className="text-sm">{selectedCulture.regionName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Province</p>
                    <p className="text-sm">{selectedCulture.provinceName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm">{selectedCulture.description}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEdit(selectedCulture);
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
                {selectedCulture ? "Edit Culture" : "Add New Culture"}
              </DialogTitle>
              <DialogDescription>
                {selectedCulture
                  ? "Update the culture details below"
                  : "Fill in the details for the new culture"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Culture Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={handleTypeChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cultureTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="province">Province</Label>
                  <Select
                    value={String(formData.provinceId)}
                    onValueChange={handleProvinceChange}
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
                  <Label htmlFor="region">Region</Label>
                  <Select
                    value={String(formData.regionId)}
                    onValueChange={handleRegionChange}
                    disabled={!formData.provinceId || availableRegions.length === 0}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRegions.map((region) => (
                        <SelectItem key={region.id} value={String(region.id)}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
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
                  {selectedCulture ? "Save Changes" : "Add Culture"}
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
                <span className="font-medium">{selectedCulture?.name}</span>?
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