# TedX-IITPatna Backend API

A comprehensive Node.js backend API for TedX IIT Patna, featuring product management, shopping cart functionality, email services with job queue processing, and admin controls.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Product Management](#product-management)
  - [Shopping Cart](#shopping-cart)
  - [Email Service](#email-service)
  - [Admin Panel](#admin-panel)
- [Mail Service with BullMQ](#mail-service-with-bullmq)
- [Queue Management Dashboard](#queue-management-dashboard)
- [Database Models](#database-models)
- [Common Response Format](#common-response-format)
- [Running the Application](#running-the-application)

---

## Overview

This TedX backend provides a complete e-commerce API with the following features:

- **Product Management**: Browse and manage products (tickets, merchandise)
- **Shopping Cart**: Add, update, remove, and manage cart items
- **Email Services**: Send transactional emails with template support using BullMQ for job queuing
- **Queue Management**: Monitor and manage email jobs via Bull Board UI
- **Admin Controls**: Create, update, and delete products
- **Database**: MongoDB for persistent data storage
- **Queue System**: Redis-backed BullMQ for reliable email delivery

---

## Tech Stack

### Core
- **Node.js** with TypeScript
- **Express.js** - Web framework
- **MongoDB** with Mongoose - Database
- **Redis** - Message queue backend
- **BullMQ** - Job queue library (v5.78.0)
- **Nodemailer** - Email sending service

### Development
- **TypeScript** (v6.0.3) - Type safety
- **Nodemon** - Auto-restart during development
- **tsx** - TypeScript execution
- **ts-node-dev** - TypeScript dev runner

### Monitoring
- **Bull Board** - Queue visualization and management UI

---

## Project Structure

```
TedX/
├── config/
│   └── .env                          # Environment variables
├── controllers/
│   ├── admin.controllers.ts          # Admin operations
│   ├── cart.controllers.ts           # Cart management
│   ├── email_template.controllers.ts # Email template management
│   ├── mail.controllers.ts           # Email sending
│   └── product.controllers.ts        # Product operations
├── database/
│   └── connect.ts                    # MongoDB connection
├── interface/
│   ├── attachment.interface.ts       # Attachment types
│   ├── cart.interface.ts             # Cart types
│   ├── email_template.interface.ts   # Template types
│   ├── mail.interface.ts             # Mail job types
│   └── product.interface.ts          # Product types
├── middleware/
│   └── [middleware files]
├── model/
│   ├── cart.model.ts                 # Cart schema
│   ├── email_template.model.ts       # Template schema
│   ├── mail.model.ts                 # Mail log schema
│   └── product.model.ts              # Product schema
├── routes/
│   ├── admin.routes.ts               # Admin endpoints
│   ├── cart.routes.ts                # Cart endpoints
│   ├── mail.routes.ts                # Email endpoints
│   └── product.routes.ts             # Product endpoints
├── scripts/
│   └── controllerHelpers.ts          # Helper functions
├── services/
│   ├── mail/
│   │   ├── sendMail.ts               # Email sending logic
│   │   └── transport.ts              # Nodemailer transport config
│   └── redis_queue/
│       ├── queue.ts                  # BullMQ queue setup
│       └── worker.ts                 # Queue worker process
├── index.ts                          # Application entry point
├── package.json
└── tsconfig.json
```

---

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- Redis (running locally or Redis Cloud connection string)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vaansh-GitHub/TedX-IITPatna.git
   cd TedX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy and modify the .env file
   cp config/.env.example config/.env
   ```

4. **Start MongoDB and Redis**
   - Ensure MongoDB is running on `mongodb://localhost:27017`
   - Ensure Redis is running on `localhost:6379`

5. **Start the development server**
   ```bash
   npm run dev
   ```

---

## Environment Variables

Create a `.env` file in the `config/` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/tedx
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tedx

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=        # Leave empty if no password

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
MAIL_FROM=noreply@tedxiitpatna.com

# Application
APP_NAME=TedX-IITPatna
APP_URL=http://localhost:3000
```

### Email Setup (Gmail Example)

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password as `SMTP_PASS`

---

## Common Response Format

All API endpoints follow a consistent response format:

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Human readable success message",
  "data": {
    // Response payload
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "message": "Human readable error message",
  "data": null
}
```

---

## API Documentation

### Base URL
```
http://localhost:3000
```

---

## Product Management

### 1. Get All Products

**GET** `/products`

Retrieve all available products.

**Response:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "66b...",
      "name": "TedX T-Shirt",
      "description": "Official TedX merchandise",
      "price": 499,
      "sizes": ["S", "M", "L", "XL"],
      "productType": "MERCH",
      "inStock": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Product by ID

**GET** `/products/:id`

Retrieve a single product by ID.

**Parameters:**
- `id` (path) - MongoDB ObjectId of the product

**Response:**
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "_id": "66b...",
    "name": "TedX T-Shirt",
    "description": "Official TedX merchandise",
    "price": 499,
    "sizes": ["S", "M", "L", "XL"],
    "productType": "MERCH",
    "inStock": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Create Product (Admin)

**POST** `/admin/products`

Create a new product.

**Body:**
```json
{
  "name": "TedX T-Shirt",
  "description": "Official TedX merchandise",
  "price": 499,
  "sizes": ["S", "M", "L", "XL"],
  "productType": "MERCH",
  "inStock": true
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "66b...",
    "name": "TedX T-Shirt",
    "description": "Official TedX merchandise",
    "price": 499,
    "sizes": ["S", "M", "L", "XL"],
    "productType": "MERCH",
    "inStock": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Update Product (Admin)

**PATCH** `/admin/products/:id`

Update an existing product.

**Parameters:**
- `id` (path) - MongoDB ObjectId of the product

**Body:**
```json
{
  "price": 599,
  "inStock": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "66b...",
    "name": "TedX T-Shirt",
    "description": "Official TedX merchandise",
    "price": 599,
    "sizes": ["S", "M", "L", "XL"],
    "productType": "MERCH",
    "inStock": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Delete Product (Admin)

**DELETE** `/admin/products/:id`

Delete a product.

**Parameters:**
- `id` (path) - MongoDB ObjectId of the product

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "deletedCount": 1
  }
}
```

---

## Shopping Cart

### 1. Get Cart

**GET** `/cart/:userId` or **GET** `/cart?userId=...`

Fetch the cart for a specific user. Automatically refreshes prices from the product catalog.

**Parameters:**
- `userId` (path or query) - MongoDB ObjectId of the user

**Response:**
```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": {
    "_id": "66b...",
    "userId": "66b...",
    "items": [
      {
        "productId": "66b...",
        "quantity": 2,
        "selectedSize": "M",
        "priceAtPurchase": 499,
        "productType": "MERCH"
      }
    ],
    "subtotal": 998,
    "total": 998,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Add Item to Cart

**POST** `/cart/add`

Add an item to the user's cart.

**Body:**
```json
{
  "userId": "66b...",
  "productId": "66b...",
  "quantity": 1,
  "selectedSize": "M"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "_id": "66b...",
    "userId": "66b...",
    "items": [
      {
        "productId": "66b...",
        "quantity": 1,
        "selectedSize": "M",
        "priceAtPurchase": 499,
        "productType": "MERCH"
      }
    ],
    "subtotal": 499,
    "total": 499,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Update Cart Item

**PATCH** `/cart/update`

Update quantity or size of an item in the cart.

**Body:**
```json
{
  "userId": "66b...",
  "productId": "66b...",
  "quantity": 2,
  "selectedSize": "L"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "_id": "66b...",
    "userId": "66b...",
    "items": [
      {
        "productId": "66b...",
        "quantity": 2,
        "selectedSize": "L",
        "priceAtPurchase": 499,
        "productType": "MERCH"
      }
    ],
    "subtotal": 998,
    "total": 998,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Remove Item from Cart

**DELETE** `/cart/remove/:productId`

Remove a specific item from the cart.

**Parameters:**
- `productId` (path) - MongoDB ObjectId of the product
- `userId` (query) - MongoDB ObjectId of the user

**Query String:**
```
DELETE /cart/remove/66b...?userId=66b...
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    "_id": "66b...",
    "userId": "66b...",
    "items": [],
    "subtotal": 0,
    "total": 0,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Clear Cart

**DELETE** `/cart/clear`

Clear all items from a user's cart.

**Body:**
```json
{
  "userId": "66b..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "deletedCount": 1
  }
}
```

---

## Email Service

### Mail Service Architecture

The email service uses **BullMQ** for reliable job queue processing and **Nodemailer** for SMTP-based email delivery.

**Key Features:**
- ✅ Asynchronous email processing
- ✅ Automatic retries with exponential backoff (up to 5 attempts)
- ✅ Email template support
- ✅ Attachment handling
- ✅ Mail logging and tracking
- ✅ Web-based queue monitoring (Bull Board)

**Flow:**
1. Client sends email request to `/email` endpoint
2. Email job is created in MongoDB (MailLog)
3. Job is added to Redis queue with retry policy
4. Worker picks up job and sends email via Nodemailer
5. Status is updated (sent/failed) in database

---

### 1. Send Email

**POST** `/email`

Queue an email for sending.

**Body:**
```json
{
  "recipientEmail": "user@example.com",
  "recipientName": "John Doe",
  "templateName": "welcome",
  "subject": "Welcome to TedX",
  "variables": {
    "name": "John Doe",
    "verificationUrl": "https://example.com/verify"
  },
  "attachments": [
    {
      "filename": "document.pdf",
      "url": "https://example.com/path/to/document.pdf",
      "mimeType": "application/pdf"
    }
  ],
  "metadata": {
    "userId": "66b...",
    "type": "welcome_email"
  }
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Email job enqueued successfully",
  "data": {
    "jobId": "1"
  }
}
```

**Response Fields:**
- `jobId` - Unique identifier for tracking this email job in the queue

---

### Email Template Management

#### 2. Create Email Template

**POST** `/email/template`

Create a new email template.

**Body:**
```json
{
  "name": "welcome",
  "subject": "Welcome to TedX-IITPatna",
  "htmlBody": "<html><body><h1>Welcome {{name}}</h1><p>Thank you for joining TedX!</p></body></html>",
  "isActive": true
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Email template created successfully",
  "data": {
    "_id": "66b...",
    "name": "welcome",
    "subject": "Welcome to TedX-IITPatna",
    "htmlBody": "<html><body><h1>Welcome</h1>...</body></html>",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### 3. Update Email Template

**POST** `/email/template/:id`

Update an existing email template.

**Parameters:**
- `id` (path) - Template name (identifier)

**Body:**
```json
{
  "subject": "Updated Welcome Subject",
  "htmlBody": "<html><body><h1>Welcome {{name}}!</h1></body></html>",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email template updated successfully",
  "data": {
    "_id": "66b...",
    "name": "welcome",
    "subject": "Updated Welcome Subject",
    "htmlBody": "<html><body><h1>Welcome {{name}}!</h1></body></html>",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### 4. Delete Email Template

**DELETE** `/email/template`

Delete an email template.

**Body:**
```json
{
  "name": "welcome"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email template deleted successfully",
  "data": {
    "deletedCount": 1
  }
}
```

---

## Queue Management Dashboard

### Access Bull Board UI

**URL:** `http://localhost:3000/admin/queues`

The Bull Board interface provides:
- 📊 Real-time queue statistics
- 📧 Email job status tracking
- 🔄 Retry failed jobs
- ⏸️ Pause/Resume queue processing
- 📝 Detailed job logs and error messages
- 🗑️ Clean up completed jobs

### Job Statuses

- **waiting**: Job queued, waiting to be processed
- **active**: Currently being processed by worker
- **completed**: Email sent successfully
- **failed**: Email delivery failed (may retry)
- **delayed**: Retrying after backoff delay

---

## Database Models

### Product Model

```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  sizes: string[],
  productType: "MERCH" | "TICKET",
  inStock: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

### Cart Model

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  items: CartItem[],
  subtotal: number,
  total: number,
  status: "PENDING" | "ORDERED",
  createdAt: Date,
  updatedAt: Date
}
```

### CartItem

```typescript
{
  productId: ObjectId,
  quantity: number,
  selectedSize: string,
  priceAtPurchase: number,
  productType: "MERCH" | "TICKET"
}
```

---

### Email Template Model

```typescript
{
  _id: ObjectId,
  name: string,
  subject: string,
  htmlBody: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

### Mail Log Model

```typescript
{
  _id: ObjectId,
  recipientEmail: string,
  subject: string,
  templateName: string,
  status: "queued" | "processing" | "sent" | "failed",
  retryCount: number,
  providerMessageId: string,
  errorMessage: string,
  metadata: Record<string, any>,
  sentAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

Starts the Express server with auto-reload on file changes.

### Start Queue Worker

In a separate terminal, start the BullMQ worker to process email jobs:

```bash
npm run worker
```

This worker:
- Listens to the Redis queue
- Processes email jobs using Nodemailer
- Handles retries automatically
- Updates job status in the database

### Production Build

```bash
npm run build
npm start
```

### Scripts Available

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run worker` | Start BullMQ worker process |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run compiled production build |

---

## Development Notes

### Key Implementation Details

1. **Email Queue Processing**
   - Uses BullMQ for reliable job queuing
   - Redis stores job state and retry information
   - Automatic exponential backoff: 5s, 25s, 125s, etc.
   - Maximum 5 retry attempts per email

2. **Cart Management**
   - Prices are refreshed from product catalog on fetch
   - Cart status tracks PENDING vs ORDERED state
   - Automatic total calculation

3. **Admin Controls**
   - CRUD operations for products
   - No authentication middleware (add as needed)

4. **Response Handling**
   - Consistent error and success responses
   - Helper functions: `sendSuccess()`, `sendError()`

### Common Issues

**Queue Jobs Not Processing:**
- Ensure Redis is running: `redis-cli ping`
- Start worker: `npm run worker`
- Check Redis connection in `.env`

**Emails Not Sending:**
- Verify SMTP credentials in `.env`
- Check email provider allows SMTP access
- Review error logs in Bull Board UI

**MongoDB Connection:**
- Ensure MongoDB is running
- Verify connection string in `.env`
- Check network access if using MongoDB Atlas

---

## License

ISC

---

## Author

Devaansh

---

## Frontend Contract

### Cart Endpoints

- Frontend should always send valid MongoDB ObjectId values for `userId`
- Cart fetch endpoint automatically refreshes `priceAtPurchase` from current product prices
- If a cart is not `PENDING`, it will be deleted and a non-success response will be returned

### Email Service

- Email jobs are processed asynchronously
- Use the `jobId` from response to track email status in Bull Board
- Mail logs are persisted in database for audit trails
- Failed emails automatically retry up to 5 times

---

Last Updated: January 2024
		"userId": "...",
		"items": [
			{
				"productId": "...",
				"quantity": 2,
				"selectedSize": "M",
				"priceAtPurchase": 499,
				"productType": "MERCH"
			}
		],
		"subtotal": 998,
		"total": 998,
		"status": "PENDING"
	}
}
```

#### Non-Pending Cart Response

If the cart status is not `PENDING`, the backend deletes the cart and returns:

```json
{
	"success": false,
	"message": "Cart is not pending and was removed",
	"data": null
}
```

#### Common Errors

```json
{
	"success": false,
	"message": "Invalid or missing User ID"
}
```

```json
{
	"success": false,
	"message": "Cart not found"
}
```

### 2. Add Item To Cart

`POST /cart/add`

#### Frontend Sends

```json
{
	"userId": "66b...",
	"productId": "product-slug",
	"quantity": 2,
	"productType": "MERCH",
	"selectedSize": "M"
}
```

#### Required Fields

- `userId`
- `productId` as product slug
- `quantity`
- `productType`
- `selectedSize` for `MERCH` products

#### Successful Response

```json
{
	"success": true,
	"message": "Item added to cart successfully",
	"data": {
		"_id": "...",
		"userId": "...",
		"items": [],
		"subtotal": 0,
		"total": 0,
		"status": "PENDING"
	}
}
```

If a new cart is created, the message is:

```json
{
	"success": true,
	"message": "Cart created successfully",
	"data": {
		"_id": "...",
		"userId": "...",
		"items": [],
		"subtotal": 0,
		"total": 0,
		"status": "PENDING"
	}
}
```

### 3. Update Item Quantity

`PATCH /cart/update`

#### Frontend Sends

```json
{
	"userId": "66b...",
	"productId": "product-slug",
	"quantity": 3
}
```

#### Successful Response

```json
{
	"success": true,
	"message": "Cart item updated successfully",
	"data": {
		"_id": "...",
		"userId": "...",
		"items": [],
		"subtotal": 0,
		"total": 0,
		"status": "PENDING"
	}
}
```

### 4. Remove One Item

`DELETE /cart/remove/:productId`

#### Frontend Sends

Request params:

```json
{
	"productId": "product-slug"
}
```

Request body:

```json
{
	"userId": "66b..."
}
```

#### Successful Response

```json
{
	"success": true,
	"message": "Cart item removed successfully",
	"data": {
		"_id": "...",
		"userId": "...",
		"items": [],
		"subtotal": 0,
		"total": 0,
		"status": "PENDING"
	}
}
```

### 5. Clear Entire Cart

`DELETE /cart/clear`

#### Frontend Sends

```json
{
	"userId": "66b..."
}
```

#### Successful Response

```json
{
	"success": true,
	"message": "Cart cleared successfully",
	"data": {
		"deletedCount": 1
	}
}
```

## Product API

All product routes are mounted under `/products`.

### Common Response Shape

```json
{
	"success": true,
	"message": "Products fetched successfully",
	"data": []
}
```

### 1. Get All Products

`GET /products`

#### Frontend Sends

No body required.

#### Successful Response

```json
{
	"success": true,
	"message": "Products fetched successfully",
	"data": [
		{
			"_id": "...",
			"name": "Merch Name",
			"slug": "merch-name",
			"price": 499,
			"type": "MERCH"
		}
	]
}
```

### 2. Get Product By Slug

`GET /products/:id`

#### Frontend Sends

Path param:

```json
{
	"id": "product-slug"
}
```

#### Successful Response

```json
{
	"success": true,
	"message": "Product fetched successfully",
	"data": {
		"_id": "...",
		"name": "Merch Name",
		"slug": "merch-name",
		"price": 499,
		"type": "MERCH"
	}
}
```

## Admin Product API

All admin product routes are mounted under `/admin/products`.

### 1. Create Product

`POST /admin/products`

#### Frontend Sends

```json
{
	"name": "Merch Name",
	"slug": "merch-name",
	"type": "MERCH",
	"price": 499,
	"stock": 10,
	"sizes": "S,M,L",
	"images": "https://example.com/a.jpg,https://example.com/b.jpg"
}
```

`sizes` and `images` may be sent either as comma-separated strings or arrays.

#### Successful Response

```json
{
	"success": true,
	"message": "Product created successfully",
	"data": {
		"_id": "...",
		"name": "Merch Name",
		"slug": "merch-name",
		"type": "MERCH",
		"price": 499,
		"stock": 10
	}
}
```

### 2. Update Product

`PATCH /admin/products/:id`

#### Frontend Sends

```json
{
	"price": 599,
	"stock": 12,
	"images": "https://example.com/c.jpg"
}
```

#### Successful Response

```json
{
	"success": true,
	"message": "Product updated successfully",
	"data": {
		"_id": "...",
		"slug": "merch-name",
		"price": 599,
		"stock": 12
	}
}
```

### 3. Delete Product

`DELETE /admin/products/:id`

#### Frontend Sends

Path param:

```json
{
	"id": "product-slug"
}
```

#### Successful Response

```json
{
	"success": true,
	"message": "Product deleted successfully",
	"data": {
		"deletedCount": 1
	}
}
```

## Notes for Frontend Implementation

- Use `GET /cart/:userId` as the primary fetch route.
- Treat `priceAtPurchase` as the final saved product price for that cart snapshot.
- After every cart mutation, re-fetch the cart so the UI displays the saved totals from the backend.
- Keep request bodies strictly numeric where `quantity` is expected.
- Expect `409` when a cart exists but is no longer pending.

## Validation Status

The cart controller and route files have been aligned with the current TypeScript build and response shape conventions.
