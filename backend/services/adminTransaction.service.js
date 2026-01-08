import pool from '../config/db.js';

export const getPendingTransactionRequestsService = async () => {
    const [rows] = await pool.query(
        `SELECT * FROM transaction_requests WHERE status = 'pending'`
    );
    return rows;
};

export const approveTransactionRequestService = async (requestId) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [[req]] = await conn.query(
            `SELECT * FROM transaction_requests WHERE id = ? AND status = 'pending'`,
            [requestId]
        );

        if (!req) throw new Error('Invalid request');

       // deposit
        if (req.transaction_type === 'deposit') {
            await conn.query(
                `UPDATE accounts SET balance = balance + ? WHERE id = ?`,
                [req.amount, req.account_id]
            );
        }

        // withdraw
        if (req.transaction_type === 'withdraw') {
            await conn.query(
                `UPDATE accounts SET balance = balance - ? WHERE id = ?`,
                [req.amount, req.account_id]
            );
        }

        // transfer
         if (req.transaction_type === 'transfer') {

            if (!req.to_account_id) {
                throw new Error('Invalid transfer request');
            }

            // Debit sender
            await conn.query(
                `UPDATE accounts 
                 SET balance = balance - ? 
                 WHERE id = ?`,
                [req.amount, req.account_id]
            );

            // Credit receiver
            await conn.query(
                `UPDATE accounts 
                 SET balance = balance + ? 
                 WHERE id = ?`,
                [req.amount, req.to_account_id]
            );
        }

   // Insert transaction record
        await conn.query(
            `INSERT INTO transactions (account_id, transaction_type, amount, status)
             VALUES (?, ?, ?, 'success')`,
            [req.account_id, req.transaction_type, req.amount]
        );

    //  For transfer, record receiver-side transaction
        if (req.transaction_type === 'transfer') {
            await conn.query(
                `INSERT INTO transactions 
                 (account_id, transaction_type, amount, status)
                 VALUES (?, ?, ?, 'success')`,
                [req.to_account_id, req.transaction_type, req.amount]
            );
        }
   // remove request after execution
        await conn.query(
            `DELETE FROM transaction_requests WHERE id = ?`,
            [requestId]
        );

        await conn.commit();

    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

export const rejectTransactionRequestService = async (requestId) => {
    await pool.query(
        `DELETE FROM transaction_requests WHERE id = ?`,
        [requestId]
    );
};
