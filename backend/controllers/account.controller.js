import { getAccountsService} from '../services/account.service.js';

// export const createAccount = async (req, res) => {
//     try {
//         const { account_type } = req.body;
//         const userId = req.user.userId;

//         const account = await createAccountService(userId, account_type);

//         res.status(201).json({
//             message: 'Account created successfully',
//             account
//         });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

export const getAccounts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const accounts = await getAccountsService(userId);

        res.json(accounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
