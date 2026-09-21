const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_cafe_don_beto_2026_jwt_token_auth';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Acceso no autorizado. Debe iniciar sesión.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token de autenticación no proporcionado.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, cedula, nombre, iat, exp }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.'
      });
    }

    return res.status(401).json({
      error: 'Token inválido o expirado. Inicie sesión nuevamente.'
    });
  }
};

module.exports = authMiddleware;
