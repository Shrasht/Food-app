import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // This field is required
        unique: false    // Not unique
    },
    password: {
        type: String,
        required: true,  // Fixed typo from 'requrired' to 'required'
        unique: false    // Not unique
    },
    email: {
        type: String,
        required: true,  // This field is required
        unique: true     // Must be unique
    },
    img: {
        type: String,
        default: null     // Default value is null
    },
    favourites: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds referencing Food
        ref: 'Food',                             // Reference to Food model
        default: []                               // Default to an empty array
    },
    order: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds referencing Order
        ref: 'Order',                            // Reference to Order model
        default: []                               // Default to an empty array
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Export the User model
export default mongoose.model('User', UserSchema);
