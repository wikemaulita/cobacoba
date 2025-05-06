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

// Mock data for events
const mockEvents = [
  {
    id: 1,
    name: "Bali Arts Festival",
    description:
      "Annual arts and cultural festival showcasing Balinese arts, music, and dance.",
    image: "/placeholder.svg?height=100&width=100",
    location: "Denpasar Art Center",
    date: "2023-06-15",
    region: "Denpasar",
    province: "Bali",
  },
  {
    id: 2,
    name: "Yogyakarta Cultural Night",
    description:
      "A night of traditional Javanese performances and cultural exhibitions.",
    image: "/placeholder.svg?height=100&width=100",
    location: "Malioboro Street",
    date: "2023-07-22",
    region: "Yogyakarta City",
    province: "DI Yogyakarta",
  },
  {
    id: 3,
    name: "Bandung Jazz Festival",
    description:
      "Annual jazz music festival featuring local and international jazz musicians.",
    image: "/placeholder.svg?height=100&width=100",
    location: "Saung Angklung Udjo",
    date: "2023-08-10",
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

export default function EventManagement() {
  const { toast } = useToast();
  const [events, setEvents] = useState(mockEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    location: "",
    date: "",
    region: "",
    province: "",
  });

  const handleAddNew = () => {
    setSelectedEvent(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      location: "",
      date: "",
      region: "",
      province: "",
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
      name: event.name,
      description: event.description,
      image: event.image,
      location: event.location,
      date: event.date,
      region: event.region,
      province: event.province,
    });
    setAvailableRegions(mockRegions[event.province] || []);
    setIsDialogOpen(true);
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
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
      region: "", // Reset region when province changes
    }));
    setAvailableRegions(mockRegions[value] || []);
  };

  const handleRegionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      region: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: format(date, "yyyy-MM-dd"),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedEvent) {
      // Edit existing event
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? { ...event, ...formData } : event
      );
      setEvents(updatedEvents);
      toast({
        title: "Event Updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      // Add new event
      const newEvent = {
        id: events.length + 1,
        ...formData,
      };
      setEvents([...events, newEvent]);
      toast({
        title: "Event Added",
        description: `${formData.name} has been added successfully`,
      });
    }

    setIsDialogOpen(false);
  };

  const confirmDelete = () => {
    const updatedEvents = events.filter(
      (event) => event.id !== selectedEvent.id
    );
    setEvents(updatedEvents);
    toast({
      title: "Event Deleted",
      description: `${selectedEvent.name} has been deleted successfully`,
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Event Management</CardTitle>
          <CardDescription>
            Add, edit, or remove cultural events in the system
          </CardDescription>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                In the next 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Active Province
              </CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Bali</div>
              <p className="text-xs text-muted-foreground">
                8 events this year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Busiest Month
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">July</div>
              <p className="text-xs text-muted-foreground">
                12 scheduled events
              </p>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Province</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
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

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="grid gap-4">
                <div className="flex justify-center">
                  <img
                    src={selectedEvent.image || "/placeholder.svg"}
                    alt={selectedEvent.name}
                    className="h-40 w-40 rounded-md object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm">{selectedEvent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm">{selectedEvent.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Region</p>
                    <p className="text-sm">{selectedEvent.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Province</p>
                    <p className="text-sm">{selectedEvent.province}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm">{selectedEvent.description}</p>
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
                {selectedEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {selectedEvent
                  ? "Update the event details below"
                  : "Fill in the details for the new event"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Event Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? (
                          format(new Date(formData.date), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          formData.date ? new Date(formData.date) : undefined
                        }
                        onSelect={handleDateChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
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
                  {selectedEvent ? "Save Changes" : "Add Event"}
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
                <span className="font-medium">{selectedEvent?.name}</span>? This
                action cannot be undone.
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
