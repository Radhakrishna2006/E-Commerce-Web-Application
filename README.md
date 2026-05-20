# E-Commerce Web Application

A full-stack online store built with **HTML**, **CSS**, **Express.js**, and **MongoDB**. Includes product catalog, shopping cart, checkout, user authentication with role-based access, and an admin dashboard.

## Features

- **Product catalog** — Browse, search, and filter products
- **Shopping cart** — Add items, adjust quantities (stored in browser)
- **Checkout** — Place orders with shipping address (requires login)
- **User accounts** — Register and login as a customer
- **Role-based access** — `user` (shop & track own orders) vs `admin` (manage products & all orders)
- **REST APIs** — Products and orders CRUD with JWT authentication
- **MongoDB** — Persistent storage for users, products, and orders

## Project structure

```
E-Commerce-Web-Application/
├── backend/          # Express API + MongoDB
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── seed.js
└── frontend/         # HTML, CSS, vanilla JS
    ├── css/
    ├── js/
    └── *.html
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally (or MongoDB Atlas URI)

## Setup

1. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**

   ```bash
   copy .env.example .env
   ```

   Edit `.env` and set `JWT_SECRET` and `MONGODB_URI` if needed.

3. **Seed database** (admin user + sample products)

   ```bash
   npm run seed
   ```

   Default admin: `admin@store.com` / `admin123`

4. **Start the server**

   ```bash
   npm start
   ```

   Open **http://localhost:5000** in your browser.

## API overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create user account |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Auth | Current user profile |
| GET | `/api/products` | Public | List products |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/orders` | Auth | Place order |
| GET | `/api/orders/my` | Auth | User's orders |
| GET | `/api/orders` | Admin | All orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

Send JWT in header: `Authorization: Bearer <token>`

## User flows

1. **Customer** — Register → browse catalog → add to cart → login → checkout → view orders on **My Orders**
2. **Admin** — Login with admin credentials → **Admin** tab to add/edit/delete products and update order statuses

## Tech stack

- Frontend: HTML5, CSS3, JavaScript (no framework)
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: bcrypt + JSON Web Tokens
