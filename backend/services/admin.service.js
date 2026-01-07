import pool from '../config/db.js';

export const getAllUsersService = async () => {
    const [users] = await pool.query(
        `SELECT id, full_name, email, role, is_active, created_at 
         FROM users`
    );
    return users;
};

export const updateUserStatusService = async (userId, isActive) => {
    const [result] = await pool.query(
        `UPDATE users SET is_active = ? WHERE id = ?`,
        [isActive, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error('User not found');
    }

    return { message: 'User status updated successfully' };
};

export const getAllAccountsService = async () => {
    const [accounts] = await pool.query(
        `SELECT 
            a.id,
            a.account_number,
            a.account_type,
            a.balance,
            a.status,
            u.full_name AS owner
         FROM accounts a
         JOIN users u ON a.user_id = u.id`
    );
    return accounts;
};

export const updateAccountStatusService = async (accountId, status) => {
    const [result] = await pool.query(
        `UPDATE accounts SET status = ? WHERE id = ?`,
        [status, accountId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Account not found');
    }

    return { message: 'Account status updated successfully' };
};
