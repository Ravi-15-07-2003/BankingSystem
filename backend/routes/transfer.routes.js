import express from 'express';
import { transfer } from '../controllers/transfer.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateAmount } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.post('/transfer', authenticate, validateAmount, transfer);

export default router;
