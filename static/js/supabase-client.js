// ============================================================
// SaforaTech — Supabase Client Configuration
// ============================================================
// Replace these with your actual Supabase project credentials:
// Supabase Dashboard → Project Settings → API

const SUPABASE_URL = 'https://wayyumyglzddlkluzczb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheXl1bXlnbHpkZGxrbHV6Y3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNjg4NDEsImV4cCI6MjA5MTg0NDg0MX0.cma3WaekjPD1IVmI0YJsdl23CXoNYnqqv5dMS1NahC4';

// ── Supabase Client (loaded from CDN in HTML) ────────────────
// window.supabase is set after <script> tag loads

function getSupabase() {
  if (!window._supabaseClient) {
    window._supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return window._supabaseClient;
}

// ── Auth Helpers ─────────────────────────────────────────────

async function getCurrentUser() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const sb = getSupabase();
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).single();
  return data;
}

async function isAdmin() {
  const profile = await getCurrentProfile();
  return profile?.role === 'admin';
}

async function signInWithEmail(email, password) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signUpWithEmail(email, password, fullName) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  return { data, error };
}

async function signInWithGoogle() {
  const sb = getSupabase();
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/auth/callback' }
  });
  return { error };
}

async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
  window.location.href = '/';
}

async function resetPassword(email) {
  const sb = getSupabase();
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/auth/reset-password'
  });
  return { error };
}

// ── Blog Helpers ─────────────────────────────────────────────

async function fetchPublishedPosts(limit = 10, category = null) {
  const sb = getSupabase();
  let query = sb.from('blog_posts')
    .select(`*, profiles(full_name, avatar_url, username), blog_categories(name, name_bn, slug, color)`)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (category) query = query.eq('blog_categories.slug', category);
  const { data, error } = await query;
  return { data, error };
}

async function fetchPostBySlug(slug) {
  const sb = getSupabase();
  const { data, error } = await sb.from('blog_posts')
    .select(`*, profiles(full_name, avatar_url, username), blog_categories(name, name_bn, slug, color)`)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (data) {
    // Increment views
    await sb.from('blog_posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
  }
  return { data, error };
}

async function createPost(postData) {
  const sb = getSupabase();
  const user = await getCurrentUser();
  if (!user) return { error: { message: 'Not authenticated' } };
  const { data, error } = await sb.from('blog_posts').insert({ ...postData, author_id: user.id });
  return { data, error };
}

async function submitContactMessage(formData) {
  const sb = getSupabase();
  const { data, error } = await sb.from('contact_messages').insert(formData);
  return { data, error };
}

// ── Auth State Listener ──────────────────────────────────────
async function initAuthUI() {
  const sb = getSupabase();

  sb.auth.onAuthStateChange(async (event, session) => {
    const user = session?.user;
    updateNavAuthUI(user);

    if (event === 'SIGNED_IN') {
      // Fetch profile for role-based UI
      if (user) {
        const { data: profile } = await sb.from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          showAdminLinks();
        }
      }
    }
  });

  // Initial check
  const { data: { user } } = await sb.auth.getUser();
  updateNavAuthUI(user);
}

function updateNavAuthUI(user) {
  const loginBtn  = document.getElementById('nav-login-btn');
  const userMenu  = document.getElementById('nav-user-menu');
  const userName  = document.getElementById('nav-user-name');
  const authModal = document.getElementById('auth-modal');

  if (user) {
    loginBtn?.classList.add('hidden');
    userMenu?.classList.remove('hidden');
    if (userName) userName.textContent = user.user_metadata?.full_name?.split(' ')[0] || 'User';
    authModal?.classList.add('hidden');
  } else {
    loginBtn?.classList.remove('hidden');
    userMenu?.classList.add('hidden');
  }
}

function showAdminLinks() {
  document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
}
