import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    desc: {
        type: String,
        required: true,  // Fixed typo here
        unique: false,
    },
    price: {
        type: {
            org: { type: Number, default: 0.0 },
            mrp: { type: Number, default: 0.0 },
            dis: { type: Number, default: 0.0 },
        },
        required: true,
    },
    img: {
        type: String,
        default: null,
    },
    category: {
        type: [String],
        default: [],
    },
    ingredients: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

// Correcting model export
export default mongoose.model('Food', FoodSchema);
