// src/pages/DashboardAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSchedule, setNewSchedule] = useState({
    field_id: '1',
    tanggal: new Date().toISOString().split('T')[0],
    jam_mulai: '08:00',
    jam_selesai: '09:00',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resBooking = await fetch('http://localhost:3000/api/bookings');
      const dataBooking = await resBooking.json();
      if (dataBooking.success && dataBooking.data) {
        setBookings(dataBooking.data);
      }

      const resSchedule = await fetch(`http://localhost:3000/api/schedules/search?tanggal=${newSchedule.tanggal}`);
      const dataSchedule = await resSchedule.json();
      if (dataSchedule.success && dataSchedule.data) {
        setSchedules(dataSchedule.data);
      }
    } catch (err) {
      console.error('Gagal memuat data admin:', err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (result.success) {
        alert(`Status berhasil diubah menjadi: ${newStatus}`);
        fetchData();
      } else {
        alert('Gagal mengubah status: ' + result.message);
      }
    } catch (err) {
      console.error('Error update status:', err);
      alert('Terjadi kesalahan pada server.');
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule)
      });
      const result = await res.json();
      if (result.success) {
        alert('Jadwal berhasil ditambahkan!');
        fetchData();
      } else {
        alert('Gagal menambah jadwal: ' + result.message);
      }
    } catch (err) {
      console.error('Error add schedule:', err);
      alert('Terjadi kesalahan server.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  const totalTransaksi = bookings.length;
  const menungguValidasi = bookings.filter(b => b.status === 'pending' || b.status === 'menunggu konfirmasi').length;
  const jadwalTersedia = schedules.filter(s => s.status === 'tersedia').length;

  return (
    <div className="min-h-screen bg-[#141c18] text-white font-sans flex">
      <aside className="w-64 bg-[#111815] border-r border-white/10 flex flex-col justify-between p-6 hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[#c2fd52] text-black font-bold flex items-center justify-center text-sm shadow">🛡️</div>
            <div>
              <span className="font-bold tracking-wider text-base">ARENA<span className="text-[#c2fd52]">ADMIN</span></span>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Management Panel</p>
            </div>
          </div>

          <nav className="space-y-2 text-xs font-semibold">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${activeTab === 'overview' ? 'bg-[#c2fd52] text-black font-bold shadow' : 'text-gray-300 hover:bg-white/5'}`}
            >
              📊 Overview
            </button>
            <button 
              onClick={() => setActiveTab('schedules')}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${activeTab === 'schedules' ? 'bg-[#c2fd52] text-black font-bold shadow' : 'text-gray-300 hover:bg-white/5'}`}
            >
              📅 Kelola Jadwal
            </button>
            <button 
              onClick={() => setActiveTab('validasi')}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${activeTab === 'validasi' ? 'bg-[#c2fd52] text-black font-bold shadow' : 'text-gray-300 hover:bg-white/5'}`}
            >
              ✅ Validasi Booking {menungguValidasi > 0 && <span className="float-right bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px]">{menungguValidasi}</span>}
            </button>
          </nav>
        </div>

        <div>
          <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2.5 text-xs text-gray-400 hover:text-white transition">
            🌐 Lihat Website Utama
          </button>
          <button 
            onClick={handleLogout} 
            className="w-full mt-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-xl font-bold hover:bg-red-500 hover:text-white transition text-center"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Dashboard Overview</h1>
              <p className="text-sm text-gray-400 mt-1">Selamat datang kembali, Admin. Berikut ringkasan operasional lapangan.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#1f2b24] border border-white/10 p-6 rounded-3xl shadow-xl">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Transaksi</p>
                <p className="text-3xl font-extrabold text-white">{totalTransaksi}</p>
              </div>
              <div className="bg-[#1f2b24] border border-white/10 p-6 rounded-3xl shadow-xl">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Menunggu Validasi</p>
                <p className="text-3xl font-extrabold text-yellow-400">{menungguValidasi}</p>
              </div>
              <div className="bg-[#1f2b24] border border-white/10 p-6 rounded-3xl shadow-xl">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Jadwal Tersedia</p>
                <p className="text-3xl font-extrabold text-[#c2fd52]">{jadwalTersedia}</p>
              </div>
            </div>

            <div className="bg-[#1f2b24] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <h2 className="font-bold text-base">Pemesanan Terbaru</h2>
              {loading ? (
                <p className="text-xs text-gray-400 py-6 text-center">Memuat data pemesanan...</p>
              ) : bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase">
                        <th className="pb-3 px-2">Pemesan</th>
                        <th className="pb-3 px-2">Lapangan</th>
                        <th className="pb-3 px-2">Jadwal Main</th>
                        <th className="pb-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-2 font-bold">{b.nama_pemesan} <br/><span className="text-[10px] text-gray-400">{b.whatsapp}</span></td>
                          <td className="py-3 px-2">{b.nama_lapangan}</td>
                          <td className="py-3 px-2 text-[#c2fd52]">{b.tanggal} <br/>{b.jam_mulai?.slice(0,5)} - {b.jam_selesai?.slice(0,5)}</td>
                          <td className="py-3 px-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-yellow-500/20 text-yellow-400">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-6 text-center">Belum ada pemesanan terbaru.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Kelola Jadwal Lapangan</h1>
              <p className="text-sm text-gray-400 mt-1">Tambah atau atur ketersediaan jam slot lapangan.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-[#1f2b24] border border-white/10 p-6 rounded-3xl shadow-xl h-fit space-y-4">
                <h2 className="font-bold text-sm">Tambah Slot Jam Baru</h2>
                <form onSubmit={handleAddSchedule} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1">Pilih Lapangan</label>
                    <select 
                      value={newSchedule.field_id}
                      onChange={(e) => setNewSchedule({...newSchedule, field_id: e.target.value})}
                      className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none"
                    >
                      <option value="1">Lapangan A - Arena Utama</option>
                      <option value="2">Lapangan B - Semi Indoor</option>
                      <option value="3">Lapangan C - Outdoor Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Tanggal</label>
                    <input 
                      type="date"
                      value={newSchedule.tanggal}
                      onChange={(e) => setNewSchedule({...newSchedule, tanggal: e.target.value})}
                      className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 mb-1">Jam Mulai</label>
                      <input 
                        type="time"
                        value={newSchedule.jam_mulai}
                        onChange={(e) => setNewSchedule({...newSchedule, jam_mulai: e.target.value})}
                        className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">Jam Selesai</label>
                      <input 
                        type="time"
                        value={newSchedule.jam_selesai}
                        onChange={(e) => setNewSchedule({...newSchedule, jam_selesai: e.target.value})}
                        className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#c2fd52] text-black font-bold p-3 rounded-xl hover:bg-[#b0ea40] transition mt-2">
                    Simpan Jadwal Baru
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-[#1f2b24] border border-white/10 p-6 rounded-3xl shadow-xl space-y-4">
                <h2 className="font-bold text-sm">Daftar Slot Terdaftar</h2>
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
                  {schedules.length > 0 ? (
                    schedules.map((s) => (
                      <div key={s.id} className="bg-[#141c18] p-4 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">Lapangan ID: {s.field_id}</p>
                          <p className="text-gray-400">⏰ {s.jam_mulai?.slice(0,5)} - {s.jam_selesai?.slice(0,5)} ({s.tanggal})</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${s.status === 'tersedia' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {s.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-8">Belum ada slot jadwal untuk tanggal ini.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'validasi' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Validasi Pemesanan</h1>
              <p className="text-sm text-gray-400 mt-1">Setujui atau tolak pesanan masuk dari pelanggan.</p>
            </div>

            <div className="bg-[#1f2b24] border border-white/10 p-6 rounded-3xl shadow-2xl space-y-4">
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 uppercase">
                        <th className="pb-3 px-3">Pemesan</th>
                        <th className="pb-3 px-3">Lapangan</th>
                        <th className="pb-3 px-3">Jadwal</th>
                        <th className="pb-3 px-3">Pembayaran</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3 text-center">Aksi Validasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/[0.02]">
                          <td className="py-4 px-3">
                            <p className="font-bold text-white">{b.nama_pemesan}</p>
                            <p className="text-[11px] text-gray-400">📞 {b.whatsapp}</p>
                          </td>
                          <td className="py-4 px-3 font-semibold">{b.nama_lapangan}</td>
                          <td className="py-4 px-3">
                            <span className="text-[#c2fd52] font-bold">{b.tanggal}</span> <br/>
                            {b.jam_mulai?.slice(0,5)} - {b.jam_selesai?.slice(0,5)}
                          </td>
                          <td className="py-4 px-3 uppercase font-medium">{b.metode_pembayaran}</td>
                          <td className="py-4 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              b.status === 'dikonfirmasi' ? 'bg-green-500/20 text-green-400' :
                              b.status === 'dibatalkan' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'dikonfirmasi')}
                                className="bg-green-500/20 hover:bg-green-500 text-green-300 hover:text-black font-bold px-3 py-1.5 rounded-lg transition border border-green-500/30 text-[11px]"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'dibatalkan')}
                                className="bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-black font-bold px-3 py-1.5 rounded-lg transition border border-red-500/30 text-[11px]"
                              >
                                Tolak
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-12">Belum ada data pemesanan yang masuk.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}