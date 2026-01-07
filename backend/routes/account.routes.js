import express from 'express';
import {
    createAccount,
    getAccounts
} from '../controllers/account.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticate, createAccount);
router.get('/', authenticate, getAccounts);

export default router;
