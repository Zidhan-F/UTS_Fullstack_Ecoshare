const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken, requireRole } = require('../middleware/authGuard');

// Semua role (termasuk yang belum login, Semua role bisa melihat barang)
// Jika harus login, kita pakai verifyToken.
router.get('/', verifyToken, itemController.getAllAvailable);

// Hanya Owner yang bisa menambah dan menghapus barangnya
router.post('/', verifyToken, requireRole('owner'), itemController.create);
router.delete('/:id', verifyToken, requireRole('owner'), itemController.delete);

module.exports = router;
