import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import accountRoutes from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import transferRoutes from './routes/transfer.routes.js';
import transactionHistoryRoutes from './routes/transactionHistory.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';
import helmet from 'helmet';
import { errorHandler } from './middlewares/error.middleware.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
// Load environment variables
dotenv.config();
const app = express();

app.use(helmet());
app.use(errorHandler);
app.use(cookieParser());

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/transactions-history', transactionHistoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/', apiLimiter);
app.use('/api/users', userRoutes);

// DB connection test
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database Connected');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
})();

// Test route
app.get('/', (req, res) => {
    res.send('Backend is running with DB connected');
});

app.get('/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS test');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
