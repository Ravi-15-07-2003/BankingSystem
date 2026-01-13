import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadProfilePicture } from '../controllers/user.controller.js';

const router = express.Router();

router.post(
    '/profile-picture',
    authenticate,
    upload.single('profile_picture'),
    uploadProfilePicture
);

export default router;
