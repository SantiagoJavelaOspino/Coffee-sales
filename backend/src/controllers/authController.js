const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_cafe_don_beto_2026_jwt_token_auth';

// Controller para Iniciar Sesión (POST /api/auth/login)
const login = async (req, res, next) => {
  try {
    const { cedula, password } = req.body;

    if (!cedula || !cedula.trim()) {
      return res.status(400).json({ error: 'La cédula es requerida.' });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'La contraseña es requerida.' });
    }

    // Buscar usuario por cédula
    const users = await query(
      'SELECT id, cedula, nombre, password, estado FROM usuarios WHERE cedula = ? AND estado = 1',
      [cedula.trim()]
    );

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Las credenciales son incorrectas.' });
    }

    const user = users[0];

    // Verificar contraseña con bcrypt
    let isMatch = await bcrypt.compare(password, user.password);

    // Si bcrypt falla, comparar directamente (soporte para datos de prueba iniciales)
    if (!isMatch && password === user.password) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(400).json({ error: 'Las credenciales son incorrectas.' });
    }

    // Generar Token JWT válido por 24 horas
    const tokenPayload = {
      id: user.id,
      cedula: user.cedula,
      nombre: user.nombre
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre
      }
    });

  } catch (error) {
    next(error);
  }
};

// Controller para obtener el perfil del usuario autenticado (GET /api/auth/me)
const getMe = async (req, res, next) => {
  try {
    const users = await query(
      'SELECT id, cedula, nombre, estado, created_at FROM usuarios WHERE id = ?',
      [req.user.id]
    );

    if (!users || users.length === 0) {
      return res.status(444).json({ error: 'Usuario no encontrado.' });
    }

    return res.status(200).json({
      usuario: users[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe
};
