import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Booking from '../pages/Booking';
import LoginAdmin from '../pages/LoginAdmin';
import DashboardAdmin from '../pages/DashboardAdmin';

/**
 * Semua route halaman didaftarin di sini. App.jsx cuma manggil
 * <AppRoutes /> ini, gak perlu tau detail path apa aja yang ada -
 * kalo nambah halaman baru, cukup import + tambah <Route> di sini.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<Booking />} />
      
      {/* Route untuk Admin */}
      <Route path="/login" element={<LoginAdmin />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      
      {/* Route Chatbot, Jadwal, dan Kategori akan kita tambahkan di sini nanti */}
    </Routes>
  );
}

export default AppRoutes;