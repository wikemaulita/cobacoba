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
import { Pencil, Plus, Trash2, Map, MapPin, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Import API functions
import { getProvinces, createProvince, updateProvince, deleteProvince } from '@/lib/api';

export default function ProvinceManagement() {
  const { toast } = useToast();
  const [provinces, setProvinces] = useState([]); // State for provinces
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const response = await getProvinces();
      setProvinces(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch provinces:", err);
      setError("Failed to load provinces. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleAddNew = () => {
    setSelectedProvince(null);
    setFormData({
      name: "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (province) => {
    setSelectedProvince(province);
    setFormData({
      name: province.name,
      image: province.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (province) => {
    setSelectedProvince(province);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProvince) {
        // Edit existing province
        await updateProvince(selectedProvince.id, formData);
        toast({
          title: "Province Updated",
          description: `${formData.name} has been updated successfully`,
        });
      } else {
        // Add new province
        await createProvince(formData);
        toast({
          title: "Province Added",
          description: `${formData.name} has been added successfully`,
        });
      }
      fetchProvinces(); // Re-fetch data to update the table
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save province:", err);
      toast({
        title: "Operation Failed",
        description: err.response?.data?.message || "Failed to save province. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProvince(selectedProvince.id);
      toast({
        title: "Province Deleted",
        description: `${selectedProvince.name} has been deleted successfully`,
      });
      fetchProvinces(); // Re-fetch data to update the table
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete province:", err);
      toast({
        title: "Deletion Failed",
        description: err.response?.data?.message || "Failed to delete province. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading provinces...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Province Management</CardTitle>
          <CardDescription>
            Add, edit, or remove provinces in the system
          </CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Province
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Provinces
              </CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{provinces.length}</div>
            </CardContent>
          </Card>
          {/* These cards would need separate API calls or aggregated data from backend */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Regions
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">Data from backend</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Cultures
              </CardTitle>
              <Landmark className="h-4 w-4 text-muted-foreground" />
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {provinces.length > 0 ? (
              provinces.map((province) => (
                <TableRow key={province.id}>
                  <TableCell>
                    <img
                      src={province.image || "/placeholder.svg"}
                      alt={province.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{province.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(province)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDelete(province)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No provinces found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedProvince ? "Edit Province" : "Add New Province"}
              </DialogTitle>
              <DialogDescription>
                {selectedProvince
                  ? "Update the province details below"
                  : "Fill in the details for the new province"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Province Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
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
                  {selectedProvince ? "Save Changes" : "Add Province"}
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
                <span className="font-medium">{selectedProvince?.name}</span>?
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