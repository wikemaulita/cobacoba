import { useState } from "react";
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

const mockCultures = [
  {
    id: 1,
    name: "Kecak Dance",
    description:
      "Traditional Balinese dance and music drama developed in the 1930s.",
    image: "/placeholder.svg?height=100&width=100",
    type: "Dance",
    region: "Denpasar",
    province: "Bali",
  },
  {
    id: 2,
    name: "Wayang Kulit",
    description:
      "Traditional shadow puppet theatre in Indonesia and other parts of Southeast Asia.",
    image: "/placeholder.svg?height=100&width=100",
    type: "Puppet",
    region: "Yogyakarta City",
    province: "DI Yogyakarta",
  },
  {
    id: 3,
    name: "Angklung",
    description:
      "Traditional musical instrument made of bamboo tubes attached to a bamboo frame.",
    image: "/placeholder.svg?height=100&width=100",
    type: "Music",
    region: "Bandung",
    province: "Jawa Barat",
  },
];

// Mock data for provinces and regions
const mockProvinces = [
  { id: 1, name: "Bali" },
  { id: 2, name: "DI Yogyakarta" },
  { id: 3, name: "Jawa Barat" },
  { id: 4, name: "Jawa Tengah" },
  { id: 5, name: "Jawa Timur" },
];

const mockRegions = {
  Bali: ["Denpasar", "Kuta", "Ubud"],
  "DI Yogyakarta": ["Yogyakarta City", "Bantul", "Sleman"],
  "Jawa Barat": ["Bandung", "Bogor", "Cirebon"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang"],
  "Jawa Timur": ["Surabaya", "Malang", "Banyuwangi"],
};

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
  const [cultures, setCultures] = useState(mockCultures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    type: "",
    region: "",
    province: "",
  });

  const handleAddNew = () => {
    setSelectedCulture(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      type: "",
      region: "",
      province: "",
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
      region: culture.region,
      province: culture.province,
    });
    setAvailableRegions(mockRegions[culture.province] || []);
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
    setFormData((prev) => ({
      ...prev,
      province: value,
      region: "",
    }));
    setAvailableRegions(mockRegions[value] || []);
  };

  const handleRegionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      region: value,
    }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedCulture) {
      // Edit existing culture
      const updatedCultures = cultures.map((culture) =>
        culture.id === selectedCulture.id
          ? { ...culture, ...formData }
          : culture
      );
      setCultures(updatedCultures);
      toast({
        title: "Culture Updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      // Add new culture
      const newCulture = {
        id: cultures.length + 1,
        ...formData,
      };
      setCultures([...cultures, newCulture]);
      toast({
        title: "Culture Added",
        description: `${formData.name} has been added successfully`,
      });
    }

    setIsDialogOpen(false);
  };

  const confirmDelete = () => {
    const updatedCultures = cultures.filter(
      (culture) => culture.id !== selectedCulture.id
    );
    setCultures(updatedCultures);
    toast({
      title: "Culture Deleted",
      description: `${selectedCulture.name} has been deleted successfully`,
    });
    setIsDeleteDialogOpen(false);
  };

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
              <div className="text-2xl font-bold">Dance</div>
              <p className="text-xs text-muted-foreground">18 cultural items</p>
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
              <div className="text-2xl font-bold">5</div>
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
              <div className="text-2xl font-bold">Jawa Barat</div>
              <p className="text-xs text-muted-foreground">15 cultural items</p>
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
            {cultures.map((culture) => (
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
                <TableCell>{culture.region}</TableCell>
                <TableCell>{culture.province}</TableCell>
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
            ))}
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
                    <p className="text-sm">{selectedCulture.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Province</p>
                    <p className="text-sm">{selectedCulture.province}</p>
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
                    value={formData.province}
                    onValueChange={handleProvinceChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a province" />
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
                  <Label htmlFor="region">Region</Label>
                  <Select
                    value={formData.region}
                    onValueChange={handleRegionChange}
                    disabled={!formData.province}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a region" />
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

        {/* Delete Confirmation Dialog */}
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
