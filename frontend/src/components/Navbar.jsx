import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'text-[#c2fd52] font-bold border-b-2 border-[#c2fd52] pb-1' : 'text-gray-300 hover:text-[#c2fd52] transition';

  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b border-white/10 max-w-7xl mx-auto font-sans bg-[#141c18] sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black text-sm">⚽</div>
        <span className="font-bold tracking-wider text-lg text-white">ARENA<span className="text-[#c2fd52]">NIAS</span></span>
      </div>
      
      {/* Menu Navigasi Tanpa "Daftar Lapangan" */}
      <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
        <button onClick={() => navigate('/')} className={isActive('/')}>Beranda</button>
        <button onClick={() => navigate('/venue')} className={isActive('/venue')}>Booking Lapangan</button>
        <button onClick={() => navigate('/status')} className={isActive('/status')}>Cek Status Booking</button>
        <button onClick={() => navigate('/chat')} className={`flex items-center gap-1.5 ${isActive('/chat')}`}>
          <span>🤖</span> Tanya Nia
        </button>
      </div>

      {/* Admin Login Button */}
      <div>
        <button 
          onClick={() => navigate('/login')} 
          className="border border-[#c2fd52]/40 bg-[#c2fd52]/10 px-4 py-2 rounded-full text-xs text-[#c2fd52] hover:bg-[#c2fd52] hover:text-black transition font-bold"
        >
          Admin Login
        </button>
      </div>
    </nav>
  );
}