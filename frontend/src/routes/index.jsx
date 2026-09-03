import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import LoginAdmin from '../pages/LoginAdmin';
import DashboardAdmin from '../pages/DashboardAdmin';

// Halaman Fitur Aktif
import ChatbotPage from '../pages/ChatbotPage';
import JadwalLapangan from '../pages/JadwalLapangan';
import VenueDetail from '../pages/VenueDetail';
import CekStatus from '../pages/CekStatus';

function AppRoutes() {
  return (
    <Routes>
      {/* Route Utama & Publik */}
      <Route path="/" element={<Home />} />
      <Route path="/venue" element={<VenueDetail />} />
      <Route path="/status" element={<CekStatus />} />
      <Route path="/chat" element={<ChatbotPage />} />
      <Route path="/jadwal" element={<JadwalLapangan />} />

      {/* Route Admin */}
      <Route path="/login" element={<LoginAdmin />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
    </Routes>
  );
}

export default AppRoutes;