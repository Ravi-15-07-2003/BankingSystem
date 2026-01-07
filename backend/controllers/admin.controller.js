import {
    getAllUsersService,
    updateUserStatusService,
    getAllAccountsService,
    updateAccountStatusService
} from '../services/admin.service.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { user_id, is_active } = req.body;
        const result = await updateUserStatusService(user_id, is_active);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllAccounts = async (req, res) => {
    try {
        const accounts = await getAllAccountsService();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateAccountStatus = async (req, res) => {
    try {
        const { account_id, status } = req.body;
        const result = await updateAccountStatusService(account_id, status);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
