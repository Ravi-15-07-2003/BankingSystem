import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { isValidEmail } from '../utils/emailValidators.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

export const registerUser = async ({ full_name, email, password }) => {

    // ✅ Email format validation
        if (!isValidEmail(email)) {
             throw new Error('Email Invalid');
            };

    if (!full_name || !email || !password) {
        throw new Error('All fields are required');
    }

    const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
    );

    if (existing.length > 0) {
        throw new Error('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        `INSERT INTO users (full_name, email, password_hash)
         VALUES (?, ?, ?)`,
        [full_name, email, passwordHash]
    );

    return {
        id: result.insertId,
        full_name,
        email
    };
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const [users] = await pool.query(
        'SELECT * FROM users WHERE email = ? AND is_active = true',
        [email]
    );

    if (users.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const payload = {
            userId: user.id,
            role: user.role
        };

     const accessToken = generateAccessToken(payload);
     const refreshToken = generateRefreshToken(payload);

     // ✅ Store refresh token in DB
        await pool.query(
            `UPDATE users SET refresh_token = ? WHERE id = ?`,
            [refreshToken, user.id]
        );

    return {
        message: 'Login successful',
        accessToken,
        refreshToken
    };
};
