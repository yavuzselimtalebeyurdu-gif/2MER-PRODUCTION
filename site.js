(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const topButton = document.querySelector('.to-top');
  const progress = document.querySelector('.page-progress');

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Menüyü aç');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Menüyü aç' : 'Menüyü kapat');
      nav.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('menu-open', !expanded);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const updateScrollUI = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (topButton) topButton.classList.toggle('is-visible', y > 500);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = `${pct}%`;
    }
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();
  if (topButton) topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const target = link.getAttribute('href');
    if (target === currentPage) link.setAttribute('aria-current', 'page');
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  // Accessible image lightbox: click any image carrying data-lightbox.
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.lightbox-close');
    let lastFocused = null;
    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.matches('img') ? item : item.querySelector('img');
        if (!img) return;
        lastFocused = item;
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || '';
        caption.textContent = item.dataset.caption || img.alt || '';
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeButton.focus();
      });
    });
    closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close(); });
  }

  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.style.maxHeight = isOpen ? '0px' : `${panel.scrollHeight}px`;
    });
  });

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const status = contactForm.querySelector('.form-status');
    const submit = contactForm.querySelector('[type="submit"]');
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      const trap = contactForm.querySelector('[name="website"]');
      if (trap && trap.value.trim()) return;
      if (!window.emailjs) {
        status.textContent = 'E-posta hizmeti yüklenemedi. Sayfayı yenileyip tekrar deneyin.';
        return;
      }
      const data = new FormData(contactForm);
      const params = {
        from_name: String(data.get('from_name') || '').trim(),
        reply_to: String(data.get('reply_to') || '').trim(),
        message: String(data.get('message') || '').trim()
      };
      if (!params.from_name || !params.reply_to || !params.message) {
        status.textContent = 'Lütfen tüm alanları doldurun.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.reply_to)) {
        status.textContent = 'Lütfen geçerli bir e-posta adresi yazın.';
        return;
      }
      submit.disabled = true;
      submit.dataset.originalText = submit.innerHTML;
      submit.textContent = 'GÖNDERİLİYOR…';
      status.textContent = 'Mesajınız gönderiliyor…';
      try {
        await window.emailjs.send('service_y9f33go', 'template_915c637', params);
        status.textContent = 'Mesajınız Divan-ı Hümâyun kalemine ulaştı. Teşekkür ederiz.';
        contactForm.reset();
      } catch (error) {
        console.error('EmailJS error:', error);
        status.textContent = 'Mesaj gönderilemedi. Biraz sonra tekrar deneyin.';
      } finally {
        submit.disabled = false;
        submit.innerHTML = submit.dataset.originalText || 'MESAJI GÖNDER';
      }
    });
  }
})();
