// src/App.jsx

import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import Pulau from "./pages/pulau";
import Register from "./pages/auth/Register";
import DashboardSuperAdmin from "./pages/super-admin/DashboardSuperAdmin";
import DashboardAdminDaerah from "./pages/admin-daerah/DashboardAdminDaerah";
import UserDashboard from "./pages/user/DashboardUser";
import EventsPage from "./pages/user/Event"; // Pastikan path ini benar
import CulturesPage from "./pages/user/Culture";
import ProvincesPage from "./pages/user/Province";
import EventDetailPage from "./pages/user/DetailEvent"; // Pastikan path ini benar
import CultureDetailPage from "./pages/user/DetailCulture";
import ProvinceDetailPage from "./pages/user/DetailProvince";
import DetailPulauPage from "./pages/user/DetailPulau";
import UserLayout from "./layouts/UserLayout";
import HomeDashboard from "./components/admin-page/home-dashboard";
import AccountRequests from "./components/admin-page/account-requests";
import ProvinceManagement from "./components/admin-page/province-management";
import RegionManagement from "./components/admin-page/region-management";
import CultureManagement from "./components/admin-page/culture-management";
import EventManagement from "./components/admin-page/event-management";

import { AuthProvider } from "./Contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const adminDashboardPaths = ["/super-admin/", "/admin-daerah/"];
  const shouldShowNavbar =
    !location.pathname.startsWith("/user/") &&
    !adminDashboardPaths.some((path) => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && (
        <>
          <Navbar />
          <div className="h-[80px] md:h-[96px]" />
        </>
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pulau" element={<Pulau />} />
          <Route path="/pulau/:id" element={<DetailPulauPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rute Event PUBLIK - DI SINI */}
          <Route path="/Event" element={<EventsPage />} />
          <Route path="/Event/:id" element={<EventDetailPage />} />

          {/* Rute Terlindungi untuk Super Admin */}
          <Route
            path="/super-admin"
            element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><DashboardSuperAdmin /></ProtectedRoute>}
          >
            <Route path="dashboard" element={<HomeDashboard />} />
            <Route path="account-requests" element={<AccountRequests />} />
            <Route path="provinces" element={<ProvinceManagement />} />
            <Route path="regions" element={<RegionManagement />} />
            <Route path="cultures" element={<CultureManagement />} />
            <Route path="events" element={<EventManagement />} />
          </Route>

          {/* Rute Terlindungi untuk Admin Daerah */}
          <Route
            path="/admin-daerah"
            element={<ProtectedRoute allowedRoles={['ADMIN_DAERAH']}><DashboardAdminDaerah /></ProtectedRoute>}
          >
            <Route path="dashboard" element={<HomeDashboard />} />
            <Route path="provinces" element={<ProvinceManagement />} />
            <Route path="cultures" element={<CultureManagement />} />
            <Route path="events" element={<EventManagement />} />
          </Route>

          {/* Rute Terlindungi untuk User - TANPA RUTE EVENTS DI SINI */}
          <Route
            path="/user"
            element={<ProtectedRoute allowedRoles={['USER', 'SUPER_ADMIN', 'ADMIN_DAERAH']}><UserLayout /></ProtectedRoute>}
          >
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />
            {/* HAPUS Rute events dari sini */}
            {/* <Route path="events" element={<EventsPage />} /> */}
            {/* <Route path="events/:id" element={<EventDetailPage />} /> */}

            <Route path="cultures" element={<CulturesPage />} />
            <Route path="provinces" element={<ProvincesPage />} />
            <Route path="cultures/:id" element={<CultureDetailPage />} />
            <Route path="provinces/:id" element={<ProvinceDetailPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;