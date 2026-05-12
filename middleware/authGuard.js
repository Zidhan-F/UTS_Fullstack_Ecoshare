const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return next(new CustomError('Akses ditolak. Token tidak ada.', 401));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data user (id, role) ke request
        next();
    } catch (err) {
        return next(new CustomError('Token tidak valid.', 403));
    }
};

exports.requireRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return next(new CustomError(`Akses ditolak. Membutuhkan role: ${role}`, 403));
        }
        next();
    };
};
