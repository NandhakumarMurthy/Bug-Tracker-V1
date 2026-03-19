const { Pool } = require('pg');
require('dotenv').config();
console.log("Database User:", process.env.DB_USER);
console.log("Database Password:", process.env.DB_PASSWORD ? "Found it!" : "Still Undefined");

// We use a "Pool" because it manages multiple connections efficiently
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
