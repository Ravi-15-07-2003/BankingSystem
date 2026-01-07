import pool from '../config/db.js';

export const depositService = async (userId, accountId, amount) => {
    if (!amount || amount <= 0) {
        throw new Error('Invalid deposit amount');
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Check account ownership & status
        const [accounts] = await connection.query(
            `SELECT balance, status 
             FROM accounts 
             WHERE id = ? AND user_id = ?`,
            [accountId, userId]
        );

        if (accounts.length === 0) {
            throw new Error('Account not found');
        }

        if (accounts[0].status !== 'active') {
            throw new Error('Account is not active');
        }

        // Update balance
        await connection.query(
            `UPDATE accounts 
             SET balance = balance + ? 
             WHERE id = ?`,
            [amount, accountId]
        );

        // Insert transaction record
        await connection.query(
            `INSERT INTO transactions 
             (account_id, transaction_type, amount, status) 
             VALUES (?, 'deposit', ?, 'success')`,
            [accountId, amount]
        );

        await connection.commit();
        return { message: 'Deposit successful' };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const withdrawService = async (userId, accountId, amount) => {
    if (!amount || amount <= 0) {
        throw new Error('Invalid withdrawal amount');
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [accounts] = await connection.query(
            `SELECT balance, status 
             FROM accounts 
             WHERE id = ? AND user_id = ?`,
            [accountId, userId]
        );

        if (accounts.length === 0) {
            throw new Error('Account not found');
        }

        if (accounts[0].status !== 'active') {
            throw new Error('Account is not active');
        }

        if (accounts[0].balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Deduct balance
        await connection.query(
            `UPDATE accounts 
             SET balance = balance - ? 
             WHERE id = ?`,
            [amount, accountId]
        );

        // Insert transaction
        await connection.query(
            `INSERT INTO transactions 
             (account_id, transaction_type, amount, status) 
             VALUES (?, 'withdraw', ?, 'success')`,
            [accountId, amount]
        );

        await connection.commit();
        return { message: 'Withdrawal successful' };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
