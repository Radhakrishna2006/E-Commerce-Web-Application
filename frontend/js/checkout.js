const summaryItems = document.getElementById('summary-items');
const summaryTotal = document.getElementById('summary-total');
const form = document.getElementById('checkout-form');
const alertEl = document.getElementById('alert');

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function showAlert(msg, type = 'error') {
  alertEl.textContent = msg;
  alertEl.className = `alert alert-${type}`;
  alertEl.classList.remove('hidden');
}

if (!isLoggedIn()) {
  window.location.href = 'login.html';
}

const cart = getCart();
if (!cart.length) {
  window.location.href = 'cart.html';
}

const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
summaryItems.innerHTML = cart
  .map((i) => `<p style="margin-bottom:0.5rem;color:var(--muted);">${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}</p>`)
  .join('');
summaryTotal.textContent = formatPrice(total);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: {
          street: document.getElementById('street').value,
          city: document.getElementById('city').value,
          state: document.getElementById('state').value,
          zip: document.getElementById('zip').value,
          country: document.getElementById('country').value,
        },
      }),
    });
    localStorage.removeItem('cart');
    updateCartBadge();
    showAlert('Order placed successfully!', 'success');
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 1500);
  } catch (err) {
    showAlert(err.message);
  }
});
