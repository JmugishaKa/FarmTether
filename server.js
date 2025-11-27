const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

const DB = "./db.json";

// Load database
function loadDB() {
    return JSON.parse(fs.readFileSync(DB, "utf8"));
}

// Save database
function saveDB(data) {
    fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// ---------------- AUTH ----------------
app.post("/signup", (req, res) => {
    const { name, role, password } = req.body;
    let db = loadDB();

    const user = {
        id: Date.now(),
        name,
        role,
        password
    };

    db.users.push(user);
    saveDB(db);

    res.json({ success: true, user });
});

app.post("/login", (req, res) => {
    const { name, password } = req.body;
    let db = loadDB();

    const user = db.users.find(u => u.name === name && u.password === password);

    if (!user) {
        return res.json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, user });
});

// ---------------- PRODUCTS ----------------
app.post("/addProduct", (req, res) => {
    const { farmerId, name, price } = req.body;
    let db = loadDB();

    const product = {
        id: Date.now(),
        farmerId,
        name,
        price
    };

    db.products.push(product);
    saveDB(db);

    res.json({ success: true, product });
});

app.get("/products", (req, res) => {
    let db = loadDB();
    res.json(db.products);
});

// ---------------- ORDERS ----------------
app.post("/order", (req, res) => {
    const { sellerId, productId } = req.body;
    let db = loadDB();

    const order = {
        id: Date.now(),
        sellerId,
        productId,
        status: "Pending"
    };

    db.orders.push(order);
    saveDB(db);

    res.json({ success: true, order });
});

app.get("/orders", (req, res) => {
    let db = loadDB();
    res.json(db.orders);
});

// ---------------- START SERVER ----------------
app.listen(3000, () => {
    console.log("FarmTether server running on http://localhost:3000");
});

