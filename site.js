(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? 'Kapat ×' : 'Menü ☰';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = 'Menü ☰';
    }));
  }
  const year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();

  const progress = document.querySelector('.page-progress');
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const caption = document.getElementById('lightbox-caption');
  const close = document.querySelector('.lightbox-close');
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImg) lightboxImg.src = '';
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.photo-card').forEach(card => card.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) return;
    const image = card.dataset.full || card.querySelector('img')?.src;
    lightboxImg.src = image;
    lightboxImg.alt = card.querySelector('img')?.alt || 'Tarihî mimari';
    if (caption) caption.textContent = card.dataset.caption || card.querySelector('span')?.textContent || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }));
  if (close) close.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    const button = document.getElementById('contact-submit');
    const status = document.getElementById('contact-status');
    const setStatus = (kind, message) => { if (status) { status.className = 'form-status ' + kind; status.textContent = message; } };
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!window.emailjs) { setStatus('error', 'E-posta servisi yüklenemedi. Sayfayı yenileyip tekrar dene.'); return; }
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      if (!name || !email || !message) { setStatus('error', 'Lütfen tüm alanları doldur.'); return; }
      if (button) { button.disabled = true; button.textContent = 'Gönderiliyor…'; }
      setStatus('', 'Mesajın Divan-ı Âli’ye iletiliyor…');
      try {
        emailjs.init({ publicKey: 'MM7t6-PsQPFuSQEpP' });
        await emailjs.send('service_y9f33go', 'template_915c637', { from_name: name, reply_to: email, message });
        setStatus('success', 'Mesajın başarıyla gönderildi. Teşekkür ederiz.');
        form.reset();
      } catch (err) {
        console.error('EmailJS gönderim hatası:', err);
        setStatus('error', 'Mesaj gönderilemedi. Biraz sonra yeniden deneyebilirsin.');
      } finally {
        if (button) { button.disabled = false; button.textContent = 'Mesajı gönder'; }
      }
    });
  }
})();
