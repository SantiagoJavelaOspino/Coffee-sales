const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas principales de la API
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/vendedores', vendorRoutes);
app.use('/api/compras', purchaseRoutes);

// Ruta de comprobación de salud de la API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API CompraVenta de Café Don Beto funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
