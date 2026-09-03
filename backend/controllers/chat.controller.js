// controllers/chat.controller.js
const db = require('../config/db');
const { sendResponse } = require('../utils/response');

exports.processChat = async (req, res) => {
  try {
    const { message } = req.body;

    // TODO: Di tahap produksi, integrasikan Axios ke endpoint Flowise di sini.
    // Contoh: const nlpResult = await axios.post('URL_FLOWISE', { question: message });
    // Untuk demo malam ini, kita langsung query ketersediaan jadwal terdekat.

    const { rows } = await db.query(`
      SELECT s.*, f.nama as nama_lapangan 
      FROM schedules s 
      JOIN fields f ON s.field_id = f.id 
      WHERE s.status = 'tersedia' 
      LIMIT 1
    `);

    let reply = "Maaf, saat ini belum ada jadwal lapangan yang kosong.";
    
    if (rows.length > 0) {
      const slot = rows[0];
      // Generate Direct Booking Link
      const bookingLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/booking?schedule_id=${slot.id}`;
      
      reply = `Halo! Nia menemukan slot kosong untuk lapangan **${slot.nama_lapangan}** pada tanggal **${slot.tanggal}** jam **${slot.jam_mulai}**. 
      
Silakan klik link berikut untuk langsung memesan: 
${bookingLink}`;
    }

    return sendResponse(res, { code: 200, success: true, message: 'Pesan diproses', data: { reply } });
  } catch (error) {
    return sendResponse(res, { code: 500, success: false, message: 'Gagal memproses pesan', data: error.message });
  }
};