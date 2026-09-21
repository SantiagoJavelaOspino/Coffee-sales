const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_cafe_don_beto_2026_jwt_token_auth';

const authMiddleware = (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    // 1. Extraer token del encabezado Authorization: Bearer <token>
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    // 2. Extraer token del parámetro de consulta URL (?token=...) para descargas directas en navegador (Vouchers)
    else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        error: 'Acceso no autorizado. Debe iniciar sesión.'
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
