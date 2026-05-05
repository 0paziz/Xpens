# 💎 Xpens Frontend - Modern Finance Tracking

A premium, responsive, and high-performance financial management interface built with **React** and **Vite**. Xpens provides users with a stunning dashboard to visualize their spending and master their budget.

## ✨ Key Features

- **📊 Dynamic Dashboard**: Interactive charts using Recharts for monthly income/expense trends.
- **🛡️ Secure Auth**: Robust registration with password strength indicators and email validation.
- **📄 Smart Transactions**: Full CRUD with client-side pagination for seamless data browsing.
- **💡 Budget Tracking**: Visual progress bars showing budget consumption vs limits.
- **📱 Mobile First**: Fully responsive layout with a slide-in sidebar for smaller screens.
- **🖨️ Professional Reports**: Print-ready financial breakdown views.

## 🚀 Tech Stack

- **React 18**: Component-based UI.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS**: Utility-first styling for a premium look.
- **Recharts**: Data visualization.
- **Axios**: Promised-based API communication.

## 📦 Installation & Setup

1. **Clone & Install**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the `frontend` root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

## 🏗️ Production Build

To generate an optimized production bundle:

```bash
npm run build
```
The output will be in the `dist/` directory, ready to be hosted on Vercel, Netlify, or AWS S3.

## 📁 Project Structure

- `src/components`: Reusable UI components (Layout, Sidebar, Charts).
- `src/pages`: Main application views (Dashboard, Reports, Budget).
- `src/context`: Auth state management.
- `src/api`: Axios instance and API call definitions.

---
Part of the Xpens Ecosystem. Designed for clarity, speed, and financial control.
