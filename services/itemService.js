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
        'SELECT id, name, description, daily_price FROM items WHERE status = ? ORDER BY created_at DESC',
        ['available']
    );
    return rows;
};
