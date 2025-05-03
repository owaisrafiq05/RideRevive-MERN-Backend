# RideRevive MERN Backend

Backend API server for the RideRevive vehicle service app.

## Features

- REST API for RideRevive frontend
- User authentication and authorization
- Order management system
- Car management system
- Service catalog management
- Email notifications for order status updates
- Stripe payment integration

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create environment variables**
   Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/riderevive
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   PORT=3000
   ```

3. **Seed the database with services**
   ```
   npm run seed-services
   ```

4. **Start the server**
   ```
   npm run dev
   ```

## Email Notifications

The system sends email notifications to customers when their orders are approved.
For detailed setup instructions, see [EMAIL_SETUP.md](./EMAIL_SETUP.md).

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:orderId` - Get order by ID
- `GET /api/orders/user/:userId` - Get orders by user ID
- `POST /api/orders/create` - Create a new order
- `PATCH /api/orders/:orderId/status` - Update order status
- `PATCH /api/orders/:orderId/notes` - Update admin notes

### Cars
- `GET /api/cars/user/:userId` - Get cars by user ID
- `POST /api/cars` - Add a new car
- `DELETE /api/cars/:carId` - Delete a car

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:serviceId` - Get service by ID
- `POST /api/services` - Create a new service
- `PUT /api/services/:serviceId` - Update a service
- `DELETE /api/services/:serviceId` - Delete a service

## Scripts

- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon for development
- `npm run seed-services` - Seed the database with default services 