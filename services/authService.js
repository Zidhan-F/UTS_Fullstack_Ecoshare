const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const CustomError = require('../utils/customError');

exports.registerUser = async (name, email, password, role) => {
    // Validate role
    if (!['owner', 'renter'].includes(role)) {
        throw new CustomError('Role tidak valid.', 400);
    }

    // Check if user exists
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
        throw new CustomError('Email sudah terdaftar.', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, role]
    );

    // Fetch the newly created user (MySQL doesn't support RETURNING)
    const [rows] = await db.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [result.insertId]
    );

    return rows[0];
};

exports.loginUser = async (email, password) => {
    // Get user
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
        throw new CustomError('Email atau password salah.', 401);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new CustomError('Email atau password salah.', 401);
    }

    // Generate token
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};
