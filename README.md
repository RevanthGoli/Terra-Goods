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
        └── App.jsx      # React app (single file)
```

---

## Backend Setup (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Flask runs on **http://localhost:5000**

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

React runs on **http://localhost:3000**

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
