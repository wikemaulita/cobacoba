// src/components/admin-page/account-requests.jsx
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
import { useAuth } from "@/contexts/AuthContext";

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
    // Asumsi ada id_daerah/daerahId yang bisa diambil dari database untuk diset
    daerahId: 1, // Contoh: asumsikan ID daerah untuk Bali
    password: "passwordbaru123" // Asumsi password sementara/default untuk admin baru
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
    daerahId: 2, // Contoh: asumsikan ID daerah untuk Yogyakarta
    password: "passwordbaru123"
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
    daerahId: 3, // Contoh: asumsikan ID daerah untuk Jawa Barat
    password: "passwordbaru123"
  },
];

export default function AccountRequests() {
  const { toast } = useToast();
  const { token } = useAuth();
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    setLoadingAction(true);
    let success = false;

    if (!token) {
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki token otorisasi untuk melakukan tindakan ini.",
        variant: "destructive",
      });
      setLoadingAction(false);
      setConfirmDialogOpen(false);
      return;
    }

    if (actionType === "approve") {
      try {
        const response = await fetch('http://localhost:3000/users/create-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            username: selectedRequest.name,
            email: selectedRequest.email,
            password: selectedRequest.password,
            alamat: selectedRequest.details.split('for ')[1] || 'Alamat tidak tersedia',
            daerahId: selectedRequest.daerahId
          }),
        });

        const data = await response.json();

        if (response.ok) {
          success = true;
          toast({
            title: "Request Disetujui",
            description: `Akun admin untuk ${selectedRequest.name} berhasil dibuat.`,
          });
          const updatedRequests = requests.filter(
            (req) => req.id !== selectedRequest.id
          );
          setRequests(updatedRequests);
        } else {
          toast({
            title: "Persetujuan Gagal",
            description: data.message || "Terjadi kesalahan saat membuat akun admin.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error approving request:", error);
        toast({
          title: "Terjadi Kesalahan",
          description: "Tidak dapat terhubung ke server untuk menyetujui permintaan.",
          variant: "destructive",
        });
      }
    } else if (actionType === "reject") {
      const updatedRequests = requests.filter(
        (req) => req.id !== selectedRequest.id
      );
      setRequests(updatedRequests);
      success = true;
      toast({
        title: "Permintaan Ditolak",
        description: `Permintaan akun dari ${selectedRequest.name} telah ditolak.`,
      });
    }

    setLoadingAction(false);
    setConfirmDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permintaan Akun</CardTitle>
        <CardDescription>
          Kelola permintaan pembuatan akun dari admin regional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Permintaan
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tertunda</CardTitle>
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
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
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
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Daerah</TableHead>
              <TableHead>Provinsi</TableHead>
              <TableHead>Tanggal Permintaan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
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
                        disabled={loadingAction}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleAction(request, "reject")}
                        disabled={loadingAction}
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
                  Tidak ada permintaan akun yang tertunda
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Dialog Detail */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detail Permintaan</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nama</p>
                    <p className="text-sm">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Daerah</p>
                    <p className="text-sm">{selectedRequest.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Provinsi</p>
                    <p className="text-sm">{selectedRequest.province}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tanggal Permintaan</p>
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
                  <p className="text-sm font-medium">Detail</p>
                  <p className="text-sm">{selectedRequest.details}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Tutup
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setDetailsOpen(false);
                  handleAction(selectedRequest, "approve");
                }}
                disabled={loadingAction}
              >
                Setujui
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDetailsOpen(false);
                  handleAction(selectedRequest, "reject");
                }}
                disabled={loadingAction}
              >
                Tolak
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Konfirmasi */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve"
                  ? "Setujui Permintaan"
                  : "Tolak Permintaan"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "approve"
                  ? "Apakah Anda yakin ingin menyetujui permintaan akun ini? Ini akan membuat akun admin baru."
                  : "Apakah Anda yakin ingin menolak permintaan akun ini? Tindakan ini tidak dapat dibatalkan."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDialogOpen(false)}
                disabled={loadingAction}
              >
                Batal
              </Button>
              <Button
                variant={actionType === "approve" ? "default" : "destructive"}
                className={
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
                onClick={confirmAction}
                disabled={loadingAction}
              >
                {loadingAction ? "Memproses..." : (actionType === "approve" ? "Setujui" : "Tolak")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}