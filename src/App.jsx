import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import DetailEvent from "./pages/Detailevent";
import EventBudaya from "./pages/eventbudaya";
import Home from "./pages/home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Pulau from "./pages/pulau";
import Register from "./pages/Register";
import DashboardSuperAdmin from "./pages/super-admin/DashboardSuperAdmin";
import DashboardAdminDaerah from "./pages/admin-daerah/DashboardAdminDaerah";
import UserDashboard from "./pages/user/DashboardUser";
import EventsPage from "./pages/user/Event";
import CulturesPage from "./pages/user/Culture";
import ProvincesPage from "./pages/user/Province";
import EventDetailPage from "./pages/user/DetailEvent";
import UserLayout from "./layouts/UserLayout";
import HomeDashboard from "./components/admin-page/home-dashboard";
import AccountRequests from "./components/admin-page/account-requests";
import ProvinceManagement from "./components/admin-page/province-management";
import RegionManagement from "./components/admin-page/region-management";
import CultureManagement from "./components/admin-page/culture-management";
import EventManagement from "./components/admin-page/event-management";

function AppContent() {
  const location = useLocation();
  const adminDashboardPaths = [
    "/super-admin/",
    "/admin-daerah/",
    // Add specific admin management paths if needed later
  ];
  // Hide Navbar if path starts with /user/ or is an admin dashboard path
  const shouldShowNavbar =
    !location.pathname.startsWith("/user/") &&
    !adminDashboardPaths.some((path) => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eventbudaya" element={<EventBudaya />} />
          <Route path="/Detailevent" element={<DetailEvent />} />
          <Route path="/pulau" element={<Pulau />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/super-admin" element={<DashboardSuperAdmin />}>
            <Route path="dashboard" element={<HomeDashboard />} />
            <Route path="account-requests" element={<AccountRequests />} />
            <Route path="provinces" element={<ProvinceManagement />} />
            <Route path="regions" element={<RegionManagement />} />
            <Route path="cultures" element={<CultureManagement />} />
            <Route path="events" element={<EventManagement />} />
          </Route>
          <Route path="/admin-daerah" element={<DashboardAdminDaerah />}>
            <Route path="dashboard" element={<HomeDashboard />} />
            <Route path="provinces" element={<ProvinceManagement />} />
            <Route path="cultures" element={<CultureManagement />} />
            <Route path="events" element={<EventManagement />} />
          </Route>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="cultures" element={<CulturesPage />} />
            <Route path="provinces" element={<ProvincesPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
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
      <AppContent />
    </Router>
  );
}

export default App;
