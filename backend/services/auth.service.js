import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const registerUser = async ({ full_name, email, password }) => {
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

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        message: 'Login successful',
        token
    };
};
