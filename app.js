import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from './routes/userRoutes.js';
import carRoutes from './routes/carRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

// Import all models to ensure they are registered with Mongoose
import './models/userModel.js';
import './models/carModel.js';
import './models/orderModel.js';
import './models/serviceModel.js';

dotenv.config();

const app = express();
const port = 3000;

// Standard middleware for parsing JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});