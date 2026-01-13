import { registerUser, loginUser } from '../services/auth.service.js';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { generateAccessToken } from '../utils/token.js';

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const {message, accessToken, refreshToken } = await loginUser(req.body);

        //set access token in HTTP-only cookie
        res.cookie('accessToken', accessToken, {
        httpOnly: true,      // JS cannot read (XSS safe)
        secure: false,        // HTTPS only (false for localhost)
        sameSite: 'strict',
        maxAge: 10 * 60 * 1000 // 10 minutes
        });


          //  set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,      // JS cannot access
            secure: false,        // HTTPS only (set false for localhost)
            sameSite: 'strict',  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

          // send access token in response body
        res.json({
            message
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const userId = req.user.userId;

        // remove refresh token
        await pool.query(
            `UPDATE users SET refresh_token = NULL WHERE id = ?`,
            [userId]
        );

        res.clearCookie('refreshToken');

        res.json({ message: 'Logged out successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const [[user]] = await pool.query(
            `SELECT id FROM users WHERE id = ? AND refresh_token = ?`,
            [decoded.userId, refreshToken]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken({
            userId: decoded.userId,
            role: decoded.role
        });
        
        res.json({ accessToken: newAccessToken });

    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};