/* ============================================================
   MIA MAI LIMITED — index.js
   ============================================================ */

const EMAILJS_PUBLIC_KEY  = 'fffh_hbd3HcoTb5SW';
const EMAILJS_SERVICE_ID  = 'service_kxwwesm';
const EMAILJS_TEMPLATE_ID = 'template_2b3xmwh';

/* ===== INIT EMAILJS ONCE on page load ===== */
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  console.log('✅ EmailJS initialised');
} else {
  console.warn('⚠️ EmailJS SDK not loaded — check the <script> tag in contact.html');
}


/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (!navbar) return;
  const isHomePage = document.getElementById('home') !== null;
  if (isHomePage) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  } else {
    navbar.classList.add('scrolled');
  }
}

handleNavbarScroll();
window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* ===== HAMBURGER MENU ===== */
const hamburger         = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

if (hamburger && navLinksContainer) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });
  navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });
}


/* ===== ACTIVE NAV LINK ===== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  link.classList.remove('active');
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});


/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.parentElement;
    if (parent) {
      parent.querySelectorAll('.reveal').forEach((el, idx) => {
        el.style.transitionDelay = (idx * 0.09) + 's';
      });
    }
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .product-images, .portfolio-card, .sector-badge, .why-item, .stat-card, .value-item, .contact-item'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});


/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  if (isNaN(target)) return;
  const increment = Math.ceil(target / (1800 / 16));
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
    });
  }, { threshold: 0.3 }).observe(statsSection);
}


/* ===== SERVICE CARD HOVER ===== */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.background  = 'rgba(200,168,75,0.12)';
    card.style.borderColor = 'rgba(200,168,75,0.4)';
    card.style.transform   = 'translateY(-4px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.background  = '';
    card.style.borderColor = '';
    card.style.transform   = '';
  });
});


/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');

function setError(inputId, errorId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (inp) inp.classList.add('error');
  if (err) err.textContent = msg;
}

function clearError(inputId, errorId) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (inp) inp.classList.remove('error');
  if (err) err.textContent = '';
}

function showFormMessage(successEl, type, text) {
  if (!successEl) return;
  successEl.textContent = text;
  if (type === 'success') {
    successEl.style.background  = 'rgba(74,232,138,0.1)';
    successEl.style.borderColor = 'rgba(74,232,138,0.4)';
    successEl.style.color       = '#1A7A40';
  } else {
    successEl.style.background  = 'rgba(232,74,74,0.1)';
    successEl.style.borderColor = 'rgba(232,74,74,0.4)';
    successEl.style.color       = '#9A1A1A';
  }
  successEl.classList.add('visible');
  setTimeout(() => {
    successEl.classList.remove('visible');
    successEl.removeAttribute('style');
  }, 6000);
}

function validateForm() {
  let valid = true;
  clearError('fullName', 'nameError');
  clearError('email',    'emailError');
  clearError('message',  'messageError');

  const name    = (document.getElementById('fullName')  || {}).value?.trim() || '';
  const email   = (document.getElementById('email')     || {}).value?.trim() || '';
  const message = (document.getElementById('message')   || {}).value?.trim() || '';

  if (!name || name.length < 2) {
    setError('fullName', 'nameError', name ? 'Name must be at least 2 characters.' : 'Please enter your full name.');
    valid = false;
  }
  if (!email) {
    setError('email', 'emailError', 'Please enter your email address.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'emailError', 'Please enter a valid email address.');
    valid = false;
  }
  if (!message || message.length < 10) {
    setError('message', 'messageError', message ? 'Message must be at least 10 characters.' : 'Please enter your message.');
    valid = false;
  }
  return valid;
}

[['fullName','nameError'], ['email','emailError'], ['message','messageError']].forEach(([id, errId]) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id, errId));
});

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm()) return;

    const btn       = document.getElementById('submitBtn');
    const btnText   = btn ? btn.querySelector('.btn-text')    : null;
    const btnLoad   = btn ? btn.querySelector('.btn-loading') : null;
    const successEl = document.getElementById('formSuccess');

    if (btn)     btn.disabled          = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoad) btnLoad.style.display = 'inline';

    // Variable names match exactly the EmailJS template: {{name}}, {{message}}, {{time}}
    const now = new Date();
    const templateParams = {
      name:    document.getElementById('fullName')?.value?.trim() || '',
      email:   document.getElementById('email')?.value?.trim()    || '',
      phone:   document.getElementById('phone')?.value?.trim()    || 'Not provided',
      subject: document.getElementById('subject')?.value          || 'General Enquiry',
      message: document.getElementById('message')?.value?.trim()  || '',
      time:    now.toLocaleString('en-KE', {
                 weekday: 'short', year: 'numeric', month: 'short',
                 day: 'numeric', hour: '2-digit', minute: '2-digit'
               }),
    };

    console.log('📧 Sending with params:', templateParams);
    console.log('Service:', EMAILJS_SERVICE_ID, '| Template:', EMAILJS_TEMPLATE_ID);

    try {
      const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      console.log('✅ EmailJS success:', response.status, response.text);
      showFormMessage(successEl, 'success', '✅ Thank you! We\'ll get back to you within 24 hours.');
      form.reset();

    } catch (error) {
      console.error('❌ EmailJS failed:', error);
      console.error('Status:', error.status);
      console.error('Text:', error.text);
      showFormMessage(
        successEl,
        'error',
        `❌ Error ${error.status || ''}: ${error.text || 'Message failed to send.'} — email us at info@miamilimited.com`
      );
    } finally {
      if (btn)     btn.disabled          = false;
      if (btnText) btnText.style.display = 'inline';
      if (btnLoad) btnLoad.style.display = 'none';
    }
  });
}