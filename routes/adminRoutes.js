const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authGuard');

// Semua route di sini hanya boleh diakses oleh Admin (pemilik sistem)
router.get('/users', verifyToken, requireRole('admin'), adminController.getAllUsers);
router.put('/users/:id/role', verifyToken, requireRole('admin'), adminController.updateUserRole);

module.exports = router;
