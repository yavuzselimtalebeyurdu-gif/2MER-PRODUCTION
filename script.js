(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Footer year
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Mobile navigation
  const menuButton = $('.menu-toggle');
  const nav = $('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    $$('a', nav).forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll reveal
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  // Toast
  let toastTimer;
  function toast(message) {
    const node = $('.toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 3600);
  }

  // Simple HTML audio players; add the user's own MP3 files in /audio.
  let currentlyPlaying = null;
  $$('[data-track-card]').forEach(card => {
    const audio = $('audio', card);
    const play = $('[data-play]', card);
    const seek = $('[data-seek]', card);
    const current = $('[data-current]', card);
    const duration = $('[data-duration]', card);
    const status = $('[data-track-status]', card);
    const volume = $('[data-volume]', card);
    if (!audio || !play) return;

    const formatTime = seconds => {
      if (!Number.isFinite(seconds)) return '00:00';
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    };
    audio.addEventListener('loadedmetadata', () => {
      duration.textContent = formatTime(audio.duration);
      if (status) status.textContent = 'Dinlemeye hazır.';
    });
    audio.addEventListener('error', () => {
      if (status) status.textContent = 'MP3 bekleniyor — audio klasörüne dosya ekle.';
      play.title = 'MP3 dosyası henüz eklenmedi';
    });
    audio.addEventListener('timeupdate', () => {
      current.textContent = formatTime(audio.currentTime);
      if (seek && Number.isFinite(audio.duration) && audio.duration > 0) {
        seek.value = String((audio.currentTime / audio.duration) * 100);
      }
    });
    audio.addEventListener('ended', () => {
      play.classList.remove('is-playing');
      play.setAttribute('aria-label', 'Tekrar çal');
    });
    play.addEventListener('click', async () => {
      if (currentlyPlaying && currentlyPlaying !== audio) {
        currentlyPlaying.pause();
        const oldCard = currentlyPlaying.closest('[data-track-card]');
        $('[data-play]', oldCard)?.classList.remove('is-playing');
      }
      if (audio.paused) {
        try {
          await audio.play();
          currentlyPlaying = audio;
          play.classList.add('is-playing');
          if (status) status.textContent = 'Şimdi çalıyor.';
        } catch (error) {
          if (status) status.textContent = 'Bu demo için MP3 dosyası henüz yüklenmedi.';
          toast('MP3 dosyası henüz eklenmemiş. audio klasörüne ilgili dosyayı koy.');
        }
      } else {
        audio.pause();
        play.classList.remove('is-playing');
        if (status) status.textContent = 'Duraklatıldı.';
      }
    });
    seek?.addEventListener('input', () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (Number(seek.value) / 100) * audio.duration;
      }
    });
    volume?.addEventListener('click', () => {
      audio.muted = !audio.muted;
      volume.style.opacity = audio.muted ? '.45' : '1';
      volume.setAttribute('aria-label', audio.muted ? 'Sesi aç' : 'Sesi kapat');
    });
  });

  // Password visibility controls (register and login pages)
  $$('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('input');
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      button.setAttribute('aria-label', input.type === 'password' ? 'Şifreyi göster' : 'Şifreyi gizle');
      button.textContent = input.type === 'password' ? '◉' : '◎';
    });
  });
  $$('[data-show-all]').forEach(check => {
    check.addEventListener('change', () => {
      const form = check.closest('form');
      $$('input[type="password"], input[type="text"]', form).forEach(input => {
        if (input.name.toLowerCase().includes('password')) input.type = check.checked ? 'text' : 'password';
      });
      $$('[data-toggle-password]', form).forEach(button => {
        button.setAttribute('aria-label', check.checked ? 'Şifreyi gizle' : 'Şifreyi göster');
      });
    });
  });

  // Account form UI only. Never store passwords in browser storage.
  $$('[data-auth-demo]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const status = $('[data-auth-status]', form);
      if (form.dataset.authDemo === 'register') {
        const password = $('[name="password"]', form);
        const confirm = $('[name="confirmPassword"]', form);
        if (password.value !== confirm.value) {
          status.textContent = 'Şifre alanları birbiriyle eşleşmiyor.';
          status.className = 'form-status error';
          confirm.focus();
          return;
        }
        if (password.value.length < 8) {
          status.textContent = 'Şifren en az 8 karakter olmalı.';
          status.className = 'form-status error';
          password.focus();
          return;
        }
      }
      status.textContent = 'Tasarım hazır. Gerçek kayıt ve giriş işlemleri için güvenli sunucu / kimlik doğrulama servisi henüz bağlanmadı. Şifren bu sayfada saklanmaz veya gönderilmez.';
      status.className = 'form-status';
      toast('Hesap sistemi henüz sunucuya bağlanmadı.');
    });
  });

  // Contact form: EmailJS integration is configured with the existing public project keys.
  const contactForm = $('#contactForm');
  if (contactForm) {
    const status = $('#contactStatus');
    const EMAILJS_PUBLIC_KEY = 'MM7t6-PsQPFuSQEpP';
    const EMAILJS_SERVICE_ID = 'service_y9f33go';
    const EMAILJS_TEMPLATE_ID = 'template_915c637';
    if (window.emailjs) {
      try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (_) { /* initialized on submit if needed */ }
    }
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      if (!window.emailjs) {
        status.textContent = 'E-posta servisi yüklenemedi. İnternet bağlantını kontrol edip tekrar dene.';
        status.className = 'form-status error';
        return;
      }
      const submit = $('button[type="submit"]', contactForm);
      const data = new FormData(contactForm);
      const payload = {
        from_name: String(data.get('from_name') || '').trim(),
        reply_to: String(data.get('reply_to') || '').trim(),
        message: `Konu: ${String(data.get('topic') || 'Genel iletişim')}\n\n${String(data.get('message') || '').trim()}`
      };
      submit.disabled = true;
      submit.textContent = 'Gönderiliyor...';
      status.textContent = 'Mesajın gönderiliyor...';
      status.className = 'form-status';
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
        contactForm.reset();
        status.textContent = 'Mesajın başarıyla gönderildi. Teşekkürler!';
        status.className = 'form-status success';
      } catch (error) {
        status.textContent = 'Mesaj gönderilemedi. EmailJS şablonundaki from_name, reply_to ve message alanlarını kontrol et.';
        status.className = 'form-status error';
      } finally {
        submit.disabled = false;
        submit.innerHTML = 'Mesajı gönder <span>↗</span>';
      }
    });
  }
})();
