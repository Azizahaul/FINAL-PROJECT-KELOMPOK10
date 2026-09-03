import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([{ sender: 'Nia', text: 'Halo! Ada yang bisa Nia bantu untuk cari lapangan hari ini?' }]);
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'User', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      const result = await response.json();
      
      if (result.success) {
        setMessages((prev) => [...prev, { sender: 'Nia', text: result.data.reply }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'Nia', text: 'Maaf, server sedang bermasalah.' }]);
    }
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
            <div className={`p-4 max-w-[80%] md:max-w-[70%] rounded-2xl whitespace-pre-wrap ${
              msg.sender === 'User' 
                ? 'bg-[#c2fd52] text-black rounded-br-none font-medium' 
                : 'bg-[#1f2b24] text-gray-200 border border-white/10 rounded-bl-none'
            }`}>
              {msg.text.split(/(http[s]?:\/\/[^\s]+)/g).map((part, i) => 
                part.match(/^http[s]?:\/\//) 
                  ? <a key={i} href={part} className="text-blue-400 underline font-semibold" target="_blank" rel="noreferrer">{part}</a> 
                  : part
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Input Area */}
      <footer className="p-6 bg-[#111815] border-t border-white/10">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-4">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Tanyakan ketersediaan lapangan..." 
            className="flex-1 bg-[#1f2b24] border border-white/10 p-4 rounded-xl outline-none focus:border-[#c2fd52] transition text-white" 
          />
          <button type="submit" className="bg-[#c2fd52] text-black px-8 font-bold rounded-xl hover:bg-[#b0ea40] transition">
            Kirim
          </button>
        </form>
      </footer>
    </div>
  );
}