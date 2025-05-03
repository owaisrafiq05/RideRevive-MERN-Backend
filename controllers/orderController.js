import Order from '../models/orderModel.js';
import Service from '../models/serviceModel.js';
import { sendOrderApprovedEmail } from '../utils/emailService.js';

// Create a new order
export const createOrderController = async (req, res) => {
  try {
    const {
      userId, 
      carId, 
      services,
      address,
      totalAmount,
      scheduledDate,
      specialInstructions,
      paymentMethod,
      paymentStatus,
      contactName,
      contactPhone,
      isEmergency
    } = req.body;
    
    // Validate that services contain the required fields
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one service is required'
      });
    }

    // Validate each service has the necessary fields
    for (const serviceItem of services) {
      if (!serviceItem.service || !serviceItem.serviceName || !serviceItem.price) {
        return res.status(400).json({
          success: false,
          message: 'Each service must include service ID, name, and price'
        });
      }
    }
    
    // Create new order
    const newOrder = new Order({
      user: userId,
      car: carId,
      services: services.map(service => ({
        service: service.service,
        serviceName: service.serviceName,
        price: service.price,
        serviceDetails: service.serviceDetails || {} // Include service details or empty object
      })),
      address,
      totalAmount,
      scheduledDate: new Date(scheduledDate),
      specialInstructions,
      paymentStatus: paymentStatus || 'paid',
      paymentMethod: paymentMethod || 'credit_card',
      paymentDetails: {
        transactionId: `manual-${Date.now()}`,
        paymentDate: new Date()
      },
      contactName,
      contactPhone,
      isEmergency: isEmergency || false
    });
    
    await newOrder.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    await Service.init();
    
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('car')
      .populate('services.service')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Get orders by user ID
export const getOrdersByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Service.init();
    
    const orders = await Order.find({ user: userId })
      .populate('car')
      .populate('services.service')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user orders',
      error: error.message
    });
  }
};

// Get order by ID
export const getOrderByIdController = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    await Service.init();
    
    const order = await Order.findById(orderId)
      .populate('user', 'name email phone')
      .populate('car')
      .populate('services.service');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Update order status
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'in-progress', 'completed', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    // Get the order with populated user, car, and services data
    const order = await Order.findById(orderId)
      .populate('user', 'name email phone')
      .populate('car')
      .populate('services.service');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Save previous status to check if it changed
    const previousStatus = order.status;
    
    // Update status
    order.status = status;
    await order.save();
    
    // Send email notification if order status changed to approved
    if (status === 'approved' && previousStatus !== 'approved') {
      try {
        // Send the email notification
        await sendOrderApprovedEmail(order);
        console.log(`Email notification sent to ${order.user.email} for order ${order._id}`);
      } catch (emailError) {
        // Log the error but don't fail the API request
        console.error('Failed to send email notification:', emailError);
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Update admin notes
export const updateAdminNotesController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { adminNotes } = req.body;
    
    if (adminNotes === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Admin notes are required'
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { adminNotes },
      { new: true }
    )
    .populate('user', 'name email phone')
    .populate('car')
    .populate('services.service');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Admin notes updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating admin notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin notes',
      error: error.message
    });
  }
}; 