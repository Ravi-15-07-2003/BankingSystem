import {
    getPendingTransactionRequestsService,
    approveTransactionRequestService,
    rejectTransactionRequestService
} from '../services/adminTransaction.service.js';

export const getPendingTransactionRequests = async (req, res) => {
    const requests = await getPendingTransactionRequestsService();
    res.json(requests);
};

export const approveTransactionRequest = async (req, res) => {
    const { request_id } = req.body;
    await approveTransactionRequestService(request_id);
    res.json({ message: 'Transaction approved and executed' });
};

export const rejectTransactionRequest = async (req, res) => {
    const { request_id } = req.body;
    await rejectTransactionRequestService(request_id);
    res.json({ message: 'Transaction rejected' });
};
