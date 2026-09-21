const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas de vendedores requieren autenticación
router.use(authMiddleware);

// GET /api/vendedores/cedula/:cedula
router.get('/cedula/:cedula', vendorController.getVendorByCedula);

// POST /api/vendedores
router.post('/', vendorController.createOrUpdateVendor);

module.exports = router;
