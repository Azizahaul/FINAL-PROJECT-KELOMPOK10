import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Chatbot from '../components/Chatbot';

export default function Home() {
  const navigate = useNavigate();
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    { id: 1, name: 'Lapangan A - Arena Utama', type: 'Futsal / Mini Soccer', price: 'Rp 150.000 / jam', foto: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', fasilitas: 'Rumput Sintetis Premium, Lampu LED Sorot' },
    { id: 2, name: 'Lapangan B - Semi Indoor', type: 'Futsal', price: 'Rp 125.000 / jam', foto: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80', fasilitas: 'Atap Pelindung Hujan, Interlock Flooring' },
    { id: 3, name: 'Lapangan C - Outdoor Pro', type: 'Mini Soccer', price: 'Rp 135.000 / jam', foto: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', fasilitas: 'Rumput Standar FIFA, Area Penonton Luas' },
  ];

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: aiQuery })
      });
      const data = await res.json();
      if (data.success) {
        setAiResponse(data.data.reply);
      }
    } catch (err) {
      setAiResponse('Gagal terhubung ke AI Nia.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#141c18] text-white font-sans selection:bg-[#c2fd52] selection:text-black pb-20">
      {/* NAVBAR UTAMA YANG KITA BUAT */}
      <Navbar />

      {/* HERO SECTION + AI SEARCH NIA */}
      <header className="px-6 py-16 max-w-4xl mx-auto text-center">
        <span className="bg-[#c2fd52]/10 border border-[#c2fd52]/30 text-[#c2fd52] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          🤖 Smart Assistant Nia (AI Powered)
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 mb-4">
          Tanya Jadwal Lapangan <span className="text-[#c2fd52]">Ke AI Nia</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base mb-8">
          Ketik kebutuhan jadwalmu di bawah (contoh: "Cari jadwal kosong besok jam 7 malam") dan Nia akan langsung mencarikan slotnya untukmu.
        </p>

        {/* Form Tanya AI */}
        <form onSubmit={handleAskAI} className="bg-[#1f2b24] p-3 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 shadow-2xl">
          <input 
            type="text" 
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Tanya AI Nia (misal: Ada jadwal kosong besok?)..." 
            className="flex-1 bg-[#141c18] px-4 py-3 rounded-xl border border-white/5 text-white outline-none text-sm"
          />
          <button 
            type="submit" 
            className="bg-[#c2fd52] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#b0ea40] transition"
          >
            {loading ? 'Mencari...' : 'Tanya Nia ⚡'}
          </button>
        </form>

        {/* Hasil Respon AI */}
        {aiResponse && (
          <div className="mt-6 bg-[#1a2620] border border-[#c2fd52]/40 p-6 rounded-2xl text-left text-sm whitespace-pre-line shadow-xl">
            <p className="font-bold text-[#c2fd52] mb-2">💬 Jawaban AI Nia:</p>
            <div className="text-gray-200 leading-relaxed">
              {aiResponse.split('\n').map((line, idx) => {
                if (line.includes('http')) {
                  const urlMatch = line.match(/(https?:\/\/[^\s)]+)/);
                  const bookingUrl = urlMatch ? urlMatch[0] : '/venue';
                  return (
                    <div key={idx} className="my-2">
                      <a href={bookingUrl} className="bg-[#c2fd52] text-black font-bold px-4 py-2 rounded-lg inline-block text-xs hover:bg-[#b0ea40]">
                        🔗 Klik Langsung ke Form Pemesanan Slot Ini
                      </a>
                    </div>
                  );
                }
                return <p key={idx}>{line}</p>;
              })}
            </div>
          </div>
        )}
      </header>

      {/* KATALOG 3 LAPANGAN */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-white/10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[#c2fd52] text-xs font-bold tracking-widest uppercase">● PILIH COURT</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">Daftar Lapangan Arena Nias</h2>
          </div>
          <button onClick={() => navigate('/venue')} className="text-xs text-gray-400 hover:text-[#c2fd52] transition">
            Lihat Detail Venue →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fields.map((field) => (
            <div key={field.id} className="bg-[#1a2620] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#c2fd52]/50 transition flex flex-col shadow-lg">
              <div className="h-48 overflow-hidden relative">
                <img src={field.foto} alt={field.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#c2fd52]">
                  {field.price}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl mb-1 text-white">{field.name}</h3>
                <p className="text-xs text-[#c2fd52] font-semibold mb-3">{field.type}</p>
                <div className="bg-[#141c18] p-3 rounded-xl border border-white/5 mb-6 text-xs text-gray-300">
                  <span className="font-bold block text-white mb-1">Fasilitas:</span>
                  {field.fasilitas}
                </div>
                <button 
                  onClick={() => navigate('/venue')}
                  className="mt-auto w-full bg-[#c2fd52] hover:bg-[#b0ea40] text-black text-sm font-bold py-3 rounded-xl transition shadow-md"
                >
                  Pilih & Booking Lapangan →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Chatbot />
    </div>
  );
}