import pool from '../config/db.js';

export const transferService = async (
    userId,
    fromAccountId,
    toAccountId,
    amount
) => {
    if (!amount || amount <= 0) {
        throw new Error('Invalid transfer amount');
    }

    if (fromAccountId === toAccountId) {
        throw new Error('Cannot transfer to the same account');
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1️⃣ Check sender account
        const [fromAccounts] = await connection.query(
            `SELECT balance, status 
             FROM accounts 
             WHERE id = ? AND user_id = ?`,
            [fromAccountId, userId]
        );

        if (fromAccounts.length === 0) {
            throw new Error('Sender account not found');
        }

        if (fromAccounts[0].status !== 'active') {
            throw new Error('Sender account is not active');
        }

        if (fromAccounts[0].balance < amount) {
            throw new Error('Insufficient balance');
        }

        // 2️⃣ Check receiver account
        const [toAccounts] = await connection.query(
            `SELECT status 
             FROM accounts 
             WHERE id = ?`,
            [toAccountId]
        );

        if (toAccounts.length === 0) {
            throw new Error('Receiver account not found');
        }

        if (toAccounts[0].status !== 'active') {
            throw new Error('Receiver account is not active');
        }

        // 3️⃣ Debit sender
        await connection.query(
            `UPDATE accounts 
             SET balance = balance - ? 
             WHERE id = ?`,
            [amount, fromAccountId]
        );

        // 4️⃣ Credit receiver
        await connection.query(
            `UPDATE accounts 
             SET balance = balance + ? 
             WHERE id = ?`,
            [amount, toAccountId]
        );

        // 5️⃣ Insert transfer record
        const [transferResult] = await connection.query(
            `INSERT INTO transfers 
             (from_account, to_account, amount, status) 
             VALUES (?, ?, ?, 'success')`,
            [fromAccountId, toAccountId, amount]
        );

        // 6️⃣ Insert transactions (double entry)
        await connection.query(
            `INSERT INTO transactions 
             (account_id, transaction_type, amount, status)
             VALUES (?, 'transfer', ?, 'success')`,
            [fromAccountId, amount]
        );

        await connection.query(
            `INSERT INTO transactions 
             (account_id, transaction_type, amount, status)
             VALUES (?, 'transfer', ?, 'success')`,
            [toAccountId, amount]
        );

        await connection.commit();

        return {
            message: 'Transfer successful',
            transfer_id: transferResult.insertId
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
