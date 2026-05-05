# 🚀 Xpens Backend - Production Ready API

The robust backend power behind **Xpens**, providing secure authentication, real-time financial data processing, and budget management. Built with the MERN stack for high performance and scalability.

## 🛠️ Technology Stack

- **Node.js & Express**: Core server logic.
- **MongoDB & Mongoose**: NoSQL data storage with schema validation.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Bcrypt**: Industrial-grade password hashing.
- **CORS**: Configured for secure cross-origin resource sharing.

## 📁 Project Architecture

```text
backend/
├── api/              # Main entry points (Server & Vercel)
├── auth/             # Authentication middleware
├── controller/       # Business logic (User, Transactions, Budgets)
├── models/           # Mongoose schemas & data constraints
└── route/            # Express router definitions
```

## 📡 API Documentation (Base URL: `/api`)

### Authentication (`/user`)
- `POST /user/register` - Create account (with email/password validation).
- `POST /user/login` - Authenticate & receive JWT.
- `GET /user/profile` - Retrieve authenticated user data.
- `PUT /user/update-profile` - Update name/password.

### Transactions (`/transactions`)
- `GET /transactions/` - Fetch all user transactions (supports frontend pagination).
- `POST /transactions/create` - Add income or expense.
- `PUT /transactions/:id` - Edit existing transaction.
- `DELETE /transactions/:id` - Remove a transaction.
- `GET /transactions/summary` - Aggregate financial reports & category totals.

### Budgets (`/budgets`)
- `GET /budgets/` - Fetch all active budget limits.
- `POST /budgets/create` - Set a new category budget.
- `PUT /budgets/update` - Modify existing limits.
- `DELETE /budgets/delete` - Remove a budget setting.

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_high_entropy_secret_key
FRONTEND_URL=http://localhost:5173
```

## 🚀 Production Deployment

### 1. Database
Use **MongoDB Atlas** for a managed production database. Ensure the IP whitelist includes your production server.

### 2. Deployment (Vercel/Heroku/DigitalOcean)
- **Vercel**: The project is pre-configured for Vercel with `api/index.js` as the entry point.
- **Manual**: Run `node api/index.js` or use a process manager like **PM2**:
  ```bash
  pm2 start api/index.js --name xpens-api
  ```

---
Built as part of the Xpens Final Year Project.
