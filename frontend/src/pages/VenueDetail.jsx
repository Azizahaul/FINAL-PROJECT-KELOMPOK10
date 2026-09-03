import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

export default function VenueDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryTanggal = searchParams.get('tanggal');
  const queryCourt = searchParams.get('court'); // Pre-fill lapangan dari chatbot (FR-3.3)
  
  const [selectedDate, setSelectedDate] = useState(queryTanggal || new Date().toISOString().split('T')[0]);
  const [activeCourt, setActiveCourt] = useState(queryCourt ? Number(queryCourt) : 1);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sinkronisasi jika parameter URL berubah
  useEffect(() => {
    if (queryTanggal) {
      setSelectedDate(queryTanggal);
    }
    if (queryCourt) {
      setActiveCourt(Number(queryCourt));
    }
  }, [queryTanggal, queryCourt]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotData, setSelectedSlotData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    catatan: '',
    bukti_file: null,
  });

  const courts = [
    { id: 1, name: 'Lapangan A - Arena Utama', type: 'Futsal / Mini Soccer', price: 'Rp 150.000 / sesi', desc: 'Rumput Sintetis Premium, Lampu LED Sorot' },
    { id: 2, name: 'Lapangan B - Semi Indoor', type: 'Futsal', price: 'Rp 125.000 / sesi', desc: 'Atap Pelindung Hujan, Interlock Flooring' },
    { id: 3, name: 'Lapangan C - Outdoor Pro', type: 'Mini Soccer', price: 'Rp 135.000 / sesi', desc: 'Rumput Standar FIFA, Area Penonton Luas' },
  ];

  const dateList = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return {
      dateStr,
      dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString('id-ID', { month: 'short' })
    };
  });

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/schedules/search?tanggal=${selectedDate}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          const filtered = result.data.filter(s => s.field_id === activeCourt);
          const uniqueSchedules = filtered.filter((v, i, a) => 
            a.findIndex(t => t.jam_mulai === v.jam_mulai && t.jam_selesai === v.jam_selesai) === i
          );
          setSchedules(uniqueSchedules);
        } else {
          setSchedules([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedDate, activeCourt]);

  const handleOpenBookingModal = (slot) => {
    setSelectedSlotData(slot);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlotData) return;

    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule_id: selectedSlotData.id,
          nama_pemesan: formData.nama,
          whatsapp: formData.whatsapp,
          catatan: formData.catatan,
          metode_pembayaran: paymentMethod,
          bukti_transfer: formData.bukti_file ? formData.bukti_file.name : (paymentMethod === 'cod' ? 'cod' : 'default.jpg')
        })
      });
      const result = await response.json();
      if (result.success) {
        alert('Pemesanan lapangan berhasil dikirim!');
        setIsModalOpen(false);
        navigate('/status');
      } else {
        alert('Gagal memesan: ' + result.message);
      }
    } catch (err) {
      console.error('Error booking:', err);
      alert('Terjadi kesalahan pada server.');
    }
  };

  const getDurationText = (mulai, selesai) => {
    if (!mulai || !selesai) return '60 Menit';
    const [h1, m1] = mulai.split(':').map(Number);
    const [h2, m2] = selesai.split(':').map(Number);
    const diffMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    return `${diffMinutes} Menit`;
  };

  return (
    <div className="min-h-screen bg-[#141c18] text-white font-sans selection:bg-[#c2fd52] selection:text-black pb-24 relative">
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black text-sm">⚽</div>
          <span className="font-bold tracking-wider text-lg">ARENA<span className="text-[#c2fd52]">NIAS</span></span>
        </div>
        <button onClick={() => navigate('/')} className="text-sm text-gray-300 hover:text-[#c2fd52]">← Kembali ke Beranda</button>
      </nav>

      <header className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 md:h-96 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80" 
              alt="Arena Nias Venue" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div>
                <span className="bg-[#c2fd52] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Verified Venue</span>
                <h1 className="text-3xl md:text-4xl font-extrabold mt-2 text-white">Arena Nias Sports Center</h1>
                <p className="text-gray-300 text-sm mt-1">📍 Tomohon Tengah, Kota Tomohon, Sulawesi Utara</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1f2b24] p-6 rounded-2xl border border-white/10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Rating Venue</span>
                <span className="bg-[#c2fd52]/20 text-[#c2fd52] font-bold px-3 py-1 rounded-lg text-sm">⭐ 4.8 / 5.0</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Pusat olahraga terlengkap dengan standar rumput sintetis premium, sistem pencahayaan malam hari, serta fasilitas penunjang yang nyaman.
              </p>
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-gray-300">
                <p>🕒 Jam Operasional: <span className="text-white font-semibold">06:00 - 22:20 WITA</span></p>
                <p>💳 Pembayaran: <span className="text-white font-semibold">Cashless (Transfer / QRIS)</span></p>
              </div>
            </div>
            <div className="bg-[#141c18] p-3 rounded-xl border border-white/5 text-center mt-4">
              <span className="text-xs text-gray-400 block">Mulai dari</span>
              <span className="text-lg font-bold text-[#c2fd52]">Rp 125.000 / sesi</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="bg-[#1f2b24] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold">Pilih Jadwal & Lapangan</h2>
              <p className="text-gray-400 text-sm mt-1">Pilih tanggal, pilih court (A/B/C), lalu klik slot jam yang tersedia.</p>
            </div>
            <div className="bg-[#141c18] px-4 py-2 rounded-xl border border-white/5 text-xs text-[#c2fd52] font-medium">
              ⚡ Real-time Slot Availability
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">1. Pilih Tanggal Sewa</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {dateList.map((d) => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`flex flex-col items-center justify-center min-w-[76px] py-3 px-4 rounded-2xl border transition-all ${
                      isSelected 
                        ? 'bg-[#c2fd52] text-black font-bold border-[#c2fd52] shadow-[0_0_15px_rgba(194,253,82,0.4)]' 
                        : 'bg-[#141c18] text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-[10px] uppercase opacity-80">{d.dayName}</span>
                    <span className="text-xl font-extrabold my-0.5">{d.dayNum}</span>
                    <span className="text-[10px] uppercase opacity-80">{d.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">2. Pilih Lapangan / Court</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courts.map((c) => {
                const isSelected = activeCourt === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveCourt(c.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      isSelected 
                        ? 'bg-[#141c18] border-[#c2fd52] shadow-[0_0_15px_rgba(194,253,82,0.2)]' 
                        : 'bg-[#141c18]/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-base">{c.name}</span>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#c2fd52]"></span>}
                    </div>
                    <p className="text-xs text-[#c2fd52] font-semibold mb-2">{c.type} • {c.price}</p>
                    <p className="text-[11px] text-gray-400">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              3. Pilih Jam Bermain ({selectedDate})
            </label>

            {loading ? (
              <div className="text-center py-12 text-gray-400 bg-[#141c18] rounded-2xl border border-white/5">
                Memuat ketersediaan jadwal...
              </div>
            ) : schedules.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {schedules.map((slot) => {
                  const isAvailable = slot.status === 'tersedia';
                  return (
                    <div 
                      key={slot.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                        isAvailable 
                          ? 'bg-[#141c18] border-white/10 hover:border-[#c2fd52]' 
                          : 'bg-red-950/10 border-red-500/30'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-mono text-gray-300">
                            {getDurationText(slot.jam_mulai, slot.jam_selesai)}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isAvailable ? 'Tersedia' : 'Terisi'}
                          </span>
                        </div>
                        <p className="text-base font-bold text-white mb-1">
                          {slot.jam_mulai?.slice(0, 5)} - {slot.jam_selesai?.slice(0, 5)}
                        </p>
                      </div>

                      {isAvailable ? (
                        <button 
                          onClick={() => handleOpenBookingModal(slot)}
                          className="mt-4 w-full bg-[#c2fd52] hover:bg-[#b0ea40] text-black font-bold py-2 rounded-lg text-xs transition shadow-md"
                        >
                          Booking Slot
                        </button>
                      ) : (
                        <button disabled className="mt-4 w-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold py-2 rounded-lg text-xs cursor-not-allowed">
                          Sudah Terpesan
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 bg-[#141c18] rounded-2xl border border-white/5">
                Tidak ada slot jadwal untuk tanggal dan lapangan ini. Silakan pilih tanggal atau lapangan lain.
              </div>
            )}
          </div>

        </div>
      </main>

      {/* MODAL POP-UP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1f2b24] border border-white/20 w-full max-w-lg rounded-3xl p-6 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-[#141c18] flex items-center justify-center border border-white/10"
            >
              ✕
            </button>

            <h2 className="text-xl font-extrabold mb-1">Konfirmasi Pemesanan Lapangan</h2>
            <p className="text-xs text-gray-400 mb-6">
              Lapangan: <span className="text-[#c2fd52] font-bold">{courts.find(c => c.id === activeCourt)?.name}</span> | Tanggal: <span className="text-white font-bold">{selectedDate}</span> ({selectedSlotData?.jam_mulai?.slice(0,5)} - {selectedSlotData?.jam_selesai?.slice(0,5)})
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1.5 font-medium">Nama Pemesan / Tim</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Zidane Al Hakim (FC Garuda)" 
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#c2fd52] transition"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5 font-medium">Nomor WhatsApp / HP (Hanya Angka)</label>
                <input 
                  type="text" 
                  required
                  placeholder="📞 Contoh: 081234567890" 
                  value={formData.whatsapp}
                  onChange={(e) => {
                    const angkaSaja = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, whatsapp: angkaSaja});
                  }}
                  className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#c2fd52] transition"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5 font-medium">Catatan Opsional</label>
                <input 
                  type="text" 
                  placeholder="📝 Contoh: Butuh rompi latihan" 
                  value={formData.catatan}
                  onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                  className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#c2fd52] transition"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5 font-medium">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3 rounded-xl border text-center font-bold transition flex items-center justify-center gap-2 ${
                      paymentMethod === 'transfer' 
                        ? 'bg-[#141c18] border-[#c2fd52] text-[#c2fd52]' 
                        : 'bg-[#141c18]/50 border-white/10 text-gray-400'
                    }`}
                  >
                    🏦 Transfer Bank
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-center font-bold transition flex items-center justify-center gap-2 ${
                      paymentMethod === 'cod' 
                        ? 'bg-[#141c18] border-[#c2fd52] text-[#c2fd52]' 
                        : 'bg-[#141c18]/50 border-white/10 text-gray-400'
                    }`}
                  >
                    💵 COD / On-Spot
                  </button>
                </div>
              </div>

              {paymentMethod === 'transfer' ? (
                <div className="bg-[#141c18] border border-white/10 rounded-2xl p-4 space-y-3">
                  <p className="font-bold text-gray-300">Rekening Tujuan Transfer:</p>
                  <p className="text-gray-400">• Bank Mandiri: 1370-0011-22334 (A/N Nia Futsal Hub)</p>
                  <p className="text-gray-400">• Bank BCA: 8830-9911-22 (A/N Nia Futsal Hub)</p>
                  
                  <div className="pt-2">
                    <label className="block text-gray-400 mb-1.5 font-medium">Unggah Bukti Transfer</label>
                    <label className="border border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:border-[#c2fd52] transition block">
                      <span className="text-gray-400 block text-xs">
                        {formData.bukti_file ? `📁 ${formData.bukti_file.name}` : '📁 Klik untuk Pilih Foto Bukti Transfer'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData({...formData, bukti_file: e.target.files[0]});
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="bg-[#141c18] border border-[#c2fd52]/30 rounded-2xl p-4 space-y-2">
                  <p className="font-bold text-[#c2fd52]">Informasi Pembayaran COD / On-Spot:</p>
                  <p className="text-gray-400 leading-relaxed">
                    Pembayaran COD bersifat <span className="text-white font-bold">Auto-Validated</span> (Sesuai PRD). Pemesanan kamu akan langsung disetujui dan slot lapangan otomatis terkunci! Silakan bayar di lokasi.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 bg-white/10 text-white font-bold p-3.5 rounded-xl hover:bg-white/20 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="w-2/3 bg-[#c2fd52] text-black font-bold p-3.5 rounded-xl hover:bg-[#b0ea40] transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Kirim Pemesanan</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}