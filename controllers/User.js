import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Order from '../models/Order.js';

// Load .env file
dotenv.config();

export const UserRegister = async (req, res, next) => {
    try {
        const { email, password, name, img } = req.body;

        // Validate incoming data
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ message: 'Already Registered' });
        }

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const user = new User({
            name,
            email,
            password: hashedPassword,
            img,
        });

        // Save the new user to the database
        const createdUser = await user.save();

        // Create a token using the correct secret
        const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
            expiresIn: '9999 years',
        });

        // Return the token and user data
        return res.status(201).json({ token, user });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const UserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate incoming data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password both are required.' });
        }

        // Check if the user exists
        const user = await User.findOne({ email :email}).exec();
        if (!user) {
            return res.status(400).json({ message: 'Please Register' });
        }

        // Compare input password with hashed password
        const isCorrect = await bcrypt.compareSync(password, user.password);

        if (!isCorrect) {
            return res.status(403).json({ message: 'Incorrect Password' });
        }

        // Create a token using the correct secret
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '9999 years',
        });

        // Return the token and user data
        return res.status(200).json({ token, user });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
