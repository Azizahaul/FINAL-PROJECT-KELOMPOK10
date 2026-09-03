import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const prefillId = searchParams.get('schedule_id');

  const [formData, setFormData] = useState({
    schedule_id: prefillId || '',
    nama_pelanggan: '',
    kontak: '',
    metode_pembayaran: 'transfer'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        alert('Pemesanan berhasil! Menunggu konfirmasi admin.');
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi server');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white border rounded-xl shadow-sm space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-center">Pemesanan Lapangan</h2>
      
      {prefillId && (
        <div className="bg-green-100 text-green-700 p-2 rounded text-sm text-center">
          ✅ Slot jadwal otomatis terpilih
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input 
          type="text" name="schedule_id" value={formData.schedule_id} onChange={handleChange} 
          placeholder="ID Jadwal" className="border p-2 rounded" required readOnly={!!prefillId} 
        />
        <input 
          type="text" name="nama_pelanggan" value={formData.nama_pelanggan} onChange={handleChange} 
          placeholder="Nama Lengkap" className="border p-2 rounded" required 
        />
        <input 
          type="text" name="kontak" value={formData.kontak} onChange={handleChange} 
          placeholder="No WhatsApp" className="border p-2 rounded" required 
        />
        <select name="metode_pembayaran" value={formData.metode_pembayaran} onChange={handleChange} className="border p-2 rounded">
          <option value="transfer">Transfer Bank</option>
          <option value="cod">Bayar di Tempat (COD)</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold">
          Submit Pemesanan
        </button>
      </form>
    </div>
  );
}