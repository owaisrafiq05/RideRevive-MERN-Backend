import Order from '../models/orderModel.js';
import Service from '../models/serviceModel.js';

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
      paymentStatus
    } = req.body;
    
    // Create new order
    const newOrder = new Order({
      user: userId,
      car: carId,
      services,
      address,
      totalAmount,
      scheduledDate: new Date(scheduledDate),
      specialInstructions,
      paymentStatus: paymentStatus || 'paid',
      paymentMethod: paymentMethod || 'credit_card',
      paymentDetails: {
        transactionId: `manual-${Date.now()}`,
        paymentDate: new Date()
      }
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
      .populate('services.service');
    
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
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update status
    order.status = status;
    await order.save();
    
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
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update admin notes
    order.adminNotes = adminNotes;
    await order.save();
    
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