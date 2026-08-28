import jwt from 'jsonwebtoken';
import CONFIG from '../config/config.js';
import UserModel from '../models/auth.model.js';

export const authenticateToken = async (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];

    const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};