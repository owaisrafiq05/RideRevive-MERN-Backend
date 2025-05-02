import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/serviceModel.js';

// Load environment variables
dotenv.config();

// Default services data
const defaultServices = [
  {
    name: 'Fuel Delivery',
    description: 'Emergency fuel delivery service for vehicles that have run out of gas.',
    category: 'other',
    basePrice: 30.00,
    estimatedTime: {
      value: 30,
      unit: 'minutes'
    },
    image: 'fuel-delivery.jpg',
    isActive: true,
    compatibleVehicleTypes: ['sedan', 'suv', 'truck', 'van', 'hatchback', 'convertible', 'other']
  },
  {
    name: 'Car Washing',
    description: 'Professional car washing and detailing service.',
    category: 'cleaning',
    basePrice: 25.00,
    estimatedTime: {
      value: 1,
      unit: 'hours'
    },
    image: 'car-washing.jpg',
    isActive: true,
    compatibleVehicleTypes: ['sedan', 'suv', 'truck', 'van', 'hatchback', 'convertible']
  },
  {
    name: 'Tire Services',
    description: 'Tire repair, replacement, and maintenance services.',
    category: 'maintenance',
    basePrice: 40.00,
    estimatedTime: {
      value: 45,
      unit: 'minutes'
    },
    image: 'tire-services.jpg',
    isActive: true,
    compatibleVehicleTypes: ['sedan', 'suv', 'truck', 'van', 'hatchback', 'convertible', 'other']
  },
  {
    name: 'Battery Replacement',
    description: 'Emergency battery replacement service for vehicles with dead batteries.',
    category: 'repair',
    basePrice: 55.00,
    estimatedTime: {
      value: 30,
      unit: 'minutes'
    },
    image: 'battery-replacement.jpg',
    isActive: true,
    compatibleVehicleTypes: ['sedan', 'suv', 'truck', 'van', 'hatchback', 'convertible', 'other']
  },
  {
    name: 'Emergency Rescue',
    description: 'Emergency roadside assistance for breakdowns and accidents.',
    category: 'other',
    basePrice: 75.00,
    estimatedTime: {
      value: 1,
      unit: 'hours'
    },
    image: 'emergency-rescue.jpg',
    isActive: true,
    compatibleVehicleTypes: ['sedan', 'suv', 'truck', 'van', 'hatchback', 'convertible', 'other']
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');
    
    // Insert default services
    const createdServices = await Service.insertMany(defaultServices);
    console.log(`Added ${createdServices.length} services to the database`);
    
    // Log the IDs for reference
    console.log('Service IDs for reference:');
    createdServices.forEach(service => {
      console.log(`${service.name}: ${service._id}`);
    });
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 