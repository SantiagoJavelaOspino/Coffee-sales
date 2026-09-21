const mysql = require('mysql2/promise');

let poolConfig = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-05:00' // Zona horaria de Colombia
};

if (process.env.DATABASE_URL || process.env.DB_URI) {
  const uri = process.env.DATABASE_URL || process.env.DB_URI;
  poolConfig.uri = uri;
  if (!uri.includes('ssl-mode=DISABLED')) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
} else {
  poolConfig = {
    ...poolConfig,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cafe_don_beto_db'
  };

  // Si se conecta a Aiven u otro MySQL remoto con SSL
  if (
    process.env.DB_SSL === 'true' ||
    process.env.DB_SSL === 'required' ||
    (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com'))
  ) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
}

const pool = mysql.createPool(poolConfig);

// Función auxiliar para ejecutar consultas SQL con parámetros
const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Error al ejecutar consulta SQL:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  query
};
