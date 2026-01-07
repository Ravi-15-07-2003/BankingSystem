export const validateAmount = (req, res, next) => {
    const { amount } = req.body;

    if (amount === undefined || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
    next();
};
