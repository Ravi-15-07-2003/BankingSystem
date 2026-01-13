import { createAccountRequestService, getRequestStatusService } 
from '../services/accountRequest.service.js';

export const requestAccount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { account_type, submitted_data } = req.body;

        const kycDocuments = {
            aadhaar_pdf: req.files?.aadhaar_pdf?.[0]?.path || null,
            pan_pdf: req.files?.pan_pdf?.[0]?.path || null
        };

        await createAccountRequestService(userId, account_type, submitted_data, kycDocuments);

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
