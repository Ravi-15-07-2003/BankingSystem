import { registerUser, loginUser } from '../services/auth.service.js';

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
        const data = await loginUser(req.body);
        res.json(data);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    // Assuming token is sent in Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // Here you would typically add the token to a blacklist or invalidate it in your token store
    // For simplicity, we'll just respond with a success message
    res.json({ message: 'User logged out successfully' });
}
