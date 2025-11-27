const API = "http://localhost:3000";

// ---------- AUTH ----------
async function signup() {
    let name = document.getElementById("name").value;
    let role = document.getElementById("role").value;
    let password = document.getElementById("password").value;

    let res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name, role, password})
    });

    let data = await res.json();
    if (data.success) {
        alert("Signup successful!");
    }
}

async function login() {
    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;

    let res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name, password})
    });

    let data = await res.json();

    if (!data.success) return alert("Wrong credentials");

    if (data.user.role === "farmer") {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "dashboard-farmer.html";
    } else if (data.user.role === "seller") {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "dashboard-seller.html";
    } else {
        alert("Admin login coming soon!");
    }
}

// ---------- FARMER ----------
async function addProduct() {
    let farmer = JSON.parse(localStorage.getItem("user"));

    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;

    let res = await fetch(`${API}/addProduct`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({farmerId: farmer.id, name, price})
    });

    document.getElementById("message").innerText = "Product Added!";
}

// ---------- SELLER ----------
async function loadProducts() {
    let res = await fetch(`${API}/products`);
    let products = await res.json();

    let container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(p => {
        container.innerHTML += `
            <div class="product">
                <h3>${p.name}</h3>
                <p>Price: ${p.price}</p>
                <button onclick="order(${p.id})">Order</button>
            </div>
        `;
    });
}

async function order(productId) {
    let seller = JSON.parse(localStorage.getItem("user"));

    await fetch(`${API}/order`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({sellerId: seller.id, productId})
    });

    alert("Order Placed!");
}

if (window.location.pathname.includes("dashboard-seller.html")) {
    loadProducts();
}

