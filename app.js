import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from './routes/userRoutes.js';


dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});