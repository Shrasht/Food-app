import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    total_amount: {
        type: Number,
        required: true,
        unique: false
    },
    address: {
        type: String,
        required: true, // Fixed the typo here
        unique: false
    },
    status: {
        type: String,
        default: 'Payment Done'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true,
            },
            quantity: { 
                type: Number, 
                default: 1 
            }
        }],
        required: true // Ensure products are required
    }
}, { timestamps: true });

// Export the Order model correctly
export default mongoose.model('Order', OrderSchema);
