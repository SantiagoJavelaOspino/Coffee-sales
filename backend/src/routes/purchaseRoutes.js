const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authMiddleware = require('../middleware/authMiddleware');

// Protegemos todas las rutas de compras
router.use(authMiddleware);

// POST /api/compras
router.post('/', purchaseController.createPurchase);

// GET /api/compras
router.get('/', purchaseController.getPurchases);

// GET /api/compras/:id
router.get('/:id', purchaseController.getPurchaseById);

// GET /api/compras/:id/voucher
router.get('/:id/voucher', purchaseController.downloadVoucher);

// DELETE /api/compras/:id
router.delete('/:id', purchaseController.deletePurchase);

module.exports = router;
