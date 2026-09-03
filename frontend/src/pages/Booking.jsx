import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const prefillId = searchParams.get('schedule_id'); // Menangkap ID dari URL Chatbot

  const [formData, setFormData] = useState({
    schedule_id: prefillId || '',
    nama_pelanggan: '',
    kontak: '',
    metode_pembayaran: 'transfer'
  });

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-2xl font-bold text-center">Pemesanan Lapangan</h2>
      {prefillId && (
        <div className="bg-green-100 text-green-700 p-2 rounded text-sm text-center">
          Slot jadwal otomatis terpilih dari Chatbot Nia
        </div>
      )}
    </div>
  );
}