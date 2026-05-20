const ordersList = document.getElementById('orders-list');
const emptyEl = document.getElementById('empty');
const alertEl = document.getElementById('alert');

function showAlert(msg, type = 'error') {
  alertEl.textContent = msg;
  alertEl.className = `alert alert-${type}`;
  alertEl.classList.remove('hidden');
}

function renderOrder(order) {
  const items = order.items
    .map((i) => `<li>${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}</li>`)
    .join('');
  const addr = order.shippingAddress;
  const addressStr = addr
    ? [addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean).join(', ')
    : 'N/A';

  return `
    <article class="order-card">
      <div class="order-header">
        <div>
          <strong>Order #${order._id.slice(-8).toUpperCase()}</strong>
          <p style="color:var(--muted);font-size:0.85rem;margin-top:0.25rem;">${formatDate(order.createdAt)}</p>
        </div>
        <span class="status-badge status-${order.status}">${order.status}</span>
      </div>
      <ul style="margin:0.5rem 0 0.75rem 1.25rem;color:var(--muted);">${items}</ul>
      <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
      <p style="color:var(--muted);font-size:0.9rem;margin-top:0.35rem;"><strong>Ship to:</strong> ${addressStr}</p>
    </article>
  `;
}

async function loadOrders() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }
  try {
    const orders = await api('/orders/my');
    if (!orders.length) {
      emptyEl.classList.remove('hidden');
      return;
    }
    ordersList.innerHTML = orders.map(renderOrder).join('');
  } catch (err) {
    showAlert(err.message);
  }
}

loadOrders();
