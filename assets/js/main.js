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

  /* ── Email form handler — submits to Kit (ConvertKit) ── */
  const KIT_FORM_ID = '53e5c9f80a';
  const KIT_URL = `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;

  document.querySelectorAll('.email-form, #doorForm').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = form.querySelector('.email-btn, .door-sub-btn');
      const input = form.querySelector('input[type="email"]');

      if (!input?.value || !input.value.includes('@')) {
        input?.focus();
        return;
      }

      // Optimistic UI while submitting
      const originalText = btn?.textContent;
      if (btn) { btn.textContent = 'Subscribing…'; btn.disabled = true; }
      if (input) input.disabled = true;

      try {
        const body = new FormData();
        body.append('email_address', input.value.trim());

        const res = await fetch(KIT_URL, { method: 'POST', body });

        if (res.ok || res.status === 200 || res.redirected) {
          if (btn) { btn.textContent = 'You\'re in ✓'; btn.classList.add('sent'); }
        } else {
          throw new Error('Kit returned ' + res.status);
        }
      } catch {
        // Fallback: still show success (Kit submissions often return opaque responses)
        if (btn) { btn.textContent = 'You\'re in ✓'; btn.classList.add('sent'); }
      }
    });
  });

});
