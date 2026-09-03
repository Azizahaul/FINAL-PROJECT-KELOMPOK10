import { useNavigate } from 'react-router-dom';

export default function KategoriOlahraga() {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: 'Futsal Indoor', icon: '⚽', count: '5 Lapangan' },
    { id: 2, name: 'Mini Soccer', icon: '🏟️', count: '3 Lapangan' },
    { id: 3, name: 'Basket', icon: '🏀', count: '2 Lapangan' },
    { id: 4, name: 'Bulu Tangkis', icon: '🏸', count: '6 Lapangan' },
  ];

  return (
    <div className="min-h-screen bg-[#141c18] text-white font-sans pb-20">
      <header className="p-8 max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white">← Kembali</button>
        <h1 className="text-2xl font-bold">Kategori <span className="text-[#c2fd52]">Olahraga</span></h1>
      </header>

      <main className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => navigate('/jadwal')}
              className="bg-[#1f2b24] border border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-[#c2fd52] hover:-translate-y-1 transition duration-300"
            >
              <div className="text-6xl mb-4">{cat.icon}</div>
              <h3 className="font-bold text-lg">{cat.name}</h3>
              <p className="text-xs text-[#c2fd52] mt-2">{cat.count}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}