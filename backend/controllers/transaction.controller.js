import {
    depositService,
    withdrawService
} from '../services/transaction.service.js';

export const deposit = async (req, res) => {
    try {
        const { account_id, amount } = req.body;
        const userId = req.user.userId;

        const result = await depositService(userId, account_id, amount);
        res.json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const withdraw = async (req, res) => {
    try {
        const { account_id, amount } = req.body;
        const userId = req.user.userId;

        const result = await withdrawService(userId, account_id, amount);
        res.json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
