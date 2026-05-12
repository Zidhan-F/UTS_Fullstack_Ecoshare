const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { verifyToken, requireRole } = require('../middleware/authGuard');

// Hanya Renter yang bisa meminjam
router.post('/', verifyToken, requireRole('renter'), rentalController.create);

// Hanya Owner yang bisa mengkonfirmasi pengembalian
router.post('/:id/complete', verifyToken, requireRole('owner'), rentalController.complete);

module.exports = router;
