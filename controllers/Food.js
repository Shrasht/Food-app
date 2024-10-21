import mongoose from "mongoose";
import Food from "../models/Food.js";

export const addProducts = async (req, res, next) => {
    try {
        const foodData = req.body;

        // Check if foodData is an array
        if (!Array.isArray(foodData)) {
            return res.status(400).json({ message: 'Expected an array of food items.' });
        }

        const createdFoods = []; // Corrected variable name

        for (const foodInfo of foodData) {
            const { name, desc, img, price, ingredients, category } = foodInfo;

            // Validate required fields
            if (!name || !desc || !price || !ingredients || !category) {
                return res.status(400).json({ message: 'All fields are required for each food item.' });
            }

            const product = new Food({
                name,
                desc,
                img,
                price,
                ingredients,
                category
            });

            // Wait for the save operation to complete
            const createdProduct = await product.save();
            createdFoods.push(createdProduct); // Push the newly created product
        }

        // Return the created foods
        return res.status(201).json({ success: true, products: createdFoods });
    } catch (error) {
        console.error('Error adding products:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
