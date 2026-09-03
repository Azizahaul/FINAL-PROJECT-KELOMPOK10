// config/db.js
const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres', // User default PostgreSQL
  password: process.env.DB_PASSWORD || 'password_pgadmin_kamu', // Ganti dengan password pgAdmin-mu
  database: process.env.DB_NAME || 'pemesanan_lapangan',
  port: process.env.DB_PORT || 5432, // Port default PostgreSQL
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};