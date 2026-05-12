const rentalService = require('../services/rentalService');

exports.create = async (req, res, next) => {
    try {
        const renterId = req.user.id;
        const { item_id, start_date, end_date } = req.body;

        if (!item_id || !start_date || !end_date) {
            return res.status(400).json({ success: false, error: 'Harap lengkapi item_id, start_date, dan end_date.' });
        }

        const rental = await rentalService.createRental(renterId, item_id, start_date, end_date);
        
        res.status(201).json({
            success: true,
            data: rental
        });
    } catch (error) {
        next(error);
    }
};

exports.complete = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const rentalId = req.params.id;

        const result = await rentalService.completeRental(ownerId, rentalId);
        
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};
