import express from 'express';
import {
    getAllUsers,
    updateUserStatus,
    getAllAccounts,
    updateAccountStatus
} from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.patch('/users/status', updateUserStatus);

router.get('/accounts', getAllAccounts);
router.patch('/accounts/status', updateAccountStatus);

export default router;
