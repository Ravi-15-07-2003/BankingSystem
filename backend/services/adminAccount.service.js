import pool from '../config/db.js';
import { generateAccountNumber } from '../utils/accountNumber.js';

export const getPendingRequestsService = async () => {
    const [rows] = await pool.query(
        `SELECT id, user_id, account_type, submitted_data, created_at
         FROM account_requests WHERE status = 'pending'`
    );
    return rows;
};

export const approveRequestService = async (requestId) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const [[req]] = await conn.query(
            `SELECT * FROM account_requests WHERE id = ?`,
            [requestId]
        );

        if (!req) throw new Error('Request not found');

        await conn.query(
            `INSERT INTO accounts (user_id, account_number, account_type, status)
             VALUES (?, ?, ?, 'active')`,
            [req.user_id, generateAccountNumber(), req.account_type]
        );

        // await conn.query(
        //     `DELETE FROM account_requests WHERE id = ?`,
        //     [requestId]
        // );
        await conn.query(
            `UPDATE account_requests SET status = 'approved' WHERE id = ?`,
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

export const rejectRequestService = async (requestId) => {
    await pool.query(
        `DELETE FROM account_requests WHERE id = ?`,
        [requestId]
    );
};
