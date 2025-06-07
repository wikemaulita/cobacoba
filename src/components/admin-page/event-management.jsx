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
// Import API functions
import { getEvents, getProvinces, getRegions, createEvent, updateEvent, deleteEvent } from '@/lib/api';


export default function EventManagement() {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [allRegions, setAllRegions] = useState([]); 
  const [availableRegions, setAvailableRegions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    location: "",
    date: "",
    regionId: "", 
    provinceId: "", 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventsProvincesAndRegions = async () => {
    try {
      setLoading(true);
      const [eventsResponse, provincesResponse, regionsResponse] = await Promise.all([
        getEvents(),
        getProvinces(),
        getRegions()
      ]);

      const eventsData = eventsResponse.data.map(event => {
        const province = provincesResponse.data.find(p => p.id === event.provinceId);
        const region = regionsResponse.data.find(r => r.id === event.regionId);
        return {
          ...event,
          provinceName: province?.name || 'Unknown Province',
          regionName: region?.name || 'Unknown Region'
        };
      });

      setEvents(eventsData);
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
    fetchEventsProvincesAndRegions();
  }, []);

  const handleAddNew = () => {
    setSelectedEvent(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      location: "",
      date: "",
      regionId: "",
      provinceId: "",
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
      regionId: event.regionId,
      provinceId: event.provinceId,
    });
    setAvailableRegions(allRegions.filter(region => region.provinceId === event.provinceId));
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

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent.id, formData);
        toast({
          title: "Event Updated",
          description: `${formData.name} has been updated successfully`,
        });
      } else {
        await createEvent(formData);
        toast({
          title: "Event Added",
          description: `${formData.name} has been added successfully`,
        });
      }
      fetchEventsProvincesAndRegions(); 
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save event:", err);
      toast({
        title: "Operation Failed",
        description: err.response?.data?.message || "Failed to save event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteEvent(selectedEvent.id);
      toast({
        title: "Event Deleted",
        description: `${selectedEvent.name} has been deleted successfully`,
      });
      fetchEventsProvincesAndRegions();
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete event:", err);
      toast({
        title: "Deletion Failed",
        description: err.response?.data?.message || "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

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
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">Data from backend</p>
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
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">Data from backend</p>
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
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Province</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
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
                  <TableCell>{event.regionName}</TableCell>
                  <TableCell>{event.provinceName}</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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
                    <p className="text-sm">{selectedEvent.regionName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Province</p>
                    <p className="text-sm">{selectedEvent.provinceName}</p>
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
                  {selectedEvent ? "Save Changes" : "Add Event"}
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