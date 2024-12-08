import express from "express"; // Import Express framework
import { UserLogin, UserRegister } from "../controllers/User.js"; // Import UserRegister function from User controller
import { addProducts,getFoodById,getProducts } from "../controllers/Food.js";

const router = express.Router(); // Create a new Express Router instance

// Define the POST route for user signup
router.post('/add', addProducts); // Attach the UserRegister handler to the /signup route
router.get('/get',getProducts);
router.get('/:id',getFoodById);
export default router; // Export the router for use in other parts of the application


