import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#141c18] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111815] border-r border-white/5 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black text-xs">⚽</div>
          <span className="font-bold tracking-wider">ARENA<span className="text-[#c2fd52]">ADMIN</span></span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full text-left px-4 py-2 bg-[#c2fd52]/10 text-[#c2fd52] rounded-lg font-medium border border-[#c2fd52]/20">Overview</button>
          <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">Kelola Jadwal</button>
          <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">Validasi Booking</button>
        </nav>
        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm text-left px-4 py-2 flex items-center gap-2">
          Logout ⎋
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Selamat datang kembali, Admin.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1f2b24] p-6 rounded-2xl border border-white/5">
            <h3 className="text-gray-400 text-sm mb-1">Total Transaksi</h3>
            <p className="text-3xl font-bold text-[#c2fd52]">24</p>
          </div>
          <div className="bg-[#1f2b24] p-6 rounded-2xl border border-white/5">
            <h3 className="text-gray-400 text-sm mb-1">Menunggu Validasi</h3>
            <p className="text-3xl font-bold text-yellow-400">5</p>
          </div>
          <div className="bg-[#1f2b24] p-6 rounded-2xl border border-white/5">
            <h3 className="text-gray-400 text-sm mb-1">Jadwal Tersedia</h3>
            <p className="text-3xl font-bold text-white">12</p>
          </div>
        </div>

        {/* Tabel Placeholder */}
        <div className="bg-[#1f2b24] rounded-2xl border border-white/5 p-6">
          <h3 className="font-bold text-lg mb-4">Pemesanan Terbaru</h3>
          <div className="text-gray-400 text-sm text-center py-10 border border-dashed border-white/10 rounded-xl">
            Tabel daftar pemesanan akan dimuat di sini (Integrasi API berikutnya).
          </div>
        </div>
      </main>
    </div>
  );
}