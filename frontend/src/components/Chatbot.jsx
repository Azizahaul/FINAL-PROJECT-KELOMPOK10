import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'Nia', text: 'Halo! Ada yang bisa Nia bantu untuk cari lapangan?' }]);
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
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-80 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col h-96">
          <div className="bg-blue-600 text-white p-3 font-bold rounded-t-lg flex justify-between items-center">
            <span>Nia - Smart Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-xl leading-none">&times;</button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 max-w-[80%] rounded-lg whitespace-pre-wrap ${msg.sender === 'User' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  {/* Render text with links if available */}
                  {msg.text.split(/(http[s]?:\/\/[^\s]+)/g).map((part, i) => 
                    part.match(/^http[s]?:\/\//) 
                      ? <a key={i} href={part} className="text-blue-700 underline font-semibold" target="_blank" rel="noreferrer">{part}</a> 
                      : part
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-2 border-t flex gap-2 bg-white rounded-b-lg">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tanya jadwal..." className="flex-1 border p-2 rounded outline-none" />
            <button type="submit" className="bg-blue-600 text-white px-4 rounded font-bold hover:bg-blue-700">Kirim</button>
          </form>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition-transform hover:scale-110">
          💬
        </button>
      )}
    </div>
  );
}