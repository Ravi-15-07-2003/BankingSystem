import express from 'express';
import { getAccounts } from '../controllers/account.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requestAccount, getRequestStatus } from '../controllers/accountRequest.controller.js';

const router = express.Router();

//router.post('/create', authenticate, createAccount);
router.post('/request', authenticate, requestAccount);
router.get('/request/status', authenticate, getRequestStatus);
router.get('/', authenticate, getAccounts);

export default router;
