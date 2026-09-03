import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JadwalLapangan() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/schedules')
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setSchedules(result.data);
      })
      .catch((err) => console.error('Error fetching schedules:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#141c18] text-white font-sans selection:bg-[#c2fd52] selection:text-black pb-20">
      <header className="p-8 max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">← Kembali</button>
        <h1 className="text-2xl font-bold">Jadwal <span className="text-[#c2fd52]">Tersedia</span></h1>
      </header>

      <main className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {schedules.filter(s => s.status === 'tersedia').map((item) => (
            <div key={item.id} className="bg-[#1a2620] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#c2fd52]/50 transition flex flex-col">
              <div className="h-40 bg-[#111815] flex items-center justify-center text-5xl">⚽</div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl mb-2">{item.nama_lapangan}</h3>
                <p className="text-sm text-gray-400 mb-1">Tanggal: {item.tanggal?.split('T')[0]}</p>
                <p className="text-sm text-gray-400 mb-6">Jam: {item.jam_mulai} - {item.jam_selesai}</p>
                
                <button 
                  onClick={() => navigate(`/booking?schedule_id=${item.id}`)}
                  className="mt-auto w-full bg-white/10 hover:bg-[#c2fd52] hover:text-black text-sm font-bold py-3 rounded-xl transition"
                >
                  Booking Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {schedules.filter(s => s.status === 'tersedia').length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-[#1f2b24] rounded-2xl border border-white/5">
            Belum ada jadwal lapangan yang tersedia saat ini.
          </div>
        )}
      </main>
    </div>
  );
}