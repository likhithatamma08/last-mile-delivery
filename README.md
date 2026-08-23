# Last Mile Delivery Management System

## Project Overview

The Last Mile Delivery Management System is a web-based platform designed to manage and track delivery operations through a single system. Customers can create delivery orders by entering pickup and delivery details, package information, weight, dimensions, order type, and payment type. The system calculates delivery charges based on factors such as package weight, delivery zone, and applicable rate cards.

Admins can manage customers, delivery agents, orders, zones, areas, and pricing. Delivery agents can view assigned deliveries and update their delivery status throughout the delivery process. The system also provides authentication, role-based access control, order tracking, notifications, and an administrative dashboard.

## Features

* User registration and login
* JWT-based authentication
* Role-based access control
* Customer order creation
* Automatic delivery charge calculation
* Zone and area management
* Rate card management
* Delivery agent assignment
* Delivery status tracking
* Order management
* Notifications
* Admin dashboard
* Customer management
* Delivery agent management

## User Roles

### Admin

* Manage customers
* Manage delivery agents
* Manage orders
* Manage zones
* Manage areas
* Manage rate cards
* View dashboard statistics
* Monitor delivery operations

### Customer

* Create delivery orders
* View orders
* Track order status
* Receive notifications

### Delivery Agent

* View assigned deliveries
* View customer and delivery details
* Update delivery status
* Complete deliveries

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

### Database

* MongoDB Atlas

## Project Structure

```text
last-mile-delivery/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── createAdmin.js
│   ├── createDeliveryAgent.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

## Main Modules

* Authentication and Authorization
* User Management
* Order Management
* Zone Management
* Area Management
* Rate Card Management
* Delivery Agent Management
* Delivery Tracking
* Notifications
* Admin Dashboard

## Running the Project Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the Vite development server.

## Environment Variables

The backend requires environment variables for MongoDB and authentication.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` files or database credentials to GitHub.

## Delivery Status Flow

```text
PLACED
   ↓
ASSIGNED
   ↓
PICKED_UP
   ↓
IN_TRANSIT
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

## Future Improvements

* Real-time GPS delivery tracking
* Google Maps integration
* Email/SMS notifications
* Advanced analytics
* Online payment integration
* Route optimization
* Mobile application for delivery agents
* Deployment with CI/CD

## Project Purpose

The system demonstrates a full-stack delivery management workflow with a React frontend, RESTful backend APIs, MongoDB database, authentication, authorization, pricing management, order tracking, and role-based functionality.
