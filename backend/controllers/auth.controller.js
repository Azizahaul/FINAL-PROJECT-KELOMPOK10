// controllers/auth.controller.js
const db = require('../config/db');
const sendResponse = require('../utils/response'); // Pastikan path ini sesuai
const bcrypt = require('bcrypt'); // atau sesuaikan jika menggunakan enkripsi password

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Contoh query cek admin ke database
    const query = 'SELECT * FROM admins WHERE username = $1';
    const { rows } = await db.query(query, [username]);

    if (rows.length === 0) {
      return sendResponse(res, { code: 401, success: false, message: 'Username atau password salah', data: null });
    }

    const admin = rows[0];

    // Jika password di database plain text (atau gunakan bcrypt.compare jika di-hash)
    if (password !== admin.password) {
      return sendResponse(res, { code: 401, success: false, message: 'Username atau password salah', data: null });
    }

    return sendResponse(res, { 
      code: 200, 
      success: true, 
      message: 'Login berhasil', 
      data: { username: admin.username } 
    });

  } catch (error) {
    console.error('Login Error:', error);
    return sendResponse(res, { code: 500, success: false, message: 'Error server', data: error.message });
  }
};