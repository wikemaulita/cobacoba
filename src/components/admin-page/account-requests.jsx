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
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Eye,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for account requests
const mockRequests = [
  {
    id: 1,
    name: "Admin Bali",
    email: "admin.bali@example.com",
    region: "Bali",
    province: "Bali",
    status: "pending",
    requestDate: "2023-05-15",
    details: "Request to manage cultural content for Bali region",
  },
  {
    id: 2,
    name: "Admin Yogyakarta",
    email: "admin.yogya@example.com",
    region: "Yogyakarta",
    province: "DI Yogyakarta",
    status: "pending",
    requestDate: "2023-05-16",
    details: "Request to manage cultural content for Yogyakarta region",
  },
  {
    id: 3,
    name: "Admin Bandung",
    email: "admin.bandung@example.com",
    region: "Bandung",
    province: "Jawa Barat",
    status: "pending",
    requestDate: "2023-05-17",
    details: "Request to manage cultural content for Bandung region",
  },
];

export default function AccountRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const confirmAction = () => {
    const updatedRequests = requests.filter(
      (req) => req.id !== selectedRequest.id
    );
    setRequests(updatedRequests);

    toast({
      title: actionType === "approve" ? "Request Approved" : "Request Rejected",
      description: `You have ${
        actionType === "approve" ? "approved" : "rejected"
      } the account request from ${selectedRequest.name}`,
    });

    setConfirmDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Requests</CardTitle>
        <CardDescription>
          Manage account creation requests from regional admins
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((req) => req.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.region}</TableCell>
                  <TableCell>{request.province}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-green-600"
                        onClick={() => handleAction(request, "approve")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleAction(request, "reject")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No pending account requests
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Region</p>
                    <p className="text-sm">{selectedRequest.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Province</p>
                    <p className="text-sm">{selectedRequest.province}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Request Date</p>
                    <p className="text-sm">{selectedRequest.requestDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant="outline" className="capitalize">
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Details</p>
                  <p className="text-sm">{selectedRequest.details}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setDetailsOpen(false);
                  handleAction(selectedRequest, "approve");
                }}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDetailsOpen(false);
                  handleAction(selectedRequest, "reject");
                }}
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve"
                  ? "Approve Request"
                  : "Reject Request"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "approve"
                  ? "Are you sure you want to approve this account request? This will create a new admin account."
                  : "Are you sure you want to reject this account request? This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === "approve" ? "default" : "destructive"}
                className={
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
                onClick={confirmAction}
              >
                {actionType === "approve" ? "Approve" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
