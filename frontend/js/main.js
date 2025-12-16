console.log('Main.js loaded');

const apiRoot = '/api';

// --- ELEMENT REFERENCES ---
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// --- TOGGLE VIEWS ---
linkToRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginContainer.classList.add('hidden');
  registerContainer.classList.remove('hidden');
  clearErrors();
});

linkToLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
  clearErrors();
});

function clearErrors() {
  loginError.style.display = 'none';
  loginError.innerText = '';
  registerError.style.display = 'none';
  registerError.innerText = '';
}

function showError(el, msg) {
  el.style.display = 'block';
  el.innerText = msg;
}

// --- LOGIN LOGIC ---
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Login submitting...');
  clearErrors();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('btn-login');

  if (!email || !password) {
    showError(loginError, 'Please enter both email and password.');
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Checking...';

  try {
    const res = await fetch(apiRoot + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log('Login response:', data);

    if (res.ok && data.token) {
      // SUCCESS
      localStorage.setItem('kda_token', data.token);
      localStorage.setItem('kda_name', data.name || 'User');

      showToast('Login successful! Redirecting...', 'success');

      // Explicit redirect
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);

    } else {
      // FAIL
      showError(loginError, data.error || 'Login failed. Please check credentials.');
      btn.disabled = false;
      btn.innerText = 'Login';
    }

  } catch (err) {
    console.error(err);
    showError(loginError, 'Network error. Please try again.');
    btn.disabled = false;
    btn.innerText = 'Login';
  }
});

// --- REGISTER LOGIC ---
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Register submitting...');
  clearErrors();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;
  const btn = document.getElementById('btn-register');

  if (!name || !email || !password) {
    showError(registerError, 'All fields are required.');
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Creating Account...';

  try {
    const res = await fetch(apiRoot + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    console.log('Register response:', data);

    if (res.ok && data.userId) {
      // SUCCESS: Auto-Login
      btn.innerText = 'Account Created! Logging in...';
      showToast('Account created! Logging you in...', 'success');

      // Immediate login attempt
      const loginRes = await fetch(apiRoot + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();

      if (loginData.token) {
        localStorage.setItem('kda_token', loginData.token);
        localStorage.setItem('kda_name', loginData.name || name);
        window.location.href = 'dashboard.html';
      } else {
        // Fallback if auto-login fails
        setTimeout(() => {
          linkToLogin.click();
          document.getElementById('login-email').value = email;
          showError(loginError, 'Please sign in with your new account.');
        }, 1500);
      }

    } else {
      // FAIL
      showError(registerError, data.error || 'Registration failed.');
      btn.disabled = false;
      btn.innerText = 'Register';
    }

  } catch (err) {
    console.error(err);
    showError(registerError, 'Network error. Please try again.');
    btn.disabled = false;
    btn.innerText = 'Register';
  }
});

// --- AUTO CHECK AUTH ---
// If user already has token, just go to dashboard
const existingToken = localStorage.getItem('kda_token');
if (existingToken) {
  // Optional: verify token validity with backend here if needed
  // For now, let's just assume valid if exists, dashboard will kick back if invalid
  console.log('Found existing token, redirecting...');
  window.location.href = 'dashboard.html';
}
