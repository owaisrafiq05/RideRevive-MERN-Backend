import Car from '../models/carModel.js';

// Add a new car
export const addCarController = async (req, res) => {
    try {
        const { user, make, model, year, licensePlate, color, fuelType, transmission, mileage, vin } = req.body;

        const newCar = new Car({
            user,
            make,
            model,
            year,
            licensePlate,
            color,
            fuelType,
            transmission,
            mileage,
            vin
        });

        const savedCar = await newCar.save();
        res.status(201).json({
            message: "Car added successfully!",
            status: true,
            data: savedCar
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: false,
            data: []
        });
    }
};

// Get all cars
export const getAllCarsController = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json({
            message: "Cars retrieved successfully!",
            status: true,
            data: cars
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: false,
            data: []
        });
    }
};

// Get car by ID
export const getCarByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findById(id);

        if (!car) {
            return res.status(404).json({
                message: "Car not found!",
                status: false,
                data: []
            });
        }

        res.status(200).json({
            message: "Car retrieved successfully!",
            status: true,
            data: car
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: false,
            data: []
        });
    }
};

// Get cars by user ID
export const getCarsByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters
        const cars = await Car.find({ user: userId }); // Find cars associated with the user ID

        if (cars.length === 0) {
            return res.status(404).json({
                message: "No cars found for this user!",
                status: false,
                data: []
            });
        }

        res.status(200).json({
            message: "Cars retrieved successfully!",
            status: true,
            data: cars
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: false,
            data: []
        });
    }
};

// Remove a car by ID
export const removeCarController = async (req, res) => {
    try {
        const { id } = req.params; // Get car ID from request parameters
        const deletedCar = await Car.findByIdAndDelete(id); // Delete the car

        if (!deletedCar) {
            return res.status(404).json({
                message: "Car not found!",
                status: false,
                data: []
            });
        }

        res.status(200).json({
            message: "Car deleted successfully!",
            status: true,
            data: deletedCar
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: false,
            data: []
        });
    }
};
