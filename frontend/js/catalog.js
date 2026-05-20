const grid = document.getElementById('product-grid');
const emptyEl = document.getElementById('empty');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const alertEl = document.getElementById('alert');

let products = [];

function showAlert(msg, type = 'error') {
  alertEl.textContent = msg;
  alertEl.className = `alert alert-${type}`;
  alertEl.classList.remove('hidden');
  setTimeout(() => alertEl.classList.add('hidden'), 4000);
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === product._id);
  if (existing) {
    if (existing.quantity >= product.stock) {
      showAlert('Cannot add more — stock limit reached');
      return;
    }
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: 1,
    });
  }
  saveCart(cart);
  showAlert(`${product.name} added to cart`, 'success');
}

function renderProducts(list) {
  grid.innerHTML = '';
  if (!list.length) {
    emptyEl.classList.remove('hidden');
    return;
  }
  emptyEl.classList.add('hidden');

  list.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const img = p.image || 'https://via.placeholder.com/400x180?text=No+Image';
    card.innerHTML = `
      <img src="${img}" alt="${p.name}" loading="lazy">
      <div class="product-card-body">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <p style="color:var(--muted);font-size:0.9rem;margin:0.35rem 0;">${p.description.slice(0, 80)}${p.description.length > 80 ? '…' : ''}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
        <p class="product-stock">${p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm add-btn" ${p.stock === 0 ? 'disabled' : ''}>Add to cart</button>
        </div>
      </div>
    `;
    card.querySelector('.add-btn').addEventListener('click', () => addToCart(p));
    grid.appendChild(card);
  });
}

function populateCategories() {
  const cats = [...new Set(products.map((p) => p.category))].sort();
  categorySelect.innerHTML = '<option value="">All categories</option>';
  cats.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });
}

function filterProducts() {
  const q = searchInput.value.toLowerCase().trim();
  const cat = categorySelect.value;
  let filtered = products;
  if (cat) filtered = filtered.filter((p) => p.category === cat);
  if (q) {
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  renderProducts(filtered);
}

async function loadProducts() {
  try {
    products = await api('/products');
    populateCategories();
    renderProducts(products);
  } catch (err) {
    grid.innerHTML = '';
    emptyEl.textContent = 'Failed to load products. Is the server running?';
    emptyEl.classList.remove('hidden');
  }
}

searchInput.addEventListener('input', filterProducts);
categorySelect.addEventListener('change', filterProducts);
loadProducts();
