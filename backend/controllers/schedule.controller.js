// controllers/schedule.controller.js
const db = require('../config/db');
const { sendResponse } = require('../utils/response');

exports.getAllSchedules = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT s.*, f.nama as nama_lapangan 
      FROM schedules s 
      JOIN fields f ON s.field_id = f.id
    `);
    return sendResponse(res, { code: 200, success: true, message: 'Data jadwal berhasil diambil', data: rows });
  } catch (error) {
    return sendResponse(res, { code: 500, success: false, message: 'Gagal mengambil jadwal', data: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { field_id, tanggal, jam_mulai, jam_selesai } = req.body;
    const status = 'tersedia'; 
    
    // Pakai $1, $2, $3, $4, $5 untuk PostgreSQL
    await db.query(
      'INSERT INTO schedules (field_id, tanggal, jam_mulai, jam_selesai, status) VALUES ($1, $2, $3, $4, $5)',
      [field_id, tanggal, jam_mulai, jam_selesai, status]
    );
    
    return sendResponse(res, { code: 201, success: true, message: 'Jadwal berhasil ditambahkan', data: null });
  } catch (error) {
    return sendResponse(res, { code: 500, success: false, message: 'Gagal menambah jadwal', data: error.message });
  }
};