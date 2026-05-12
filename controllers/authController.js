const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, error: 'Harap lengkapi semua field.' });
        }

        const user = await authService.registerUser(name, email, password, role);
        
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Harap berikan email dan password.' });
        }

        const authData = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            data: authData
        });
    } catch (error) {
        next(error);
    }
};
