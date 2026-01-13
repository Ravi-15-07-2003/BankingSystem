import pool from '../config/db.js';

export const uploadProfilePicture = async (req, res) => {
    try {
        const imageUrl = req.file.path; // Cloudinary URL
        const userId = req.user.userId;

        await pool.query(
            `UPDATE users SET profile_picture = ? WHERE id = ?`,
            [imageUrl, userId]
        );

        res.json({
            message: 'Profile picture uploaded successfully',
            profile_picture: imageUrl
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
