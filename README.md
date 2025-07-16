# TechTrend E-Commerce Store

A modern e-commerce platform built with Express.js, MongoDB, and vanilla JavaScript.

## Features

- User authentication (register/login)
- Product catalog with categories
- Shopping cart functionality
- Order processing
- Responsive design
- Admin panel for product management

## Setup Instructions

1. Install Node.js and MongoDB
2. Clone this repository
3. Install dependencies: `npm install`
4. Create `.env` file with your database URL
5. Seed the database: `npm run seed`
6. Start the server: `npm run dev`

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)

### Orders
- POST /api/orders - Create order
- GET /api/orders/my-orders - Get user orders
- GET /api/orders/:id - Get single order
- PUT /api/orders/:id/status - Update order status (admin)

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT tokens
- Frontend: HTML5, CSS3, JavaScript ES6+
- Security: bcrypt for password hashing

## License

MIT License