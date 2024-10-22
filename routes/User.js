import express from "express"; // Import Express framework
import { addTocart, UserLogin, UserRegister } from "../controllers/User.js"; // Import UserRegister function from User controller
import { authenticateToken } from "../middleware/AuthenticateUser.js";

const router = express.Router(); // Create a new Express Router instance

// Define the POST route for user signup
router.post('/signup', UserRegister); // Attach the UserRegister handler to the /signup route
router.post('/login', UserLogin);
router.post('/cart',authenticateToken, addTocart)
export default router; // Export the router for use in other parts of the application
