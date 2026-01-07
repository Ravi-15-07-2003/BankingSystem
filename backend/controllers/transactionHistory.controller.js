import {
    getAccountTransactionsService
} from '../services/transactionHistory.service.js';

export const getAccountTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { account_id } = req.params;
        const { type, fromDate, toDate } = req.query;

        const transactions = await getAccountTransactionsService(
            userId,
            account_id,
            { type, fromDate, toDate }
        );

        res.json({
            account_id,
            total_transactions: transactions.length,
            transactions
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
