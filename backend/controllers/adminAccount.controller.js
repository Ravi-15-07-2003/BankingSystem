import {
    getPendingRequestsService,
    approveRequestService,
    rejectRequestService
} from '../services/adminAccount.service.js';

export const getPendingRequests = async (req, res) => {
    const requests = await getPendingRequestsService();
    res.json(requests);
};

export const approveRequest = async (req, res) => {
    await approveRequestService(req.body.request_id);
    res.json({ message: 'Account approved and created' });
};

export const rejectRequest = async (req, res) => {
    await rejectRequestService(req.body.request_id);
    res.json({ message: 'Account request rejected' });
};
