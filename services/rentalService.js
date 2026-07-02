const db = require('../config/db');
const CustomError = require('../utils/customError');

/**
 * Ambil daftar rental berdasarkan user role
 * Owner: melihat rental dari barang miliknya
 * Renter: melihat rental yang dia buat
 */
exports.getRentalsByUser = async (userId, role) => {
    let query;
    let params;

    if (role === 'owner') {
        query = `
            SELECT r.*, i.name AS item_name, u.name AS renter_name
            FROM rentals r
            JOIN items i ON r.item_id = i.id
            JOIN users u ON r.renter_id = u.id
            WHERE i.owner_id = ?
            ORDER BY r.created_at DESC
        `;
        params = [userId];
    } else {
        query = `
            SELECT r.*, i.name AS item_name
            FROM rentals r
            JOIN items i ON r.item_id = i.id
            WHERE r.renter_id = ?
            ORDER BY r.created_at DESC
        `;
        params = [userId];
    }

    const [rows] = await db.execute(query, params);
    return rows;
};

exports.createRental = async (renterId, itemId, startDate, endDate) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Pengecekan stok dengan ROW-LEVEL LOCKING (FOR UPDATE)
        const [items] = await connection.execute(
            'SELECT daily_price, status FROM items WHERE id = ? FOR UPDATE',
            [itemId]
        );

        const item = items[0];
        if (!item) {
            throw new CustomError('Barang tidak ditemukan.', 404);
        }
        if (item.status !== 'available') {
            throw new CustomError('Barang tidak tersedia atau sedang disewa.', 400);
        }

        // 2. Logika Perhitungan Biaya
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            throw new CustomError('Tanggal selesai harus lebih besar dari tanggal mulai.', 400);
        }

        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalPrice = days * parseFloat(item.daily_price);

        // 3. Pencatatan Transaksi
        const [result] = await connection.execute(
            `INSERT INTO rentals (item_id, renter_id, start_date, end_date, total_price, status)
             VALUES (?, ?, ?, ?, ?, 'active')`,
            [itemId, renterId, startDate, endDate, totalPrice]
        );

        // 4. Update Status Barang
        await connection.execute(
            'UPDATE items SET status = ? WHERE id = ?',
            ['rented', itemId]
        );

        // Fetch the created rental
        const [rentals] = await connection.execute(
            'SELECT * FROM rentals WHERE id = ?',
            [result.insertId]
        );

        await connection.commit();
        return rentals[0];

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.completeRental = async (ownerId, rentalId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Lock rental and check ownership via join
        const [rentals] = await connection.execute(
            `SELECT r.*, i.owner_id
             FROM rentals r
             JOIN items i ON r.item_id = i.id
             WHERE r.id = ? FOR UPDATE`,
            [rentalId]
        );

        const rental = rentals[0];

        if (!rental) {
            throw new CustomError('Data penyewaan tidak ditemukan.', 404);
        }
        if (rental.owner_id !== ownerId) {
            throw new CustomError('Akses ditolak. Anda bukan pemilik barang ini.', 403);
        }
        if (rental.status !== 'active') {
            throw new CustomError('Penyewaan ini tidak sedang aktif.', 400);
        }

        // Update rental status to completed
        await connection.execute(
            'UPDATE rentals SET status = ? WHERE id = ?',
            ['completed', rentalId]
        );

        // Update item status back to available
        await connection.execute(
            'UPDATE items SET status = ? WHERE id = ?',
            ['available', rental.item_id]
        );

        await connection.commit();
        return { message: 'Pengembalian barang berhasil dikonfirmasi.' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
