// APPLY ADMIN SETTINGS
const adminColor = localStorage.getItem('elRayen_PrimaryColor');
if (adminColor) {
    document.querySelector('header').style.backgroundColor = adminColor;
}

// LOAD ADMIN PRODUCTS
const customItems = JSON.parse(localStorage.getItem('customProducts')) || [];
if (customItems.length > 0) {
    products.push(...customItems);
}
// ==========================================
// 1. PRODUCT DATABASE (Algerian Sweets)
// ==========================================
const products = [
    { id: 1, name: "Premium Baklava", price: 1500, category: "Baklava" },
    { id: 2, name: "Traditional Makrout", price: 1200, category: "Makrout" },
    { id: 3, name: "Apricot Sable", price: 800, category: "Sable" },
    { id: 4, name: "Classic Ghraibia", price: 900, category: "Ghraibia" },
    { id: 5, name: "Honey Baklava", price: 1800, category: "Baklava" }
];

const productList = document.getElementById('product-list');

// ==========================================
// 2. CORE DISPLAY FUNCTION
// ==========================================
function displayProducts(productsToDisplay) {
    // Clear the current display
    productList.innerHTML = ''; 
    
    // If no products found, show a message
    if (productsToDisplay.length === 0) {
        productList.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p style="color: #a78336; font-weight: bold;">${product.price} DZD</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
    });
}

// ==========================================
// 3. SEARCH & CATEGORY FILTERS
// ==========================================

// Function for the Search Bar
function searchProducts() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(input));
    displayProducts(filtered);
}

// Function for Category Buttons
function filterCategory(categoryName) {
    const filtered = (categoryName === 'All') 
        ? products 
        : products.filter(p => p.category === categoryName);
    displayProducts(filtered);
}

// ==========================================
// 4. SHOPPING CART (LocalStorage Database)
// ==========================================

function addToCart(productId) {
    // Get existing cart or create empty one
    let cart = JSON.parse(localStorage.getItem('elRayenCart')) || [];
    
    // Find the product in our database
    const item = products.find(p => p.id === productId);
    
    // Add to cart and save to local database
    cart.push(item);
    localStorage.setItem('elRayenCart', JSON.stringify(cart));
    
    // Update the UI
    displayCart();
    alert(item.name + " added to your cart!");
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    
    // Load from local database
    let cart = JSON.parse(localStorage.getItem('elRayenCart')) || [];
    
    // Update cart list HTML
    cartItems.innerHTML = cart.map(item => `<p>${item.name} - ${item.price} DZD</p>`).join('');
    
    // Calculate total price
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    totalSpan.innerText = total;
}

function clearCart() {
    localStorage.removeItem('elRayenCart');
    displayCart();
}

// ==========================================
// 5. SITE INITIALIZATION
// ==========================================
// This runs automatically when the page loads
window.onload = function() {
    displayProducts(products);
    displayCart();
};
let myCart = [];

// --- 1. CART FUNCTIONS ---
function openCart() {
    document.getElementById('cartOverlay').style.display = 'block';
    renderCart();
}

function closeCart() {
    document.getElementById('cartOverlay').style.display = 'none';
}

function addToCart(name, price) {
    myCart.push({ name, price });
    updateCounter();
    alert(name + " added to cart!");
}

function updateCounter() {
    let total = 0;
    myCart.forEach(item => {
        total += parseInt(item.price);
    });

    document.getElementById('cart-counter').innerText = myCart.length;
    document.getElementById('itemsCount').innerText = myCart.length;
    document.getElementById('cartTotalPrice').innerText = total;
}

function sendOrder(platform) {
    if (myCart.length === 0) return alert("Please add sweets to your cart first!");

    // 1. Build the Message
    let total = document.getElementById('cartTotalPrice').innerText;
    let message = "🍩 *NEW ORDER FROM EL RAYEN STORE*\n";
    message += "----------------------------\n";
    
    myCart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.price} DZD\n`;
    });

    message += "----------------------------\n";
    message += `*TOTAL AMOUNT:* ${total} DZD\n`;
    message += "📍 *Location:* Tebessa, Algeria\n";

    // 2. Save to Admin App (Local Database)
    let salesData = JSON.parse(localStorage.getItem('elRayenOrders')) || [];
    salesData.push({ time: new Date().toLocaleString(), total: total, count: myCart.length });
    localStorage.setItem('elRayenOrders', JSON.stringify(salesData));

    // 3. Send to Platform
    const encoded = encodeURIComponent(message);
    const myPhone = "213784788218"; // <-- PUT YOUR WHATSAPP NUMBER HERE
    const myEmail = "elrayenprod@outlook.fr"; // <-- PUT YOUR EMAIL HERE

    if (platform === 'whatsapp') {
        window.open(`https://wa.me/${myPhone}?text=${encoded}`);
    } else if (platform === 'email') {
        window.open(`mailto:${myEmail}?subject=New Sweet Order&body=${encoded}`);
    } else if (platform === 'instagram') {
        navigator.clipboard.writeText(message);
        alert("Order details copied! Paste them in our Instagram DM.");
        window.open("https://www.instagram.com/your_username/"); // <-- PUT YOUR IG LINK HERE
    }
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    if (myCart.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:gray;">Empty cart.</p>';
        return;
    }
    list.innerHTML = myCart.map(item => `
        <div style="border-bottom:1px solid #eee; padding:10px; display:flex; justify-content:space-between;">
            <span>${item.name}</span>
            <span style="color:#a78336; font-weight:bold;">${item.price} DZD</span>
        </div>
    `).join('');
}

// --- 2. TRANSLATION FUNCTION ---
function translateSite(lang) {
    if(lang === 'ar') {
        alert("الموقع سيتحول إلى العربية قريبا");
        // Logic to flip text goes here
    } else if(lang === 'fr') {
        alert("Le site sera traduit en Français");
    } else {
        alert("Site language set to English");
    }
}