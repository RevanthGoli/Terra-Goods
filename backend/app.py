from flask import Flask, jsonify, request, session
from flask_cors import CORS
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = "supersecretkey_change_in_production"
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# ─── In-Memory "Database" ────────────────────────────────────────────────────

PRODUCTS = [
    {"id": "1", "name": "Obsidian Desk Lamp", "price": 129.99, "category": "Lighting", "stock": 12, "rating": 4.8, "reviews": 234, "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80", "description": "Minimalist arc lamp with adjustable warm/cool light. Perfect for focused work sessions."},
    {"id": "2", "name": "Merino Wool Throw", "price": 89.99, "category": "Textiles", "stock": 30, "rating": 4.9, "reviews": 512, "image": "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400&q=80", "description": "Ethically sourced merino wool in natural earth tones. Incredibly soft, temperature-regulating."},
    {"id": "3", "name": "Ceramic Pour-Over Set", "price": 64.00, "category": "Kitchen", "stock": 8, "rating": 4.7, "reviews": 189, "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", "description": "Hand-thrown ceramic dripper and carafe set. Each piece is unique, glazed in matte stone."},
    {"id": "4", "name": "Linen Tote Bag", "price": 45.00, "category": "Accessories", "stock": 55, "rating": 4.6, "reviews": 320, "image": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80", "description": "Heavyweight linen canvas with leather handles. Spacious, durable, effortlessly elegant."},
    {"id": "5", "name": "Walnut Serving Board", "price": 78.50, "category": "Kitchen", "stock": 20, "rating": 4.9, "reviews": 401, "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", "description": "Solid American walnut with juice groove. Heirloom quality, naturally antimicrobial."},
    {"id": "6", "name": "Handmade Soy Candle", "price": 32.00, "category": "Home", "stock": 75, "rating": 4.8, "reviews": 768, "image": "https://images.unsplash.com/photo-1602607921522-11a56fcce174?w=400&q=80", "description": "Small-batch soy wax with cedar + amber fragrance. 60-hour burn time, reusable vessel."},
    {"id": "7", "name": "Brass Bookends", "price": 55.00, "category": "Accessories", "stock": 18, "rating": 4.5, "reviews": 143, "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", "description": "Solid cast brass with an aged patina finish. Weighted base keeps books perfectly upright."},
    {"id": "8", "name": "Linen Duvet Cover", "price": 185.00, "category": "Textiles", "stock": 14, "rating": 4.7, "reviews": 295, "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80", "description": "Stone-washed French linen, gets softer with every wash. Available in 5 natural shades."},
]

USERS = {}      # email -> user dict
ORDERS = []     # list of order dicts
CARTS = {}      # session_id -> list of cart items

# ─── Helpers ──────────────────────────────────────────────────────────────────

def get_cart_id():
    if "cart_id" not in session:
        session["cart_id"] = str(uuid.uuid4())
    return session["cart_id"]

def find_product(pid):
    return next((p for p in PRODUCTS if p["id"] == pid), None)

# ─── Products ─────────────────────────────────────────────────────────────────

@app.route("/api/products", methods=["GET"])
def get_products():
    category = request.args.get("category")
    search = request.args.get("search", "").lower()
    sort = request.args.get("sort", "default")

    results = PRODUCTS[:]
    if category and category != "All":
        results = [p for p in results if p["category"] == category]
    if search:
        results = [p for p in results if search in p["name"].lower() or search in p["description"].lower()]
    if sort == "price_asc":
        results.sort(key=lambda x: x["price"])
    elif sort == "price_desc":
        results.sort(key=lambda x: x["price"], reverse=True)
    elif sort == "rating":
        results.sort(key=lambda x: x["rating"], reverse=True)

    return jsonify(results)

@app.route("/api/products/<pid>", methods=["GET"])
def get_product(pid):
    p = find_product(pid)
    if not p:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(p)

@app.route("/api/categories", methods=["GET"])
def get_categories():
    cats = sorted(set(p["category"] for p in PRODUCTS))
    return jsonify(["All"] + cats)

# ─── Cart ─────────────────────────────────────────────────────────────────────

@app.route("/api/cart", methods=["GET"])
def get_cart():
    cid = get_cart_id()
    items = CARTS.get(cid, [])
    total = sum(i["price"] * i["qty"] for i in items)
    return jsonify({"items": items, "total": round(total, 2), "count": sum(i["qty"] for i in items)})

@app.route("/api/cart", methods=["POST"])
def add_to_cart():
    data = request.get_json()
    pid = str(data.get("product_id"))
    qty = int(data.get("qty", 1))
    product = find_product(pid)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    cid = get_cart_id()
    cart = CARTS.setdefault(cid, [])
    for item in cart:
        if item["product_id"] == pid:
            item["qty"] = min(item["qty"] + qty, product["stock"])
            return jsonify({"message": "Updated", "cart_count": sum(i["qty"] for i in cart)})

    cart.append({"product_id": pid, "name": product["name"], "price": product["price"],
                 "image": product["image"], "qty": qty, "stock": product["stock"]})
    return jsonify({"message": "Added", "cart_count": sum(i["qty"] for i in cart)}), 201

@app.route("/api/cart/<pid>", methods=["PUT"])
def update_cart_item(pid):
    data = request.get_json()
    qty = int(data.get("qty", 1))
    cid = get_cart_id()
    cart = CARTS.get(cid, [])
    for item in cart:
        if item["product_id"] == pid:
            if qty <= 0:
                cart.remove(item)
            else:
                item["qty"] = min(qty, item["stock"])
            CARTS[cid] = cart
            return jsonify({"message": "Updated"})
    return jsonify({"error": "Item not in cart"}), 404

@app.route("/api/cart/<pid>", methods=["DELETE"])
def remove_from_cart(pid):
    cid = get_cart_id()
    cart = CARTS.get(cid, [])
    CARTS[cid] = [i for i in cart if i["product_id"] != pid]
    return jsonify({"message": "Removed"})

# ─── Auth ─────────────────────────────────────────────────────────────────────

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    name = data.get("name", "")
    if not email or not password or not name:
        return jsonify({"error": "All fields required"}), 400
    if email in USERS:
        return jsonify({"error": "Email already registered"}), 409
    USERS[email] = {"email": email, "password": password, "name": name, "id": str(uuid.uuid4())}
    session["user"] = email
    return jsonify({"message": "Registered", "user": {"email": email, "name": name}}), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    user = USERS.get(email)
    if not user or user["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    session["user"] = email
    return jsonify({"message": "Logged in", "user": {"email": email, "name": user["name"]}})

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logged out"})

@app.route("/api/auth/me", methods=["GET"])
def me():
    email = session.get("user")
    if not email or email not in USERS:
        return jsonify({"user": None})
    u = USERS[email]
    return jsonify({"user": {"email": u["email"], "name": u["name"]}})

# ─── Orders ───────────────────────────────────────────────────────────────────

@app.route("/api/orders", methods=["POST"])
def place_order():
    data = request.get_json()
    cid = get_cart_id()
    cart = CARTS.get(cid, [])
    if not cart:
        return jsonify({"error": "Cart is empty"}), 400

    total = sum(i["price"] * i["qty"] for i in cart)
    order = {
        "id": str(uuid.uuid4())[:8].upper(),
        "items": cart[:],
        "total": round(total, 2),
        "shipping": data.get("shipping", {}),
        "payment_last4": data.get("payment_last4", "****"),
        "status": "confirmed",
        "date": datetime.utcnow().isoformat(),
        "user": session.get("user"),
    }
    ORDERS.append(order)
    CARTS[cid] = []  # clear cart
    return jsonify({"message": "Order placed", "order": order}), 201

@app.route("/api/orders", methods=["GET"])
def get_orders():
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not authenticated"}), 401
    user_orders = [o for o in ORDERS if o.get("user") == user]
    return jsonify(user_orders)

# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, port=5000)
