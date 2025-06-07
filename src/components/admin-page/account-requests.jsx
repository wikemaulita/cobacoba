// src/components/admin-page/account-requests.jsx
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

// Import API functions
import { getAdminRequests, createAdminUser, updateAdminRequest, deleteAdminRequest, getProvinces, getRegions } from '@/lib/api';

export default function AccountRequests() {
  const { toast } = useToast();
  const { token } = useAuth(); 
  const [requests, setRequests] = useState([]); 
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      setError(null);
      const response = await getAdminRequests();

      if (response.data && response.data.request && Array.isArray(response.data.request.data)) {
        
        const transformedData = response.data.request.data.map(req => ({
          id: req.id,
          name: req.user.username,
          email: req.user.email,
          region: req.daerah ? req.daerah.nama : req.namaDaerah || 'N/A', 
          province: 'N/A', 
          requestDate: new Date(req.createdAt).toLocaleDateString('id-ID'), 
          status: req.status,
          details: `Permintaan untuk daerah ${req.daerah ? req.daerah.nama : req.namaDaerah || 'baru'}`, 
          
          daerahId: req.daerahId,
          password: req.user.password, 
        }));

        setRequests(transformedData.filter(req => req.status.toUpperCase() === 'PENDING'));

      } else {
        console.warn("Struktur API untuk admin requests tidak sesuai harapan:", response.data);
        setRequests([]);
      }

      setLoadingRequests(false);
    } catch (err) {
      console.error("Failed to fetch account requests:", err);
      setError("Failed to load account requests. Please try again later.");
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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

    try {
      if (actionType === "approve") {
        let daerahId = selectedRequest.daerahId; 

        await createAdminUser({
          username: selectedRequest.name,
          email: selectedRequest.email,
          password: selectedRequest.password || 'default_temp_password', 
          alamat: selectedRequest.details.split('for ')[1] || 'Alamat tidak tersedia', 
          daerahId: daerahId, 
        });

        await updateAdminRequest(selectedRequest.id, { status: "approved" });

        toast({
          title: "Request Disetujui",
          description: `Akun admin untuk ${selectedRequest.name} berhasil dibuat.`,
        });
        fetchRequests(); 
      } else if (actionType === "reject") {
        await updateAdminRequest(selectedRequest.id, { status: "rejected" });
        toast({
          title: "Permintaan Ditolak",
          description: `Permintaan akun dari ${selectedRequest.name} telah ditolak.`,
        });
        fetchRequests(); 
      }
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      toast({
        title: `Gagal ${actionType === 'approve' ? 'Menyetujui' : 'Menolak'}`,
        description: error.response?.data?.message || `Terjadi kesalahan saat ${actionType === 'approve' ? 'membuat akun admin' : 'menolak permintaan'}.`,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(false);
      setConfirmDialogOpen(false);
      setDetailsOpen(false); 
    }
  };

  if (loadingRequests) {
    return <div className="text-center py-10">Loading account requests...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

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