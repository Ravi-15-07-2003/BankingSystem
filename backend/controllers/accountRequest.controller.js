import { createAccountRequestService, getRequestStatusService } 
from '../services/accountRequest.service.js';

export const requestAccount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { account_type, kyc_data } = req.body;

        await createAccountRequestService(userId, account_type, kyc_data);

        res.status(201).json({
            message: 'Account request submitted and pending admin approval'
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getRequestStatus = async (req, res) => {
    const status = await getRequestStatusService(req.user.userId);
    res.json(status);
};
