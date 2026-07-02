const db = require('../config/db');
const CustomError = require('../utils/customError');

exports.getAllUsers = async (req, res, next) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const { role } = req.body;

        if (!role || !['admin', 'owner', 'renter'].includes(role)) {
            return res.status(400).json({ success: false, error: 'Role tidak valid.' });
        }

        if (req.user.id === userId && role !== 'admin') {
            return res.status(400).json({ success: false, error: 'Anda tidak dapat mengubah role Anda sendiri.' });
        }

        await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
        
        res.status(200).json({
            success: true,
            message: 'Role user berhasil diperbarui.'
        });
    } catch (error) {
        next(error);
    }
};
