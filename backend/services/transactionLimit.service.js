import pool from '../config/db.js';

export const getTotalAmountLast24Hours = async (
    accountId,
    transactionType
) => {
    const [[row]] = await pool.query(
        `SELECT IFNULL(SUM(amount), 0) AS total
         FROM transactions
         WHERE account_id = ?
           AND transaction_type = ?
           AND status = 'success'
           AND created_at >= NOW() - INTERVAL 24 HOUR`,
        [accountId, transactionType]
    );

    return Number(row.total);
};
