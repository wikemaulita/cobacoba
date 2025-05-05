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
import { Pencil, Plus, Trash2, MapPin, Map, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockRegions = [
  {
    id: 1,
    name: "Denpasar",
    image: "/placeholder.svg?height=100&width=100",
    province: "Bali",
  },
  {
    id: 2,
    name: "Kuta",
    image: "/placeholder.svg?height=100&width=100",
    province: "Bali",
  },
  {
    id: 3,
    name: "Yogyakarta City",
    image: "/placeholder.svg?height=100&width=100",
    province: "DI Yogyakarta",
  },
  {
    id: 4,
    name: "Bandung",
    image: "/placeholder.svg?height=100&width=100",
    province: "Jawa Barat",
  },
  {
    id: 5,
    name: "Surabaya",
    image: "/placeholder.svg?height=100&width=100",
    province: "Jawa Timur",
  },
];

// Mock data for provinces (for dropdown)
const mockProvinces = [
  { id: 1, name: "Bali" },
  { id: 2, name: "DI Yogyakarta" },
  { id: 3, name: "Jawa Barat" },
  { id: 4, name: "Jawa Tengah" },
  { id: 5, name: "Jawa Timur" },
];

export default function RegionManagement() {
  const { toast } = useToast();
  const [regions, setRegions] = useState(mockRegions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    province: "",
  });

  const handleAddNew = () => {
    setSelectedRegion(null);
    setFormData({
      name: "",
      image: "",
      province: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (region) => {
    setSelectedRegion(region);
    setFormData({
      name: region.name,
      image: region.image,
      province: region.province,
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

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      province: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedRegion) {
      // Edit existing region
      const updatedRegions = regions.map((region) =>
        region.id === selectedRegion.id ? { ...region, ...formData } : region
      );
      setRegions(updatedRegions);
      toast({
        title: "Region Updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      // Add new region
      const newRegion = {
        id: regions.length + 1,
        ...formData,
      };
      setRegions([...regions, newRegion]);
      toast({
        title: "Region Added",
        description: `${formData.name} has been added successfully`,
      });
    }

    setIsDialogOpen(false);
  };

  const confirmDelete = () => {
    const updatedRegions = regions.filter(
      (region) => region.id !== selectedRegion.id
    );
    setRegions(updatedRegions);
    toast({
      title: "Region Deleted",
      description: `${selectedRegion.name} has been deleted successfully`,
    });
    setIsDeleteDialogOpen(false);
  };

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
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                All provinces have regions
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
              <div className="text-2xl font-bold">Surabaya</div>
              <p className="text-xs text-muted-foreground">3.1M population</p>
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
            {regions.map((region) => (
              <TableRow key={region.id}>
                <TableCell>
                  <img
                    src={region.image || "/placeholder.svg"}
                    alt={region.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{region.name}</TableCell>
                <TableCell>{region.province}</TableCell>
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
            ))}
          </TableBody>
        </Table>

        {/* Add/Edit Dialog */}
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
                    value={formData.province}
                    onValueChange={handleSelectChange}
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

        {/* Delete Confirmation Dialog */}
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
