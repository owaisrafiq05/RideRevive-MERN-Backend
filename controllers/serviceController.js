import Service from '../models/serviceModel.js';

// Create a new service
export const createServiceController = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      basePrice,
      estimatedTime,
      image,
      isActive,
      compatibleVehicleTypes
    } = req.body;
    
    const newService = new Service({
      name,
      description,
      category,
      basePrice,
      estimatedTime,
      image,
      isActive,
      compatibleVehicleTypes
    });
    
    await newService.save();
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// Get all services
export const getAllServicesController = async (req, res) => {
  try {
    const services = await Service.find({});
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
};

// Get service by ID
export const getServiceByIdController = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

// Update service
export const updateServiceController = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updateData = req.body;
    
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// Delete service
export const deleteServiceController = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const deletedService = await Service.findByIdAndDelete(serviceId);
    
    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
}; 