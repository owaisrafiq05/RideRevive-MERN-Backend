import express from 'express';
import {
  createServiceController,
  getAllServicesController,
  getServiceByIdController,
  updateServiceController,
  deleteServiceController
} from '../controllers/serviceController.js';

const router = express.Router();

// Service routes
router.post('/', createServiceController);
router.get('/', getAllServicesController);
router.get('/:serviceId', getServiceByIdController);
router.put('/:serviceId', updateServiceController);
router.delete('/:serviceId', deleteServiceController);

export default router; 