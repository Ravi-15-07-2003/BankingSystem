import pool from '../config/db.js';

export const getAccountTransactionsService = async (
    userId,
    accountId,
    filters
) => {
    // Verify account ownership
    const [accounts] = await pool.query(
        `SELECT id FROM accounts WHERE id = ? AND user_id = ?`,
        [accountId, userId]
    );

    if (accounts.length === 0) {
        throw new Error('Account not found or access denied');
    }

    let query = `
        SELECT 
            id,
            transaction_type,
            amount,
            status,
            created_at
        FROM transactions
        WHERE account_id = ?
    `;

    const params = [accountId];

    // Optional filters
    if (filters.type) {
        query += ` AND transaction_type = ?`;
        params.push(filters.type);
    }

    if (filters.fromDate) {
        query += ` AND created_at >= ?`;
        params.push(filters.fromDate);
    }

    if (filters.toDate) {
        query += ` AND created_at <= ?`;
        params.push(filters.toDate);
    }

    query += ` ORDER BY created_at DESC`;

    const [transactions] = await pool.query(query, params);
    return transactions;
};
