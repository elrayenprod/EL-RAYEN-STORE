// ==========================================
// 1. LOCAL DATABASE (Products & Categories)
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
// 2. DISPLAY LOGIC
// ==========================================

// Function to render products to the screen
function displayProducts(productsToDisplay) {
    productList.innerHTML = ''; // Clear current display
    
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
// 3. SEARCH & FILTER LOGIC
// ==========================================

// Search Bar Function
function searchProducts() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(input));
    displayProducts(filtered);
}

// Category Button Function
function filterCategory(categoryName) {
    const filtered = (categoryName === 'All') 
        ? products 
        : products.filter(p => p.category === categoryName);
    displayProducts(filtered);
}

// ==========================================
// 4. SHOPPING CART LOGIC (Local Database)
// ==========================================

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('elRayenCart')) || [];
    const item = products.find(p => p.id === productId);
    cart.push(item);
    localStorage.setItem('elRayenCart', JSON.stringify(cart));
    displayCart();
}

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

// ==========================================
// 5. INITIALIZE SITE
// ==========================================
// This runs as soon as the page loads
displayProducts(products);
displayCart();
