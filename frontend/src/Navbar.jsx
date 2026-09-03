import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'text-[#c2fd52] font-bold' : 'text-gray-300 hover:text-[#c2fd52]';

  return (
    <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10 max-w-7xl mx-auto font-sans bg-[#141c18] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black text-sm">⚽</div>
        <span className="font-bold tracking-wider text-lg text-white">ARENA<span className="text-[#c2fd52]">NIAS</span></span>
      </div>
      
      <div className="hidden md:flex gap-6 text-sm">
        <button onClick={() => navigate('/')} className={isActive('/')}>Beranda</button>
        <button onClick={() => navigate('/venue')} className={isActive('/venue')}>Daftar Lapangan</button>
        <button onClick={() => navigate('/venue')} className={isActive('/booking')}>Booking Lapangan</button>
        <button onClick={() => navigate('/status')} className={isActive('/status')}>Cek Status Booking</button>
        <button onClick={() => navigate('/chat')} className={isActive('/chat')}>Tanya Nia 🤖</button>
      </div>

      <div>
        <button onClick={() => navigate('/login')} className="border border-white/20 px-4 py-2 rounded-full text-xs text-white hover:bg-white hover:text-black transition font-semibold">
          Admin Login
        </button>
      </div>
    </nav>
  );
}