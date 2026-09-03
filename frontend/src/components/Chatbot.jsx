import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'Nia', text: 'Halo! Pilih hari di bawah untuk cek jadwal kosong lapangan.' }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const templates = [
    "Hari ini", "Besok", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"
  ];

  const sendMessage = async (dayName) => {
    if (loading) return;
    const text = `Cari jadwal kosong ${dayName}`;

    setMessages(prev => [...prev, { sender: 'User', text }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { sender: 'Nia', text: data.data.reply }]);
      } else {
        setMessages(prev => [...prev, { sender: 'Nia', text: 'Maaf, Nia sedang gangguan.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'Nia', text: 'Gagal terhubung ke server.' }]);
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
          className="bg-[#c2fd52] text-black font-bold px-2 py-1 rounded inline-block my-1 hover:bg-[#b0ea40] transition text-[11px]"
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
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#c2fd52] text-black font-bold p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center gap-2"
        >
          <span>🤖</span>
          <span className="text-xs hidden sm:inline">Tanya Nia AI</span>
        </button>
      ) : (
        <div className="bg-[#1f2b24] border border-white/15 w-80 sm:w-96 h-[520px] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
          {/* Header */}
          <div className="bg-[#141c18] p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black text-xs">🤖</div>
              <div>
                <p className="font-bold text-sm">AI Assistant Nia</p>
                <p className="text-[10px] text-green-400">● Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/chat')} className="text-xs text-gray-400 hover:text-white" title="Fullscreen">⛶</button>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-lg">✕</button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed ${
                  m.sender === 'User' 
                    ? 'bg-[#c2fd52] text-black font-medium rounded-br-none' 
                    : 'bg-[#141c18] text-gray-200 border border-white/10 rounded-bl-none shadow'
                }`}>
                  {m.sender === 'Nia' ? renderFormattedText(m.text) : m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#141c18] text-gray-400 p-3 rounded-2xl border border-white/10">
                  Nia sedang mengecek database...
                </div>
              </div>
            )}
          </div>

          {/* Template Tombol Hari (Footer) */}
          <div className="p-3 bg-[#141c18] border-t border-white/10">
            <p className="text-[10px] text-gray-400 mb-2 font-bold uppercase">Pilih Hari:</p>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((tpl, idx) => (
                <button 
                  key={idx}
                  onClick={() => sendMessage(tpl)}
                  disabled={loading}
                  className="bg-[#1f2b24] text-[#c2fd52] border border-[#c2fd52]/40 text-xs px-3 py-1.5 rounded-lg hover:bg-[#c2fd52] hover:text-black transition font-bold disabled:opacity-50"
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}