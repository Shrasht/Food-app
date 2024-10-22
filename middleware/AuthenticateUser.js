import jwt from 'jsonwebtoken'; // Ensure this import is present
import Food from '../models/Food.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        // Check if token is present
        if (!token) {
            return res.status(400).json({ message: 'Bad Request: Token is required.' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            // If the token is valid, attach the user to the request object
            req.user = user;
            next(); // Call the next middleware
        });
    } catch (err) {
        console.error('Token authentication error:', err); // Log the error for debugging
        return res.status(500).json({ message: 'Internal Server Error' }); // Return a 500 error
    }
};
