# 🛒 E-Commerce Backend API

A robust and scalable Node.js backend API for e-commerce applications with authentication, product management, cart functionality, payment processing, and analytics.

## ✨ Features

- **🔐 Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Customer/Admin)
  - Password encryption with bcrypt

- **📦 Product Management**
  - CRUD operations for products
  - Product categorization
  - Featured products
  - Product recommendations
  - Image upload with Cloudinary

- **🛍️ Shopping Cart**
  - Add/remove items from cart
  - Update quantities
  - Cart persistence

- **🎫 Coupon System**
  - Create and manage discount coupons
  - Apply coupons to orders

- **💳 Payment Processing**
  - Stripe integration for secure payments
  - Order processing

- **📊 Analytics**
  - Sales analytics
  - User behavior tracking
  - Performance metrics

- **⚡ Performance & Caching**
  - Redis caching for improved performance
  - Database optimization

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Payment**: Stripe
- **Caching**: Redis
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB
- Redis (optional, for caching)
- npm or yarn

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <https://github.com/Sgrpokhriyal2003/E-Commerce-Backend-API>
   cd e-commerce-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3001
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRE=30d
 
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key

   
   # Redis Configuration (optional) use docker 
   REDIS_URL=your_redis_connection_string
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **For production**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| POST | `/signin` | User login | No |
| POST | `/signout` | User logout | Yes |
| POST | `/refresh-token` | Refresh access token | No |
| GET | `/profile` | Get user profile | Yes |

### Product Routes (`/api/product`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/` | Get all products | Yes | Yes |
| GET | `/featured` | Get featured products | No | No |
| GET | `/category/:category` | Get products by category | No | No |
| GET | `/recommendation` | Get recommended products | No | No |
| POST | `/` | Create new product | Yes | Yes |
| PATCH | `/:id` | Toggle product feature | Yes | Yes |
| DELETE | `/:id` | Delete product | Yes | Yes |

### Cart Routes (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user cart | Yes |
| POST | `/add` | Add item to cart | Yes |
| PUT | `/update/:id` | Update cart item quantity | Yes |
| DELETE | `/remove/:id` | Remove item from cart | Yes |
| DELETE | `/clear` | Clear entire cart | Yes |

### Coupon Routes (`/api/coupon`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/` | Get all coupons | Yes | Yes |
| POST | `/` | Create new coupon | Yes | Yes |
| PUT | `/:id` | Update coupon | Yes | Yes |
| DELETE | `/:id` | Delete coupon | Yes | Yes |
| POST | `/apply` | Apply coupon to cart | Yes | No |

### Payment Routes (`/api/payment`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create-payment-intent` | Create payment intent | Yes |
| POST | `/confirm-payment` | Confirm payment | Yes |
| GET | `/orders` | Get user orders | Yes |

### Analytics Routes (`/api/analytic`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/sales` | Get sales analytics | Yes | Yes |
| GET | `/users` | Get user analytics | Yes | Yes |
| GET | `/products` | Get product analytics | Yes | Yes |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **Customer**: Can browse products, manage cart, make purchases
- **Admin**: Full access to all features including product management and analytics
