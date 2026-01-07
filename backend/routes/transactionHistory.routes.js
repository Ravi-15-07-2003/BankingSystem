import express from 'express';
import { getAccountTransactions } from '../controllers/transactionHistory.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get(
    '/account/:account_id',
    authenticate,
    getAccountTransactions
);

export default router;
