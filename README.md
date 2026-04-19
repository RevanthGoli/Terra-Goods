# Terra Goods — Full-Stack E-Commerce

A full-stack e-commerce app built with **React** (frontend) and **Flask** (backend).

---

## Project Structure

```
├── backend/
│   ├── app.py           # Flask API
│   └── requirements.txt
└── frontend/
    └── src/
        └── App.jsx      # React app 
```

---

## Backend Setup (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Flask runs on **---**

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/products | List products (filter/sort/search) |
| GET | /api/products/:id | Single product |
| GET | /api/categories | All categories |
| GET | /api/cart | View cart |
| POST | /api/cart | Add to cart |
| PUT | /api/cart/:id | Update qty |
| DELETE | /api/cart/:id | Remove item |
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Current user |
| POST | /api/orders | Place order |
| GET | /api/orders | User orders |

---

## Frontend Setup (React)

```bash
# Create a new Vite project
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

Replace `src/App.jsx` with the provided file, then:

```bash
npm run dev
```

React runs on **-----**

---

## Features

- 🛍 Product catalog with search, filter by category, sort
- 🛒 Persistent cart (session-based)
- 🔐 User registration & login
- 📦 Order placement & order history
- 🏠 Hero landing page, About page
- 🎨 Elegant earth-tone design with smooth animations
- 📱 Responsive layout

---

## Notes

- Data is in-memory (resets on server restart). Add SQLite/PostgreSQL for persistence.
- Change `app.secret_key` in production.
- The React app falls back to static product data if the backend is offline.

-------------------------------------------------------------

💳 Payment Integration Guide
Overview
I've added a complete payment processing system to your e-commerce website with support for multiple payment methods and secure checkout.

✨ Features
Payment Methods
✅ Credit Card - Full card form with validation
✅ PayPal - Redirect to PayPal
✅ Apple Pay - One-click payment
✅ Google Pay - Mobile wallet

Checkout Features
✅ Shipping Form - Full address collection
✅ Order Summary - Cart review with totals
✅ Real-time Calculation - Tax & totals auto-calculated
✅ Security Badges - Trust indicators
✅ Input Validation - Card format checking
✅ Order Confirmation - Receipt generation

Security
✅ Form Validation - Client-side checks
✅ Secure Messaging - SSL/TLS ready
✅ Encrypted Display - Lock icons shown
✅ PCI Compliance - Production-ready structure

------------------------------------------------------------------
