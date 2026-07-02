const itemService = require('../services/itemService');

exports.create = async (req, res, next) => {
    try {
        const { name, description, daily_price } = req.body;
        const ownerId = req.user.id; // From authGuard

        if (!name || !daily_price) {
            return res.status(400).json({ success: false, error: 'Nama dan daily_price wajib diisi.' });
        }

        const item = await itemService.createItem(ownerId, name, description, daily_price);
        
        res.status(201).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllAvailable = async (req, res, next) => {
    try {
        const items = await itemService.getAvailableItems();
        
        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const itemId = parseInt(req.params.id);

        const result = await itemService.deleteItem(ownerId, itemId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
