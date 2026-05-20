const alertEl = document.getElementById('alert');
const productsTable = document.getElementById('products-table');
const adminOrders = document.getElementById('admin-orders');
const modal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');

function showAlert(msg, type = 'error') {
  alertEl.textContent = msg;
  alertEl.className = `alert alert-${type}`;
  alertEl.classList.remove('hidden');
  setTimeout(() => alertEl.classList.add('hidden'), 4000);
}

if (!isLoggedIn() || !isAdmin()) {
  window.location.href = 'login.html';
}

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

function openModal(product = null) {
  document.getElementById('modal-title').textContent = product ? 'Edit product' : 'Add product';
  document.getElementById('product-id').value = product ? product._id : '';
  document.getElementById('p-name').value = product?.name || '';
  document.getElementById('p-description').value = product?.description || '';
  document.getElementById('p-price').value = product?.price ?? '';
  document.getElementById('p-stock').value = product?.stock ?? '';
  document.getElementById('p-category').value = product?.category || '';
  document.getElementById('p-image').value = product?.image || '';
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  productForm.reset();
}

document.getElementById('add-product').addEventListener('click', () => openModal());
document.getElementById('modal-cancel').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  const body = {
    name: document.getElementById('p-name').value,
    description: document.getElementById('p-description').value,
    price: parseFloat(document.getElementById('p-price').value),
    stock: parseInt(document.getElementById('p-stock').value, 10),
    category: document.getElementById('p-category').value,
    image: document.getElementById('p-image').value,
  };
  try {
    if (id) {
      await api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      await api('/products', { method: 'POST', body: JSON.stringify(body) });
    }
    closeModal();
    showAlert('Product saved', 'success');
    loadProducts();
  } catch (err) {
    showAlert(err.message);
  }
});

async function loadProducts() {
  try {
    const products = await api('/products');
    productsTable.innerHTML = products
      .map(
        (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${formatPrice(p.price)}</td>
        <td>${p.stock}</td>
        <td>
          <button type="button" class="btn btn-secondary btn-sm edit-btn" data-id="${p._id}">Edit</button>
          <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${p._id}">Delete</button>
        </td>
      </tr>
    `
      )
      .join('');

    productsTable.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = products.find((x) => x._id === btn.dataset.id);
        openModal(p);
      });
    });

    productsTable.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this product?')) return;
        try {
          await api(`/products/${btn.dataset.id}`, { method: 'DELETE' });
          showAlert('Product deleted', 'success');
          loadProducts();
        } catch (err) {
          showAlert(err.message);
        }
      });
    });
  } catch (err) {
    showAlert(err.message);
  }
}

function renderAdminOrder(order) {
  const items = order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ');
  const customer = order.user ? `${order.user.name} (${order.user.email})` : 'Unknown';
  return `
    <article class="order-card">
      <div class="order-header">
        <div>
          <strong>#${order._id.slice(-8).toUpperCase()}</strong> — ${customer}
          <p style="color:var(--muted);font-size:0.85rem;">${formatDate(order.createdAt)} · ${formatPrice(order.total)}</p>
          <p style="font-size:0.9rem;margin-top:0.35rem;">${items}</p>
        </div>
        <select class="status-select" data-id="${order._id}" style="padding:0.4rem;background:var(--bg);border:1px solid var(--border);color:var(--text);border-radius:6px;">
          ${['pending', 'processing', 'shipped', 'delivered', 'cancelled']
            .map((s) => `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`)
            .join('')}
        </select>
      </div>
    </article>
  `;
}

async function loadOrders() {
  try {
    const orders = await api('/orders');
    adminOrders.innerHTML = orders.length
      ? orders.map(renderAdminOrder).join('')
      : '<p class="empty-state">No orders yet.</p>';

    adminOrders.querySelectorAll('.status-select').forEach((sel) => {
      sel.addEventListener('change', async () => {
        try {
          await api(`/orders/${sel.dataset.id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: sel.value }),
          });
          showAlert('Status updated', 'success');
        } catch (err) {
          showAlert(err.message);
          loadOrders();
        }
      });
    });
  } catch (err) {
    showAlert(err.message);
  }
}

loadProducts();
loadOrders();
