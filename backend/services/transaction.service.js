import pool from '../config/db.js';
import { getTotalAmountLast24Hours } 
from './transactionLimit.service.js';

const LIMIT = 100000;

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

    // If amount exceeds 100,000, create a transaction request for admin approval
    if (amount > LIMIT) {
        await pool.query(
            `INSERT INTO transaction_requests
             (account_id, user_id, transaction_type, amount)
             VALUES (?, ?, 'deposit', ?)`,
            [accountId, userId, amount]
        );

        return {
            message: 'Deposit request sent for admin approval'
        };
    }

    // 2 Rolling 24-hour rule
    const totalLast24h =
        await getTotalAmountLast24Hours(accountId, 'deposit');
        if (totalLast24h + amount > LIMIT) {
            await pool.query(
            `INSERT INTO transaction_requests
             (account_id, user_id, transaction_type, amount)
             VALUES (?, ?, 'deposit', ?)`,
            [accountId, userId, amount]
        );

        return {
            message: 'Deposit request sent for admin approval'
        };
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
    // If amount exceeds 100,000, create a transaction request for admin approval
         if (amount > LIMIT) {
        await pool.query(
            `INSERT INTO transaction_requests
             (account_id, user_id, transaction_type, amount)
             VALUES (?, ?, 'withdraw', ?)`,
            [accountId, userId, amount]
        );

        return {
            message: 'Withdrawal request sent for admin approval'
        };
    }

    //last 24-hour rule
    const totalLast24h =
        await getTotalAmountLast24Hours(accountId, 'withdraw');
        if (totalLast24h + amount > LIMIT) {
            await pool.query(
            `INSERT INTO transaction_requests
             (account_id, user_id, transaction_type, amount)
             VALUES (?, ?, 'withdraw', ?)`,
            [accountId, userId, amount]
        );

        return {
            message: 'Withdrawal request sent for admin approval'
        };
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
