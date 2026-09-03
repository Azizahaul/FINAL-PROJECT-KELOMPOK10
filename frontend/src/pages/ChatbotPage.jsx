import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: 'Nia', text: 'Halo! Selamat datang di Arena Nias. Silakan pilih hari pada tombol template di bawah untuk melihat ketersediaan jadwal lapangan.' }
  ]);
  const [loading, setLoading] = useState(false);

  const templates = [
    "Cari jadwal kosong hari ini",
    "Cari jadwal kosong besok",
    "Cari jadwal kosong hari Senin",
    "Cari jadwal kosong hari Selasa",
    "Cari jadwal kosong hari Rabu",
    "Cari jadwal kosong hari Kamis",
    "Cari jadwal kosong hari Jumat",
    "Cari jadwal kosong hari Sabtu",
    "Cari jadwal kosong hari Minggu"
  ];

  const sendMessage = async (text) => {
    if (loading) return;

    setMessages((prev) => [...prev, { sender: 'User', text }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const result = await response.json();
      
      if (result.success && result.data) {
        setMessages((prev) => [...prev, { sender: 'Nia', text: result.data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'Nia', text: 'Maaf, Nia gagal memproses balasan.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'Nia', text: 'Gagal terhubung ke server backend.' }]);
    }
    setLoading(false);
  };

  const renderFormattedText = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }
      elements.push(
        <a 
          key={match.index} 
          href={match[2]} 
          className="bg-[#c2fd52] text-black font-bold px-3 py-1.5 rounded-lg inline-block my-2 hover:bg-[#b0ea40] transition text-xs shadow"
        >
          🔗 {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }

    return elements.length > 0 ? elements : text;
  };

  return (
    <div className="min-h-screen bg-[#141c18] flex flex-col font-sans text-white">
      {/* Header */}
      <header className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111815]">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition">
          ← Kembali ke Beranda
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black text-xs">🤖</div>
          <span className="font-bold tracking-wider">AI <span className="text-[#c2fd52]">NIA</span></span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 overflow-y-auto flex flex-col space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 max-w-[85%] md:max-w-[70%] rounded-2xl whitespace-pre-wrap leading-relaxed ${
              msg.sender === 'User' 
                ? 'bg-[#c2fd52] text-black rounded-br-none font-medium' 
                : 'bg-[#1f2b24] text-gray-200 border border-white/10 rounded-bl-none shadow-lg'
            }`}>
              {msg.sender === 'Nia' ? renderFormattedText(msg.text) : msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1f2b24] text-gray-400 p-4 rounded-2xl border border-white/10 animate-pulse">
              Gemini AI sedang memproses jadwal...
            </div>
          </div>
        )}
      </main>

      {/* Template Pilihan Hari */}
      <footer className="p-6 bg-[#111815] border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">📅 Pilih Hari untuk Cek Jadwal:</p>
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl, idx) => (
              <button 
                key={idx} 
                onClick={() => sendMessage(tpl)}
                disabled={loading}
                className="bg-[#1f2b24] border border-[#c2fd52]/40 hover:bg-[#c2fd52] hover:text-black text-[#c2fd52] text-xs px-4 py-2.5 rounded-xl transition font-bold shadow-md disabled:opacity-50"
              >
                {tpl.replace('Cari jadwal kosong ', '')}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}