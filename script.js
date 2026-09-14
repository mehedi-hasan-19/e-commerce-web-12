// Simulated Backend Database (Products)
const productsData = [
    { id: 1, name: "Premium Oversized T-Shirt", price: 1290, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000", badge: "NEW" },
    { id: 2, name: "Classic Linen Shirt", price: 1200, image: "images/image_1788762523857.jpg", badge: "" },
    { id: 3, name: "Streetwear Cargo Pants", price: 2500, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=2000", badge: "HOT" },
    { id: 4, name: "Minimalist Hoodie", price: 1890, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000", badge: "SALE" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentViewedProductId = null;

// --- Navigation & View Switching ---
function hideAllSections() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.categories-section').style.display = 'none';
    document.querySelector('.collection-banner').style.display = 'none';
    document.querySelector('.features-section').style.display = 'none';
    document.querySelector('.reviews-section').style.display = 'none';
    document.querySelector('.instagram-section').style.display = 'none';
    document.querySelector('.shop-section').style.display = 'none';
    document.getElementById('shop-page').style.display = 'none';
    document.getElementById('product-details-page').style.display = 'none';
}

function showHomePage() {
    hideAllSections();
    document.querySelector('.hero').style.display = 'flex';
    document.querySelector('.shop-section').style.display = 'block';
    document.querySelector('.categories-section').style.display = 'block';
    document.querySelector('.collection-banner').style.display = 'flex';
    document.querySelector('.features-section').style.display = 'grid';
    document.querySelector('.reviews-section').style.display = 'block';
    document.querySelector('.instagram-section').style.display = 'block';
}

function showShopPage() {
    hideAllSections();
    document.getElementById('shop-page').style.display = 'block';
    const shopGrid = document.getElementById('all-products-grid');
    shopGrid.innerHTML = '';
    
    productsData.forEach(product => {
        let badgeHtml = product.badge ? `<div class="badge">${product.badge}</div>` : '';
        shopGrid.innerHTML += `
            <div class="product-card">
                ${badgeHtml}
                <img src="${product.image}" alt="${product.name}" onclick="viewProduct(${product.id})" style="cursor:pointer;">
                <h3 class="product-title" onclick="viewProduct(${product.id})" style="cursor:pointer;">${product.name}</h3>
                <p class="product-price">৳${product.price}</p>
                <button class="btn-primary" onclick="addToCart(${product.id})">ADD TO CART</button>
            </div>
        `;
    });
}

function viewProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    
    currentViewedProductId = id;
    hideAllSections();
    document.getElementById('product-details-page').style.display = 'block';
    
    document.getElementById('main-product-img').src = product.image;
    document.getElementById('detail-title').innerText = product.name;
    document.getElementById('detail-price').innerText = `৳${product.price}`;
    
    const thumbs = document.querySelectorAll('.thumbnail-list img');
    thumbs.forEach(thumb => thumb.src = product.image);
    
    window.scrollTo(0, 0);
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    productsData.forEach(product => {
        let badgeHtml = product.badge ? `<div class="badge">${product.badge}</div>` : '';
        grid.innerHTML += `
            <div class="product-card">
                ${badgeHtml}
                <img src="${product.image}" alt="${product.name}" onclick="viewProduct(${product.id})" style="cursor:pointer;">
                <h3 class="product-title" onclick="viewProduct(${product.id})" style="cursor:pointer;">${product.name}</h3>
                <p class="product-price">৳${product.price}</p>
                <button class="btn-primary" onclick="addToCart(${product.id})">ADD TO CART</button>
            </div>
        `;
    });
}

// --- Cart Logic ---
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    
    updateCart();
    toggleCart(true);
}

function addToCartFromDetails() {
    if (currentViewedProductId) addToCart(currentViewedProductId);
}

function buyNowFromDetails() {
    if (currentViewedProductId) {
        const product = productsData.find(p => p.id === currentViewedProductId);
        const existingItem = cart.find(item => item.id === currentViewedProductId);
        
        if (existingItem) existingItem.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        
        updateCart();
        openCheckout();
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    cartItemsDiv.innerHTML = '';
    let total = 0, count = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>৳${item.price} x ${item.quantity}</p>
                    <div class="cart-item-actions">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                        <span class="remove-btn" onclick="removeItem(${index})">Remove</span>
                    </div>
                </div>
            </div>
        `;
    });

    cartCount.innerText = count;
    cartTotal.innerText = `৳${total}`;
}

function changeQty(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (forceOpen === true) {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    } else {
        sidebar.classList.toggle('open');
        overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    }
}

// --- Checkout Logic ---
function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('checkout-modal').style.display = 'flex';
    document.getElementById('overlay').style.display = 'none';
    
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let delivery = 100;
    document.getElementById('checkout-grand-total').innerText = `৳${subtotal + delivery}`;
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const orderId = Math.floor(Math.random() * 1000000);
    closeCheckout();
    
    cart = [];
    updateCart();
    
    document.getElementById('order-id').innerText = orderId;
    document.getElementById('success-message').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
});

function closeSuccess() {
    document.getElementById('success-message').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    showHomePage();
}

// Init
renderProducts();
updateCart();