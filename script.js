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