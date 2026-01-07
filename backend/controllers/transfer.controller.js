import { transferService } from '../services/transfer.service.js';

export const transfer = async (req, res) => {
    try {
        const { from_account_id, to_account_id, amount } = req.body;
        const userId = req.user.userId;

        const result = await transferService(
            userId,
            from_account_id,
            to_account_id,
            amount
        );

        res.json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
