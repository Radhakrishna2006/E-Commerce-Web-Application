const cartContent = document.getElementById('cart-content');
const emptyCart = document.getElementById('empty-cart');

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function cartTotal(cart) {
  return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function renderCart() {
  const cart = getCart();
  if (!cart.length) {
    cartContent.innerHTML = '';
    emptyCart.classList.remove('hidden');
    return;
  }
  emptyCart.classList.add('hidden');

  const rows = cart
    .map(
      (item, idx) => `
    <tr>
      <td>${item.name}</td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <div class="qty-control">
          <button type="button" data-action="dec" data-idx="${idx}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="inc" data-idx="${idx}">+</button>
        </div>
      </td>
      <td>${formatPrice(item.price * item.quantity)}</td>
      <td><button type="button" class="btn btn-danger btn-sm" data-action="remove" data-idx="${idx}">Remove</button></td>
    </tr>
  `
    )
    .join('');

  cartContent.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="cart-summary">
      <p class="total">Total: ${formatPrice(cartTotal(cart))}</p>
      <a href="checkout.html" class="btn btn-primary btn-block" id="checkout-btn">Proceed to checkout</a>
    </div>
  `;

  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.addEventListener('click', (e) => {
    if (!isLoggedIn()) {
      e.preventDefault();
      window.location.href = 'login.html';
    }
  });

  cartContent.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const action = btn.dataset.action;
      const cart = getCart();
      const item = cart[idx];
      if (action === 'remove') {
        cart.splice(idx, 1);
      } else if (action === 'inc' && item.quantity < item.stock) {
        item.quantity += 1;
      } else if (action === 'dec') {
        if (item.quantity > 1) item.quantity -= 1;
        else cart.splice(idx, 1);
      }
      saveCart(cart);
      renderCart();
    });
  });
}

renderCart();
