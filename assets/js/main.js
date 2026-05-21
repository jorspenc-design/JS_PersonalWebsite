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

  /* ── Email form handler — submits to Kit via hidden iframe (bypasses CORS) ── */
  const KIT_URL = 'https://app.kit.com/forms/53e5c9f80a/subscriptions';

  function submitToKit(email) {
    // Create a hidden iframe so the POST doesn't navigate the page
    const iframeName = 'kit-' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Create a real form and submit it into the iframe
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = KIT_URL;
    hiddenForm.target = iframeName;

    const emailInput = document.createElement('input');
    emailInput.type = 'hidden';
    emailInput.name = 'email_address';
    emailInput.value = email;
    hiddenForm.appendChild(emailInput);

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    // Clean up after submission completes
    setTimeout(() => {
      document.body.removeChild(hiddenForm);
      document.body.removeChild(iframe);
    }, 5000);
  }

  document.querySelectorAll('.email-form, #doorForm').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn   = form.querySelector('.email-btn, .door-sub-btn');
      const input = form.querySelector('input[type="email"]');

      if (!input?.value || !input.value.includes('@')) {
        input?.focus();
        return;
      }

      submitToKit(input.value.trim());

      // Update UI immediately — Kit confirms via email to the subscriber
      if (btn)   { btn.textContent = 'You\'re in ✓'; btn.classList.add('sent'); btn.disabled = true; }
      if (input) { input.disabled = true; }
    });
  });

});
