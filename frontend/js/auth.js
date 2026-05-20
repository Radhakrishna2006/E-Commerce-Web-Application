const alertEl = document.getElementById('alert');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

function showAlert(msg, type = 'error') {
  alertEl.textContent = msg;
  alertEl.className = `alert alert-${type}`;
  alertEl.classList.remove('hidden');
}

if (isLoggedIn()) {
  window.location.href = 'index.html';
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        }),
      });
      setAuth(data.token, data.user);
      window.location.href = data.user.role === 'admin' ? 'admin.html' : 'index.html';
    } catch (err) {
      showAlert(err.message);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        }),
      });
      setAuth(data.token, data.user);
      window.location.href = 'index.html';
    } catch (err) {
      showAlert(err.message);
    }
  });
}
