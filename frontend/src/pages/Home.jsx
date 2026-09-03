import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

export default function Home() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  // Fetch data jadwal/lapangan yang tersedia dari backend
  useEffect(() => {
    fetch('http://localhost:3000/api/schedules')
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setSchedules(result.data);
        }
      })
      .catch((err) => console.error('Gagal memuat data lapangan:', err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Jika user cari berdasarkan tanggal, arahkan atau filter
    if (searchDate) {
      navigate(`/booking?date=${searchDate}`);
    } else {
      navigate('/booking');
    }
  };

  return (
    <div className="min-h-screen bg-[#141c18] text-white font-sans selection:bg-[#c2fd52] selection:text-black">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black text-sm">
            ⚽
          </div>
          <span className="font-bold tracking-wider text-lg">ARENA<span className="text-[#c2fd52]">NIAS</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#lapangan" className="hover:text-[#c2fd52] transition">Cari Lapangan</a>
          <a href="#fitur" className="hover:text-[#c2fd52] transition">Fitur AI Nia</a>
          <a href="#kontak" className="hover:text-[#c2fd52] transition">Kontak</a>
        </div>
        <button 
          onClick={() => navigate('/booking')} 
          className="bg-transparent border border-white/20 px-5 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black transition"
        >
          Masuk / Booking
        </button>
      </nav>

      {/* HERO SECTION */}
      <header className="relative px-6 py-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f3325] via-[#141c18] to-[#141c18] opacity-80 rounded-3xl"></div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight mb-6">
          Temukan & Pesan Lapangan <span className="text-[#c2fd52]">Tanpa Ribet.</span>
        </h1>
        <p className="text-gray-400 max-w-xl mb-10 text-sm md:text-base">
          Cari jadwal kosong dalam hitungan detik menggunakan Smart Assistant <span className="text-white font-semibold">"Nia"</span> atau pilih langsung slot favoritmu.
        </p>

        {/* SEARCH BAR BOX */}
        <form onSubmit={handleSearch} className="bg-[#1f2b24] p-3 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-3 w-full max-w-2xl shadow-2xl">
          <div className="flex-1 flex items-center bg-[#141c18] px-4 py-3 rounded-xl border border-white/5">
            <span className="text-gray-400 mr-2">📅</span>
            <input 
              type="date" 
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="bg-transparent w-full text-white outline-none text-sm cursor-pointer"
            />
          </div>
          <button 
            type="submit" 
            className="bg-[#c2fd52] text-black font-bold px-8 py-3 rounded-xl hover:bg-[#b0ea40] transition flex items-center justify-center gap-2"
          >
            <span>Cari Jadwal</span>
            <span>→</span>
          </button>
        </form>

        {/* QUICK TAGS */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 text-xs text-gray-400">
          <span className="text-gray-500">Paling dicari:</span>
          <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">Futsal Indoor</span>
          <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">Mini Soccer Malam</span>
          <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">Weekend Slot</span>
        </div>
      </header>

      {/* STATS SECTION */}
      <section className="border-y border-white/10 bg-[#19241e]/50 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-[#c2fd52]">10+</p>
            <p className="text-xs text-gray-400 mt-1">Lapangan Mitra</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white">100%</p>
            <p className="text-xs text-gray-400 mt-1">Real-time Schedule</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-[#c2fd52]">24/7</p>
            <p className="text-xs text-gray-400 mt-1">AI Assistant Nia</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white">Fast</p>
            <p className="text-xs text-gray-400 mt-1">Direct Booking Link</p>
          </div>
        </div>
      </section>

      {/* POPULAR FIELDS SECTION */}
      <section id="lapangan" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#c2fd52] text-xs font-bold tracking-widest uppercase">● POPULER</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">Lapangan Paling Diminati</h2>
          </div>
          <button onClick={() => navigate('/booking')} className="text-xs text-gray-400 hover:text-[#c2fd52] transition">
            Lihat semua →
          </button>
        </div>

        {/* GRID CARD LAPANGAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedules.length > 0 ? (
            schedules.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-[#1a2620] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#c2fd52]/50 transition">
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center text-4xl">
                  🏟️
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#c2fd52]">
                    {item.status}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{item.nama_lapangan}</h3>
                  <p className="text-xs text-gray-400 mb-4">Tanggal: {item.tanggal?.split('T')[0]} | {item.jam_mulai} - {item.jam_selesai}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#c2fd52] font-bold">Tersedia</span>
                    <button 
                      onClick={() => navigate(`/booking?schedule_id=${item.id}`)}
                      className="bg-white/10 hover:bg-[#c2fd52] hover:text-black text-xs font-semibold px-4 py-2 rounded-xl transition"
                    >
                      Booking Slot
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500 bg-[#19241e]/30 rounded-2xl border border-white/5">
              Belum ada data jadwal lapangan aktif. Silakan tambahkan via backend atau dashboard admin.
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#111815] py-12 text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black text-xs">⚽</div>
              <span className="font-bold text-white text-base">ARENA NIAS</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Sistem pemesanan lapangan berbasis AI Chatbot (Nia) untuk kemudahan reservasi olahraga Anda.
            </p>
          </div>
          <div>
            <p className="font-bold text-white mb-3">Menu Utama</p>
            <ul className="space-y-2">
              <li><a href="#lapangan" className="hover:text-white transition">Cari Lapangan</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Smart Assistant Nia</a></li>
              <li><a href="/booking" className="hover:text-white transition">Halaman Booking</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white mb-3">Kontak</p>
            <p className="text-gray-500 mb-1">Email: support@arenanias.com</p>
            <p className="text-gray-500">WhatsApp: +62 811-9991-5000</p>
          </div>
          <div>
            <p className="font-bold text-white mb-3">Kampus / Tim</p>
            <p className="text-gray-500">Final Project PAW — Kelompok 10</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Arena Nias. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-gray-600">Built with React, Vite & Tailwind CSS</p>
        </div>
      </footer>

      {/* Chatbot Widget Nia di Pojok Kanan Bawah */}
      <Chatbot />
    </div>
  );
}