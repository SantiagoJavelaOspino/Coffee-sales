require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Servidor Café Don Beto corriendo en el puerto: ${PORT}`);
    console.log(` URL API: http://localhost:${PORT}/api/health`);
    console.log(` Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
