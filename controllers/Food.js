import mongoose from "mongoose";
import Food from "../models/Food.js";

export const addProducts = async (req, res, next) => {
    try {
        const foodData = req.body;

        if (!Array.isArray(foodData)) {
            return res.status(400).json({ message: 'Expected an array of food items.' });
        }

        const createdFoods = [];

        for (const foodInfo of foodData) {
            const { name, desc, img, price, ingredients, category } = foodInfo;

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

            const createdProduct = await product.save();
            createdFoods.push(createdProduct);
        }

        return res.status(201).json({ success: true, products: createdFoods });
    } catch (error) {
        console.error('Error adding products:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getProducts = async (req, res, next) => {
    try {
        let { name, maxprice, minprice, ingredients, categories, search } = req.query;
        ingredients = ingredients?.split(',') || [];
        categories = categories?.split(',') || [];

        const filter = {};

        if (categories.length) {
            filter.category = { $in: categories };
        }

        if (ingredients.length) {
            filter.ingredients = { $in: ingredients };
        }

        if (maxprice || minprice) {
            filter['price.org'] = {};
            if (minprice) {
                filter['price.org']['$gte'] = parseFloat(minprice);
            }
            if (maxprice) {
                filter['price.org']['$lte'] = parseFloat(maxprice);
            }
        }

        if (search) {
            filter.$or = [
                { name: { $regex: new RegExp(search, 'i') } },
                { desc: { $regex: new RegExp(search, 'i') } }
            ];
        }

        const foodList = await Food.find(filter);
        return res.status(200).json(foodList);
    } catch (err) {
        console.error('Error retrieving products:', err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getFoodById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate the ObjectId
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid food ID' });
        }

        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }

        return res.status(200).json(food);
    } catch (err) {
        console.error('Error retrieving food by ID:', err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
