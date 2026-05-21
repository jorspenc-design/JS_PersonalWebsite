/* Joshua Spence — joshuaspence.com */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav scroll state ── */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger ── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  hamburger?.addEventListener('click', () => {
    const open = mobileNav?.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Active nav link ── */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Scroll animations (fade-up + stagger) ── */
  const animationTargets = document.querySelectorAll('.fade-up, .stagger');
  if (animationTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    animationTargets.forEach(el => observer.observe(el));
  }

  /* ── Email form handler — Kit v3 API ── */
  const KIT_API_KEY = 'aFLElxvV-4xDYVRnpbCtOA';
  const KIT_FORM_ID = '9468211';

  document.querySelectorAll('.email-form, #doorForm').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('.email-btn, .door-sub-btn');

      if (!input?.value || !input.value.includes('@')) {
        input?.focus();
        return;
      }

      if (btn) { btn.textContent = 'Subscribing…'; btn.disabled = true; }

      try {
        const res = await fetch(`https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ api_key: KIT_API_KEY, email: input.value.trim() })
        });
        const data = await res.json();
        if (data.subscription) {
          if (btn)   { btn.textContent = "You're in ✓"; btn.classList.add('sent'); }
          if (input) { input.disabled = true; }
        } else {
          throw new Error('No subscription returned');
        }
      } catch {
        if (btn) { btn.textContent = 'Try again'; btn.disabled = false; }
      }
    });
  });

});
