import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Booking from '../pages/Booking';
import LoginAdmin from '../pages/LoginAdmin';
import DashboardAdmin from '../pages/DashboardAdmin';

// Tambahan 3 halaman baru
import ChatbotPage from '../pages/ChatbotPage';
import JadwalLapangan from '../pages/JadwalLapangan';
import KategoriOlahraga from '../pages/KategoriOlahraga';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      
      {/* Route Publik */}
      <Route path="/chat" element={<ChatbotPage />} />
      <Route path="/jadwal" element={<JadwalLapangan />} />
      <Route path="/kategori" element={<KategoriOlahraga />} />

      {/* Route Admin */}
      <Route path="/login" element={<LoginAdmin />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
    </Routes>
  );
}

export default AppRoutes;