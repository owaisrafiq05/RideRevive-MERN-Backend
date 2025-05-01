import express from 'express';
import {
  createOrderController,
  getAllOrdersController,
  getOrdersByUserIdController,
  getOrderByIdController
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.post('/create', createOrderController);
router.get('/', getAllOrdersController);
router.get('/user/:userId', getOrdersByUserIdController);
router.get('/:orderId', getOrderByIdController);

export default router; 