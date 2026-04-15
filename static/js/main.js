/* ============================================================
   SaforaTech — Main JavaScript
   Dark/Light Mode | Bengali/English | Interactions
   ============================================================ */

// ── Translation Data ─────────────────────────────────────────
const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_services: "Services",
    nav_pricing: "Pricing",
    nav_blog: "Blog",
    nav_contact: "Contact",
    nav_cta: "Get Quote",
    hero_badge: "✨ Let's Build Your Dream with SaforaTech",
    hero_title_1: "Empowering Business",
    hero_title_2: "with Technology",
    hero_desc: "SaforaTech provides complete IT infrastructure, networking, server solutions, CCTV, cloud services and IT consultancy for businesses across Bangladesh.",
    hero_btn1: "Our Services",
    hero_btn2: "Contact Us",
    stat_projects: "Projects Done",
    stat_clients: "Happy Clients",
    stat_services: "Service Types",
    stat_satisfaction: "Satisfaction",
    services_tag: "What We Offer",
    services_title: "Complete IT Solutions",
    services_desc: "From network setup to cloud migration — we handle all your technology needs under one roof.",
    pricing_tag: "Pricing Plans",
    pricing_title: "Simple, Transparent Pricing",
    pricing_desc: "Choose a plan that fits your business size and requirements.",
    contact_tag: "Get In Touch",
    contact_title: "Let's Work Together",
    contact_desc: "Tell us about your IT needs and we'll get back to you within 24 hours.",
    form_name: "Full Name",
    form_email: "Email Address",
    form_phone: "Phone Number",
    form_subject: "Subject",
    form_message: "Your Message",
    form_submit: "Send Message",
    footer_tagline: "Smart IT Solutions for Smart Business",
    footer_copy: "© 2026 SaforaTech. All rights reserved.",
    announcement: "🚀 New: 24/7 Remote IT Support now available for all plans! Learn more →",
    whatsapp_tooltip: "Chat on WhatsApp",
    most_popular: "Most Popular",
  },
  bn: {
    nav_home: "হোম",
    nav_about: "আমাদের সম্পর্কে",
    nav_services: "সার্ভিস",
    nav_pricing: "মূল্য",
    nav_blog: "ব্লগ",
    nav_contact: "যোগাযোগ",
    nav_cta: "কোটেশন নিন",
    hero_badge: "✨ SaforaTech দিয়ে গড়ুন আপনার স্বপ্নের ব্যবসা",
    hero_title_1: "প্রযুক্তি দিয়ে ব্যবসাকে",
    hero_title_2: "করুন শক্তিশালী",
    hero_desc: "SaforaTech বাংলাদেশের ব্যবসায়িক প্রতিষ্ঠানগুলোকে সম্পূর্ণ আইটি অবকাঠামো, নেটওয়ার্কিং, সার্ভার সমাধান, সিসিটিভি, ক্লাউড সেবা এবং আইটি পরামর্শ প্রদান করে।",
    hero_btn1: "আমাদের সার্ভিস",
    hero_btn2: "যোগাযোগ করুন",
    stat_projects: "সম্পন্ন প্রজেক্ট",
    stat_clients: "সন্তুষ্ট ক্লায়েন্ট",
    stat_services: "সার্ভিস ধরন",
    stat_satisfaction: "সন্তুষ্টি হার",
    services_tag: "আমরা কী দিই",
    services_title: "সম্পূর্ণ আইটি সমাধান",
    services_desc: "নেটওয়ার্ক সেটআপ থেকে ক্লাউড মাইগ্রেশন — সব প্রযুক্তির সমস্যা একটি ছাদের নিচে সমাধান।",
    pricing_tag: "মূল্য পরিকল্পনা",
    pricing_title: "সহজ, স্বচ্ছ মূল্য",
    pricing_desc: "আপনার ব্যবসার আকার ও প্রয়োজন অনুযায়ী পরিকল্পনা বেছে নিন।",
    contact_tag: "যোগাযোগ করুন",
    contact_title: "একসাথে কাজ করি",
    contact_desc: "আপনার আইটি সমস্যার কথা জানান, আমরা ২৪ ঘণ্টার মধ্যে সাড়া দেব।",
    form_name: "পূর্ণ নাম",
    form_email: "ইমেইল ঠিকানা",
    form_phone: "ফোন নম্বর",
    form_subject: "বিষয়",
    form_message: "আপনার বার্তা",
    form_submit: "বার্তা পাঠান",
    footer_tagline: "স্মার্ট আইটি সমাধান স্মার্ট ব্যবসার জন্য",
    footer_copy: "© ২০২৬ SaforaTech। সকল অধিকার সংরক্ষিত।",
    announcement: "🚀 নতুন: সব প্ল্যানে এখন ২৪/৭ রিমোট আইটি সাপোর্ট পাওয়া যাচ্ছে! আরো জানুন →",
    whatsapp_tooltip: "WhatsApp-এ চ্যাট করুন",
    most_popular: "সবচেয়ে জনপ্রিয়",
  }
};

// ── State ────────────────────────────────────────────────────
let currentLang = localStorage.getItem('st_lang') || 'en';
let currentTheme = localStorage.getItem('st_theme') || 'light';

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLang(currentLang);
  initNavbar();
  initScrollAnimations();
  initFAQ();
  initForms();
  initScrollTop();
  initParticles();
  initSlider();
  hideLoader();
});

// ── Theme ─────────────────────────────────────────────────────
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('st_theme', theme);

  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';

  const toggleBtns = document.querySelectorAll('[data-theme-btn]');
  toggleBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeBtn === theme);
  });
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// ── Language ─────────────────────────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('st_lang', lang);

  document.documentElement.lang = lang;
  document.body.classList.toggle('lang-bn', lang === 'bn');

  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Update lang toggle buttons
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function switchLang(lang) {
  applyLang(lang);
}

// ── Navbar ───────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.id;
      }
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}` || a.getAttribute('href') === `/${current}`);
    });
  });

  // Mobile menu
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    navLinks?.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)', spans[1].style.opacity = '0', spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
      : (spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; }));
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks?.classList.remove('open'));
  });
}

// ── Scroll Animations ────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── FAQ ──────────────────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ── Contact Form ─────────────────────────────────────────────
function initForms() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '⏳ Sending...';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res = await fetch('/api/contact', { method: 'POST', body: data });
      const json = await res.json();

      if (json.success) {
        showToast('✅ Message sent successfully!', 'success');
        form.reset();
      } else {
        showToast('❌ Failed to send. Try again.', 'error');
      }
    } catch {
      showToast('❌ Network error. Try again.', 'error');
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
}

// ── Toast ────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Scroll to Top ─────────────────────────────────────────────
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Page Loader ───────────────────────────────────────────────
function hideLoader() {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
}

// ── Floating Particles (Hero) ─────────────────────────────────
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Add second orb div
  const orb2 = document.createElement('div');
  orb2.className = 'hero-orb-2';
  hero.appendChild(orb2);

  // Create subtle floating particles
  const colors = ['rgba(0,87,255,0.4)', 'rgba(0,198,255,0.35)', 'rgba(0,212,170,0.3)'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 3;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 6}s;
    `;
    hero.appendChild(p);
  }
}



// ── Announcement Bar ──────────────────────────────────────────
function closeAnnouncement() {
  const bar = document.querySelector('.announcement-bar');
  if (bar) {
    bar.style.height = bar.offsetHeight + 'px';
    requestAnimationFrame(() => {
      bar.style.transition = 'height 0.3s ease, opacity 0.3s ease';
      bar.style.height = '0';
      bar.style.opacity = '0';
      bar.style.overflow = 'hidden';
    });
  }
}

// ── Number Counter Animation ──────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

// Observer for counter
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Hero Slider ───────────────────────────────────────────────
let currentSlide = 0;
const TOTAL_SLIDES = 3;
let sliderTimer = null;

function goSlide(n) {
  const prev = document.getElementById('slide-' + currentSlide);
  const next = document.getElementById('slide-' + n);
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (!prev || !next) return;
  prev.classList.remove('slide-active');
  next.classList.add('slide-active');
  dots.forEach((d, i) => d.classList.toggle('active', i === n));
  currentSlide = n;
  restartSliderTimer();
}

function nextSlide() {
  goSlide((currentSlide + 1) % TOTAL_SLIDES);
}

function restartSliderTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, 4500);
}

function initSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  restartSliderTimer();

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
  slider.addEventListener('mouseleave', restartSliderTimer);

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? goSlide((currentSlide+1)%TOTAL_SLIDES) : goSlide((currentSlide+TOTAL_SLIDES-1)%TOTAL_SLIDES);
  });
}

