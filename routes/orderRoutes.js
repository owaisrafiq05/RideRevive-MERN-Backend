import express from 'express';
import {
  createOrderController,
  getAllOrdersController,
  getOrdersByUserIdController,
  getOrderByIdController,
  updateOrderStatusController,
  updateAdminNotesController
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.post('/create', createOrderController);
router.get('/', getAllOrdersController);
router.get('/user/:userId', getOrdersByUserIdController);
router.get('/:orderId', getOrderByIdController);
router.patch('/:orderId/status', updateOrderStatusController);
router.patch('/:orderId/notes', updateAdminNotesController);

export default router; 