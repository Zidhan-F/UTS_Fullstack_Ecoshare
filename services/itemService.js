const db = require('../config/db');
const CustomError = require('../utils/customError');

exports.createItem = async (ownerId, name, description, dailyPrice) => {
    const [result] = await db.execute(
        'INSERT INTO items (owner_id, name, description, daily_price, status) VALUES (?, ?, ?, ?, ?)',
        [ownerId, name, description, dailyPrice, 'available']
    );

    const [rows] = await db.execute('SELECT * FROM items WHERE id = ?', [result.insertId]);
    return rows[0];
};

exports.getAvailableItems = async () => {
    const [rows] = await db.execute(
        'SELECT id, owner_id, name, description, daily_price, status FROM items WHERE status = ? ORDER BY created_at DESC',
        ['available']
    );
    return rows;
};

exports.deleteItem = async (ownerId, itemId) => {
    const [items] = await db.execute('SELECT * FROM items WHERE id = ?', [itemId]);
    const item = items[0];

    if (!item) {
        throw new CustomError('Barang tidak ditemukan.', 404);
    }

    if (item.owner_id !== ownerId) {
        throw new CustomError('Akses ditolak. Anda bukan pemilik barang ini.', 403);
    }

    if (item.status === 'rented') {
        throw new CustomError('Barang sedang disewa dan tidak dapat dihapus.', 400);
    }

    await db.execute('DELETE FROM items WHERE id = ?', [itemId]);
    return { message: 'Barang berhasil dihapus.' };
};
