import express from 'express';
import { addCarController, getAllCarsController, getCarByIdController, getCarsByUserIdController, removeCarController } from '../controllers/carController.js';

const router = express.Router();

router.post('/add', addCarController); // Route to add a new car
router.get('/', getAllCarsController); // Route to get all cars
router.get('/:id', getCarByIdController); // Route to get a car by ID
router.get('/user/:userId', getCarsByUserIdController); // Route to get cars by user ID
router.delete('/:id', removeCarController); // Route to remove a car by ID

export default router;
