import pool from '../config/db.js';

// export const createAccountService = async (userId, accountType) => {
//     if (!accountType) {
//         throw new Error('Account type is required');
//     }

//     const accountNumber = generateAccountNumber();

//     const [result] = await pool.query(
//         `INSERT INTO accounts (user_id, account_number, account_type)
//          VALUES (?, ?, ?)`,
//         [userId, accountNumber, accountType]
//     );

//     return {
//         account_id: result.insertId,
//         account_number: accountNumber,
//         account_type: accountType
//     };
// };

export const getAccountsService = async (userId) => {
    const [accounts] = await pool.query(
        `SELECT id, account_number, account_type, balance, status, created_at
         FROM accounts
         WHERE user_id = ?`,
        [userId]
    );

    return accounts;
};
