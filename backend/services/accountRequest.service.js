import pool from '../config/db.js';

export const createAccountRequestService = async (userId, accountType, submitted_data
, kycDocuments) => {
    const [existing] = await pool.query(
        `SELECT id FROM account_requests WHERE user_id = ?`,
        [userId]
    );

    if (existing.length > 0) {
        throw new Error('Account request already exists');
    }

    await pool.query(
        `INSERT INTO account_requests (user_id, account_type, submitted_data, kyc_documents)
         VALUES (?, ?, ?, ?)`,
        [userId, accountType, JSON.stringify(submitted_data), JSON.stringify(kycDocuments)]
    );
};

export const getRequestStatusService = async (userId) => {
    const [rows] = await pool.query(
        `SELECT status FROM account_requests WHERE user_id = ?`,
        [userId]
    );

    return rows.length ? rows[0] : { status: 'no_request' };
};
