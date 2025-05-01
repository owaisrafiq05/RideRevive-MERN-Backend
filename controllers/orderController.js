import Order from '../models/orderModel.js';

// Create a new order
export const createOrderController = async (req, res) => {
  try {
    const {
      userId, 
      carId, 
      services,
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