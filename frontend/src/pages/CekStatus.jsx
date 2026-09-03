import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function CekStatus() {
  const [kontak, setKontak] = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

const handleCheck = async (e) => {
    e.preventDefault();
    if (!kontak.trim()) return;
    setLoading(true);
    try {
      // Ubah dari /check menjadi /status
      const res = await fetch(`http://localhost:3000/api/bookings/status?kontak=${kontak}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
        setSearched(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#141c18] text-white font-sans pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <div className="text-center mb-10">
          <span className="bg-[#c2fd52]/10 border border-[#c2fd52]/30 text-[#c2fd52] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            🔍 Lacak Transaksi
          </span>
          <h1 className="text-3xl font-bold mt-4 mb-2">Cek Status Booking Kamu</h1>
          <p className="text-gray-400 text-sm">Masukkan nomor WhatsApp yang kamu gunakan saat melakukan pemesanan.</p>
        </div>

        <form onSubmit={handleCheck} className="bg-[#1f2b24] p-4 rounded-2xl border border-white/10 flex gap-3 shadow-xl mb-10">
          <input 
            type="text" 
            value={kontak}
            onChange={(e) => setKontak(e.target.value)}
            placeholder="Contoh: 081234567890" 
            className="flex-1 bg-[#141c18] px-4 py-3 rounded-xl border border-white/5 text-white outline-none text-sm focus:border-[#c2fd52]"
            required
          />
          <button type="submit" className="bg-[#c2fd52] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#b0ea40] transition">
            {loading ? 'Mencari...' : 'Cek Status'}
          </button>
        </form>

        {searched && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Riwayat Pemesanan ({bookings.length})</h2>
            {bookings.length > 0 ? (
              bookings.map((item) => (
                <div key={item.id} className="bg-[#1a2620] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-xs text-[#c2fd52] font-bold uppercase">ID Pesanan #{item.id}</span>
                    <h3 className="text-lg font-bold mt-1">{item.nama_lapangan}</h3>
                    <p className="text-sm text-gray-300 mt-1">📅 Tanggal: {item.tanggal?.split('T')[0]} | ⏰ {item.jam_mulai} - {item.jam_selesai}</p>
                    <p className="text-xs text-gray-400 mt-1">Metode: {item.metode_pembayaran.toUpperCase()} | Pengirim: {item.nama_rekening || '-'}</p>
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider block text-center ${
                      item.status === 'dikonfirmasi' ? 'bg-green-500/20 text-green-400 border border-green-500/40' :
                      item.status === 'telah bermain' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 bg-[#1f2b24] rounded-2xl border border-white/5">
                Tidak ditemukan riwayat pemesanan dengan nomor WhatsApp tersebut.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}