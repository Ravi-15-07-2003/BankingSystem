import express from 'express';
import {
    getAllUsers,
    updateUserStatus,
    getAllAccounts,
    updateAccountStatus
} from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import {
    getPendingRequests,
    approveRequest,
    rejectRequest
} from '../controllers/adminAccount.controller.js';
import {
    getPendingTransactionRequests,
    approveTransactionRequest,
    rejectTransactionRequest
} from '../controllers/adminTransaction.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/account-requests', getPendingRequests);
router.post('/account-requests/approve', approveRequest);
router.post('/account-requests/reject', rejectRequest);

router.get('/users', getAllUsers);
router.patch('/users/status', updateUserStatus);

router.get('/accounts', getAllAccounts);
router.patch('/accounts/status', updateAccountStatus);

router.get('/transaction-requests', getPendingTransactionRequests);
router.post('/transaction-requests/approve', approveTransactionRequest);
router.post('/transaction-requests/reject', rejectTransactionRequest);

export default router;
