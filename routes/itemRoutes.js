const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken, requireRole } = require('../middleware/authGuard');

// Semua role (termasuk yang belum login, jika mau dibolehkan. Sesuai soal: Semua role melihat barang)
// Jika harus login, kita pakai verifyToken.
router.get('/', verifyToken, itemController.getAllAvailable);

// Hanya Owner
router.post('/', verifyToken, requireRole('owner'), itemController.create);

module.exports = router;
