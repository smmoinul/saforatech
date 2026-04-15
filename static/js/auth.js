// ============================================================
// SaforaTech — Auth.js
// Handles login, register, Google OAuth, forgot password
// ============================================================

// ── Modal Control ────────────────────────────────────────────
function openAuthModal(tab = 'login') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  showAuthTab(tab);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  clearAuthErrors();
}

function handleModalOverlayClick(e) {
  if (e.target.id === 'auth-modal') closeAuthModal();
}

function showAuthTab(tab) {
  ['login', 'register', 'forgot', 'verify'].forEach(t => {
    const el = document.getElementById(`auth-tab-${t}`);
    if (el) el.classList.toggle('hidden', t !== tab);
  });
}

function clearAuthErrors() {
  ['login-error', 'register-error', 'forgot-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
  });
}

function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function showSuccess(elId, msg) {
  const el = document.getElementById(elId);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function setBtnLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('btn-loading', loading);
  btn.disabled = loading;
}

// ── Password visibility toggle ───────────────────────────────
function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

// ── Login Handler ─────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  clearAuthErrors();
  const email    = document.getElementById('login-email')?.value?.trim();
  const password = document.getElementById('login-password')?.value;
  if (!email || !password) return;

  setBtnLoading('login-submit-btn', true);
  const { data, error } = await signInWithEmail(email, password);
  setBtnLoading('login-submit-btn', false);

  if (error) {
    let msg = error.message;
    if (msg.includes('Invalid login')) msg = '❌ Incorrect email or password.';
    if (msg.includes('Email not confirmed')) msg = '📧 Please verify your email first.';
    showError('login-error', msg);
    return;
  }

  closeAuthModal();
  showToast('✅ Signed in successfully!', 'success');

  // Role-based redirect
  const profile = await getCurrentProfile();
  if (profile?.role === 'admin') {
    showAdminLinks();
    showToast('🔑 Admin access granted', 'success');
  }
}

// ── Register Handler ──────────────────────────────────────────
async function handleRegister(e) {
  e.preventDefault();
  clearAuthErrors();
  const name     = document.getElementById('reg-name')?.value?.trim();
  const email    = document.getElementById('reg-email')?.value?.trim();
  const password = document.getElementById('reg-password')?.value;

  if (!name || !email || !password) return;
  if (password.length < 8) {
    showError('register-error', '❌ Password must be at least 8 characters.');
    return;
  }

  setBtnLoading('reg-submit-btn', true);
  const { data, error } = await signUpWithEmail(email, password, name);
  setBtnLoading('reg-submit-btn', false);

  if (error) {
    let msg = error.message;
    if (msg.includes('already registered')) msg = '⚠️ This email is already in use.';
    showError('register-error', msg);
    return;
  }

  // Show verify email screen
  showAuthTab('verify');
}

// ── Google Login ──────────────────────────────────────────────
async function handleGoogleLogin() {
  const { error } = await signInWithGoogle();
  if (error) showToast('❌ Google login failed: ' + error.message, 'error');
}

// ── Forgot Password ───────────────────────────────────────────
async function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById('forgot-email')?.value?.trim();
  if (!email) return;

  const { error } = await resetPassword(email);
  if (error) {
    showError('forgot-msg', '❌ ' + error.message);
  } else {
    const el = document.getElementById('forgot-msg');
    if (el) {
      el.textContent = '✅ Reset link sent! Check your inbox.';
      el.classList.remove('hidden');
      el.classList.add('auth-success');
      el.classList.remove('auth-error');
    }
  }
}

// ── User Dropdown ─────────────────────────────────────────────
function toggleUserDropdown() {
  const d = document.getElementById('user-dropdown');
  if (d) d.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('nav-user-menu');
  const dropdown = document.getElementById('user-dropdown');
  if (menu && !menu.contains(e.target)) {
    dropdown?.classList.add('hidden');
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAuthModal();
});

// ── Init auth UI on page load ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Only init if Supabase is configured (not placeholder)
  if (typeof getSupabase === 'function') {
    try {
      initAuthUI();
    } catch (err) {
      console.warn('Supabase not configured yet. Set your credentials in supabase-client.js');
    }
  }
});
