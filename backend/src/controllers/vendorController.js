const { query } = require('../config/db');

// Obtener vendedor por cédula (GET /api/vendedores/cedula/:cedula)
const getVendorByCedula = async (req, res, next) => {
  try {
    const { cedula } = req.params;

    if (!cedula || !cedula.trim()) {
      return res.status(400).json({ error: 'La cédula es requerida.' });
    }

    const vendors = await query(
      'SELECT id, nombre, cedula, telefono, created_at FROM vendedores WHERE cedula = ?',
      [cedula.trim()]
    );

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ message: 'Vendedor no encontrado.' });
    }

    return res.status(200).json({
      vendedor: vendors[0]
    });
  } catch (error) {
    next(error);
  }
};

// Crear o actualizar datos de vendedor (POST /api/vendedores)
const createOrUpdateVendor = async (req, res, next) => {
  try {
    const { nombre, cedula, telefono } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ error: 'El nombre del vendedor es obligatorio.' });
    }
    if (!cedula || !cedula.trim()) {
      return res.status(400).json({ error: 'La cédula del vendedor es obligatoria.' });
    }
    if (!telefono || !telefono.trim()) {
      return res.status(400).json({ error: 'El teléfono del vendedor es obligatorio.' });
    }

    // Insertar o actualizar si la cédula ya existe
    const sql = `
      INSERT INTO vendedores (nombre, cedula, telefono)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        telefono = VALUES(telefono)
    `;

    await query(sql, [nombre.trim(), cedula.trim(), telefono.trim()]);

    const result = await query('SELECT id, nombre, cedula, telefono FROM vendedores WHERE cedula = ?', [cedula.trim()]);

    return res.status(200).json({
      message: 'Vendedor registrado correctamente',
      vendedor: result[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVendorByCedula,
  createOrUpdateVendor
};
