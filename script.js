// ==========================================
// 1. PRODUCT DATABASE & INITIALIZATION
// ==========================================
const products = [
    { id: 1, name: "Premium Baklava", price: 1500, category: "Baklava" },
    { id: 2, name: "Traditional Makrout", price: 1200, category: "Makrout" },
    { id: 3, name: "Apricot Sable", price: 800, category: "Sable" },
    { id: 4, name: "Classic Ghraibia", price: 900, category: "Ghraibia" },
    { id: 5, name: "Honey Baklava", price: 1800, category: "Baklava" }
];

const MY_SHOP_LOCATION = { lat: 35.40, lng: 8.12 }; // Tebessa coordinates
let myCart = JSON.parse(localStorage.getItem('elRayenCart')) || [];

window.onload = function() {
    const customItems = JSON.parse(localStorage.getItem('customProducts')) || [];
    if (customItems.length > 0) {
        products.push(...customItems);
    }
    
    const adminColor = localStorage.getItem('elRayen_PrimaryColor');
    if (adminColor) {
        document.querySelector('header').style.backgroundColor = adminColor;
    }

    displayProducts(products);
    updateCounter();
};

// ==========================================
// 2. CORE DISPLAY & FILTER FUNCTIONS
// ==========================================
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; 
    
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

function searchProducts() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(input));
    displayProducts(filtered);
}

function filterCategory(categoryName) {
    const filtered = (categoryName === 'All') 
        ? products 
        : products.filter(p => p.category === categoryName);
    displayProducts(filtered);
}

// ==========================================
// 3. CART SYSTEM
// ==========================================
function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    myCart.push(item);
    localStorage.setItem('elRayenCart', JSON.stringify(myCart));
    updateCounter();
    alert(item.name + " added to your cart!");
}

function updateCounter() {
    let subtotal = myCart.reduce((sum, item) => sum + parseInt(item.price), 0);
    let deliveryFee = parseInt(document.getElementById('deliveryFeeValue')?.value || 0);
    let finalTotal = subtotal + deliveryFee;

    if(document.getElementById('cart-counter')) document.getElementById('cart-counter').innerText = myCart.length;
    if(document.getElementById('itemsCount')) document.getElementById('itemsCount').innerText = myCart.length;
    if(document.getElementById('cartTotalPrice')) document.getElementById('cartTotalPrice').innerText = finalTotal;
}

function openCart() {
    document.getElementById('cartOverlay').style.display = 'block';
    renderCart();
}

function closeCart() {
    document.getElementById('cartOverlay').style.display = 'none';
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

function clearCart() {
    myCart = [];
    localStorage.removeItem('elRayenCart');
    updateCounter();
    renderCart();
}

// ==========================================
// 4. ORDER & LOCATION LOGIC
// ==========================================
function calculateDistance() {
    const distText = document.getElementById('distDisplay');
    const feeText = document.getElementById('feeDisplay');

    if (!navigator.geolocation) return alert("Geolocation not supported.");

    distText.innerText = "Locating...";

    navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const R = 6371; 
        const dLat = (userLat - MY_SHOP_LOCATION.lat) * Math.PI / 180;
        const dLon = (userLng - MY_SHOP_LOCATION.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(MY_SHOP_LOCATION.lat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; 

        let calculatedFee = Math.max(50, Math.round(distance * 30));
        document.getElementById('deliveryFeeValue').value = calculatedFee;
        distText.innerText = `Distance: ${distance.toFixed(2)} km`;
        feeText.innerText = `Fee: ${calculatedFee} DZD`;
        updateCounter();
    });
}

function sendOrder(platform) {
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const total = document.getElementById('cartTotalPrice').innerText;

    if (!name || !phone || !address) return alert("Please fill details!");
    if (myCart.length === 0) return alert("Cart is empty!");

    let message = `*EL RAYEN - NEW ORDER*\n👤 *Customer:* ${name}\n📞 *Phone:* ${phone}\n📍 *Address:* ${address}\n*ITEMS:*\n`;
    myCart.forEach((item, i) => message += `${i + 1}. ${item.name} (${item.price} DZD)\n`);
    message += `💰 *TOTAL:* ${total} DZD`;

    let salesData = JSON.parse(localStorage.getItem('elRayenOrders')) || [];
    salesData.push({ time: new Date().toLocaleString(), total: total, count: myCart.length });
    localStorage.setItem('elRayenOrders', JSON.stringify(salesData));

    const encoded = encodeURIComponent(message);
    if (platform === 'whatsapp') window.open(`https://wa.me/213784788218?text=${encoded}`);
    if (platform === 'email') window.open(`mailto:elrayenprod@outlook.fr?subject=New Order&body=${encoded}`);
}