import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import UserRoutes from './routes/User.js'; // Ensure this path is correct
import FoodRoutes from './routes/Food.js';
dotenv.config(); // Load environment variables

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use('/api/users', UserRoutes); // Mount the UserRoutes at /api/users
app.use('/api/food',FoodRoutes);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to Database");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

// Start server function
const startServer = async () => {
    await connectDB();
    app.listen(8000, () => console.log("Server started on Port 8000"));
};

startServer();
