import express from 'express';
import {
    deposit,
    withdraw
} from '../controllers/transaction.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/deposit', authenticate, deposit);
router.post('/withdraw', authenticate, withdraw);

export default router;
