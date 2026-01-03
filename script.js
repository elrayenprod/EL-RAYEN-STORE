// 1. Our Product Data
const products = [
    { id: 1, name: "Algerian Coffee Blend", price: 1200 },
    { id: 2, name: "Premium Dates (Deglet Nour)", price: 2500 },
    { id: 3, name: "Traditional Pottery", price: 4500 }
];

// 2. Load Products to Screen
const productList = document.getElementById('product-list');
products.forEach(product => {
    productList.innerHTML += `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p style="color: #a78336; font-weight: bold;">${product.price} DZD</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `;
});

// 3. Add to "Database" (LocalStorage)
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('elRayenCart')) || [];
    const item = products.find(p => p.id === productId);
    cart.push(item);
    localStorage.setItem('elRayenCart', JSON.stringify(cart));
    displayCart();
}

// 4. Show Cart from Database
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    let cart = JSON.parse(localStorage.getItem('elRayenCart')) || [];
    
    cartItems.innerHTML = cart.map(item => `<p>${item.name} - ${item.price} DZD</p>`).join('');
    
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    totalSpan.innerText = total;
}

function clearCart() {
    localStorage.removeItem('elRayenCart');
    displayCart();
}

// Show cart on load
displayCart();