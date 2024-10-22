import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Order from '../models/Order.js';


dotenv.config();

export const UserRegister = async (req, res, next) => {
    try {
        const { email, password, name, img } = req.body;

        
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required.' });
        }

      
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ message: 'Already Registered' });
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const user = new User({
            name,
            email,
            password: hashedPassword,
            img,
        });

      
        const createdUser = await user.save();

        
        const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
            expiresIn: '9999 years',
        });

       
        return res.status(201).json({ token, user });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const UserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

       
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password both are required.' });
        }

        
        const user = await User.findOne({ email :email}).exec();
        if (!user) {
            return res.status(400).json({ message: 'Please Register' });
        }

        
        const isCorrect = await bcrypt.compareSync(password, user.password);

        if (!isCorrect) {
            return res.status(403).json({ message: 'Incorrect Password' });
        }

       
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '9999 years',
        });

      
        return res.status(200).json({ token, user });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const addTocart = async (req, res, next) => {
    const { foodId, quantity } = req.body;
    const user_id = req.user.id;

    try {
        // Await the user retrieval
        const user = await User.findById(user_id); // Ensure to await this call

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Correct method name: findIndex
        const existingIndex = user.cart.findIndex((item) => item.foodId.toString() === foodId);

        // Check if the item exists in the cart
        if (existingIndex > -1) {
            // If it exists, update the quantity
            user.cart[existingIndex].quantity += quantity;
        } else {
            // If it doesn't exist, add it to the cart
            user.cart.push({ foodId, quantity });
        }

        // Save the updated user document
        await user.save();
        return res.status(200).json({ message: 'Item added successfully' });
    } catch (err) {
        console.error('Error adding to cart:', err); // Log the error for debugging
        return res.status(500).json({ message: 'Internal Server Error' }); // Return a 500 error
    }
};
