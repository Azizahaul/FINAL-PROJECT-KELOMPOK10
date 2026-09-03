import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    }
  };

  return (
    <div className="min-h-screen bg-[#141c18] flex items-center justify-center px-4 font-sans text-white">
      <div className="bg-[#1f2b24] p-8 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#c2fd52] flex items-center justify-center font-bold text-black mx-auto mb-3">⚽</div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-gray-400 text-sm">Login khusus pengelola Arena Nias</p>
        </div>
        
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-500/50">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#c2fd52] transition" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#141c18] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#c2fd52] transition" required />
          </div>
          <button type="submit" className="w-full bg-[#c2fd52] text-black font-bold py-3 rounded-xl hover:bg-[#b0ea40] transition mt-2">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}