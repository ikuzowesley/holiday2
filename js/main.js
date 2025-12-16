console.log('Main.js loaded');

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

  // MOCK LOGIN: Simulate network delay then accept
  setTimeout(() => {
    // Determine name from email for display
    const name = email.split('@')[0];

    localStorage.setItem('kda_token', 'mock-token-' + Date.now());
    localStorage.setItem('kda_name', name);

    showToast('Login successful! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  }, 800);
});

// --- REGISTER LOGIC ---
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Register submitting...');
  clearErrors();

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const btn = document.getElementById('btn-register');

  if (!name || !email || !password) {
    showError(registerError, 'All fields are required.');
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Creating Account...';

  // MOCK REGISTER
  setTimeout(() => {
    localStorage.setItem('kda_token', 'mock-token-' + Date.now());
    localStorage.setItem('kda_name', name);

    btn.innerText = 'Account Created! Logging in...';
    showToast('Account created! Logging you in...', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  }, 800);
});

// --- AUTO CHECK AUTH ---
const existingToken = localStorage.getItem('kda_token');
if (existingToken) {
  console.log('Found existing token, redirecting...');
  window.location.href = 'dashboard.html';
}
