const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Route: POST /api/auth/login
router.post('/login', authController.login);

// Route: GET /api/auth/me (Protegida)
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
