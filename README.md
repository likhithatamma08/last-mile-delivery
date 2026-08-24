# Last Mile Delivery Management System

A full-stack delivery management platform built to manage customers, orders, delivery agents, zones, pricing, authentication, and delivery tracking.

## Project Overview

The **Last Mile Delivery Management System** is designed to simplify logistics operations by providing a centralized platform for managing the complete delivery workflow.

Customers can register, log in, and create delivery orders by providing pickup and drop addresses, package details, weight, order type, and payment type. The system supports automatic delivery charge calculation based on package weight, delivery zones, rate cards, and COD charges.

Administrators can manage customers, delivery agents, zones, areas, rate cards, and orders. Delivery agents can view their assigned deliveries and update delivery status throughout the delivery lifecycle.

The application follows a role-based architecture with separate functionality for:

* Admin
* Customer
* Delivery Agent

The project is implemented using a **React.js frontend, Node.js/Express backend, MongoDB database, JWT authentication, and REST APIs**.

## Key Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Password hashing using bcrypt
* Role-based access control
* Protected frontend routes
* Protected backend APIs
* Separate permissions for Admin, Customer, and Delivery Agent

### Customer Features

* Customer registration
* Customer login
* Create delivery orders
* Enter pickup and delivery addresses
* Enter package information
* Specify package weight and dimensions
* Select B2B/B2C order type
* Select Prepaid/COD payment type
* View created orders
* Track order status
* View delivery information
* Receive order notifications

### Admin Features

* Admin dashboard
* Manage customers
* Manage delivery agents
* Manage orders
* Manage zones
* Manage areas
* Manage rate cards
* Assign delivery agents
* View delivery operations
* Monitor order status

### Delivery Agent Features

* Delivery agent login
* View assigned deliveries
* View delivery details
* Update delivery status
* Complete deliveries

## Order Information

Each order can contain:

* Pickup address
* Delivery/drop address
* Package description
* Package dimensions

  * Length
  * Breadth
  * Height
* Actual package weight
* Order type

  * B2B
  * B2C
* Payment type

  * Prepaid
  * COD
* Delivery zone
* Delivery charge
* Assigned delivery agent
* Current order status
* Tracking history

## Rate Calculation Logic

The system is designed to calculate delivery charges using configurable delivery zones and rate cards.

### Volumetric Weight

Volumetric weight is calculated using:

```text
Volumetric Weight = (Length × Breadth × Height) / 5000
```

The system compares:

```text
Actual Weight
        vs
Volumetric Weight
```

The higher value is used as the **billable weight**.

### Rate Card

The applicable rate is determined based on:

* Pickup zone
* Delivery zone
* Order type

  * B2B
  * B2C
* Billable weight

The system supports separate rate configurations for different delivery zones and order types.

### COD Surcharge

For COD orders, an additional COD surcharge can be applied based on the configured rate card.

The general calculation flow is:

```text
Pickup Address
      ↓
Pickup Zone
      ↓
Delivery Address
      ↓
Delivery Zone
      ↓
Calculate Volumetric Weight
      ↓
Compare Actual vs Volumetric Weight
      ↓
Determine Billable Weight
      ↓
Find Applicable Rate Card
      ↓
Apply B2B/B2C Rate
      ↓
Apply COD Surcharge if applicable
      ↓
Final Delivery Charge
```

The pricing configuration is stored in the database rather than being hardcoded into the frontend.

## Order Status Lifecycle

Orders progress through a defined delivery lifecycle:

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

A failed delivery can also be recorded:

```text
OUT_FOR_DELIVERY
        ↓
      FAILED
```

Each status update can be associated with the delivery process and tracking information.

## Notifications

The system includes a notification module for communicating order-related updates to customers.

Notifications can be generated when important delivery events occur, such as:

* Order placement
* Agent assignment
* Pickup
* In Transit
* Out for Delivery
* Delivered
* Failed delivery

## Database Design

MongoDB Atlas is used as the database.

The application uses separate collections/models for the major entities:

```text
User
Zone
Area
RateCard
Order
TrackingHistory
Notification
```

### User

Stores authentication and role information for:

* Customers
* Delivery Agents
* Admins

### Zone

Stores delivery zones used for determining applicable delivery rates.

### Area

Maps individual delivery areas to their corresponding zones.

### RateCard

Stores configurable delivery pricing based on:

* Zone
* Order type
* Weight
* Applicable charges
* COD surcharge

### Order

Stores complete order information including:

* Customer
* Addresses
* Package details
* Weight
* Order type
* Payment type
* Delivery charge
* Assigned agent
* Current status

### TrackingHistory

Stores delivery status changes and tracking information.

### Notification

Stores customer-facing delivery notifications.

## Project Architecture

```text
                    ┌───────────────────┐
                    │   React Frontend  │
                    │      Vite         │
                    └─────────┬─────────┘
                              │
                              │ REST API
                              ↓
                    ┌───────────────────┐
                    │ Node.js + Express │
                    │     Backend       │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
        Authentication    Business Logic    APIs
              │               │               │
              └───────────────┼───────────────┘
                              ↓
                    ┌───────────────────┐
                    │    MongoDB Atlas  │
                    └───────────────────┘
```

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* JavaScript
* HTML
* CSS
* Vite

### Backend

* Node.js
* Express.js
* REST API
* JWT
* bcryptjs
* Mongoose
* CORS
* dotenv

### Database

* MongoDB
* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

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
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── CreateOrder.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── DeliveryAgents.jsx
│   │   │   ├── DeliveryOrders.jsx
│   │   │   ├── Zones.jsx
│   │   │   ├── Areas.jsx
│   │   │   ├── RateCards.jsx
│   │   │   └── Notifications.jsx
│   │   │
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

## API Modules

The backend follows a modular REST API structure.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Zones

```text
POST /api/zones
GET  /api/zones
```

Additional API endpoints are organized according to the application's controllers and routes.

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/likhithatamma08/last-mile-delivery.git
cd last-mile-delivery
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run using the Vite development server.

## Environment Variables

Backend environment variables include:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

For deployment, environment variables are configured through the hosting platform.

**Do not commit `.env` files or database credentials to GitHub.**

## Deployment

The frontend is deployed using Vercel and the backend is deployed separately as a web service.

Production frontend:

**https://last-mile-delivery-nine.vercel.app/**

MongoDB Atlas is used as the production database.

The frontend communicates with the deployed backend through the configured API base URL.

## What Was Implemented

The project was developed as a complete full-stack delivery management prototype covering the major workflow requested for the Last-Mile Delivery Tracker.

Implemented components include:

* React-based frontend
* Node.js/Express backend
* MongoDB Atlas database
* JWT authentication
* Password hashing
* Role-based authorization
* Customer registration and login
* Admin functionality
* Delivery agent functionality
* Order creation
* Order management
* Delivery agent assignment
* Zone management
* Area management
* Rate card management
* Delivery charge calculation
* Volumetric weight calculation
* B2B/B2C order handling
* Prepaid/COD payment handling
* COD surcharge support
* Order status management
* Delivery tracking history
* Notification module
* Protected frontend routes
* REST API architecture
* Production deployment

## System Workflow

```text
User Registration/Login
          ↓
      Authentication
          ↓
       Create Order
          ↓
   Enter Package Details
          ↓
    Determine Zones
          ↓
 Calculate Billable Weight
          ↓
   Find Applicable Rate
          ↓
 Calculate Delivery Charge
          ↓
      Create Order
          ↓
 Assign Delivery Agent
          ↓
   Update Delivery Status
          ↓
     Track Order
          ↓
       Delivered
```

## Future Enhancements

The following features can be extended in future versions:

* GPS-based nearest-agent assignment
* Real-time location tracking
* Google Maps integration
* Automatic agent availability detection
* Failed delivery rescheduling workflow
* Automatic agent reassignment after rescheduling
* Email notifications for every status change
* SMS notification integration
* Advanced order filtering and analytics
* Route optimization
* Online payment integration
* Mobile application for delivery agents
* CI/CD automation

## Project Purpose

This project demonstrates the design and development of a full-stack logistics management system covering:

* Authentication and authorization
* REST API development
* Database design
* Delivery pricing logic
* Order lifecycle management
* Role-based access control
* Delivery tracking
* Notification management
* Frontend-backend integration
* Cloud deployment

The project provides a foundation for a production-oriented last-mile delivery management platform while allowing additional logistics automation and integrations to be added in future iterations.
