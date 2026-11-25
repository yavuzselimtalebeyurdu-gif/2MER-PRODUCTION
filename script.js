(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

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

  let toastTimer;
  function toast(message) {
    const node = $('.toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('show'), 3600);
  }

  // Ana sayfadaki stüdyo videosu: sessiz otomatik oynatma ve kullanıcı denetimi.
  const heroVideo = $('.hero-video');
  const videoToggle = $('[data-video-toggle]');
  if (heroVideo && videoToggle) {
    const syncVideoButton = () => {
      const paused = heroVideo.paused;
      videoToggle.textContent = paused ? '▶' : 'Ⅱ';
      videoToggle.setAttribute('aria-label', paused ? 'Videoyu oynat' : 'Videoyu duraklat');
    };
    videoToggle.addEventListener('click', async () => {
      if (heroVideo.paused) {
        try { await heroVideo.play(); } catch (_) { toast('Video şu anda oynatılamıyor.'); }
      } else heroVideo.pause();
      syncVideoButton();
    });
    heroVideo.addEventListener('play', syncVideoButton);
    heroVideo.addEventListener('pause', syncVideoButton);
    heroVideo.addEventListener('error', () => toast('Stüdyo videosu yüklenemedi. Biraz sonra tekrar deneyebilirsin.'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) heroVideo.pause();
  }

  // Yardım kartı seçilince formun konu alanını doldur.
  const helpTopic = $('#helpTopic');
  $$('[data-topic-choice]').forEach(button => {
    button.addEventListener('click', () => {
      if (!helpTopic) return;
      helpTopic.value = button.dataset.topicChoice;
      $$('.help-topic').forEach(item => item.classList.toggle('selected', item === button));
      helpTopic.focus();
      helpTopic.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // MP3 oynatıcıları: kendi dosyalarını /audio klasörüne ekleyebilirsin.
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
      if (status) status.textContent = 'Kayıt dosyası henüz eklenmedi.';
      play.title = 'Kayıt dosyası henüz eklenmedi';
    });
    audio.addEventListener('timeupdate', () => {
      current.textContent = formatTime(audio.currentTime);
      if (seek && Number.isFinite(audio.duration) && audio.duration > 0) seek.value = String((audio.currentTime / audio.duration) * 100);
    });
    audio.addEventListener('ended', () => {
      play.classList.remove('is-playing');
      play.setAttribute('aria-label', 'Yeniden çal');
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
          if (status) status.textContent = 'Şu anda dinleniyor.';
        } catch (_) {
          if (status) status.textContent = 'Bu kayıt henüz siteye eklenmedi.';
          toast('Dinlemek için önce ilgili MP3 dosyasını eklemelisin.');
        }
      } else {
        audio.pause();
        play.classList.remove('is-playing');
        if (status) status.textContent = 'Duraklatıldı.';
      }
    });
    seek?.addEventListener('input', () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    });
    volume?.addEventListener('click', () => {
      audio.muted = !audio.muted;
      volume.style.opacity = audio.muted ? '.45' : '1';
      volume.setAttribute('aria-label', audio.muted ? 'Sesi aç' : 'Sesi kapat');
    });
  });

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
      $$('[data-toggle-password]', form).forEach(button => button.setAttribute('aria-label', check.checked ? 'Şifreyi gizle' : 'Şifreyi göster'));
    });
  });

  // Hesap ekranları şu an arayüz örneği; şifre hiçbir yerde saklanmaz veya gönderilmez.
  $$('[data-auth-demo]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const status = $('[data-auth-status]', form);
      if (form.dataset.authDemo === 'register') {
        const password = $('[name="password"]', form);
        const confirm = $('[name="confirmPassword"]', form);
        if (password.value !== confirm.value) {
          status.textContent = 'Şifre alanları birbiriyle aynı değil.';
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
        const terms = $('[name="termsAccepted"]', form);
        if (terms && !terms.checked) {
          status.textContent = 'Devam etmek için kullanım koşullarını kabul etmelisin.';
          status.className = 'form-status error';
          terms.focus();
          return;
        }
      }
      status.textContent = 'Hesap sistemi henüz etkin değil. Form şu anda hesap açmaz; şifren kaydedilmedi ve gönderilmedi.';
      status.className = 'form-status';
      toast('Hesap sistemi henüz etkin değil.');
    });
  });

  // İletişim ve destek formu: mevcut EmailJS bağlantısı korunmuştur.
  const contactForm = $('#contactForm');
  if (contactForm) {
    const status = $('#contactStatus');
    const EMAILJS_PUBLIC_KEY = 'MM7t6-PsQPFuSQEpP';
    const EMAILJS_SERVICE_ID = 'service_y9f33go';
    const EMAILJS_TEMPLATE_ID = 'template_915c637';
    if (window.emailjs) {
      try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (_) { }
    }
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      if (!window.emailjs) {
        status.textContent = 'E-posta bağlantısı yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.';
        status.className = 'form-status error';
        return;
      }
      const submit = $('button[type="submit"]', contactForm);
      const data = new FormData(contactForm);
      const payload = {
        from_name: String(data.get('from_name') || '').trim(),
        reply_to: String(data.get('reply_to') || '').trim(),
        message: `Yardım konusu: ${String(data.get('topic') || 'Belirtilmedi')}\n\n${String(data.get('message') || '').trim()}`
      };
      submit.disabled = true;
      submit.textContent = 'Gönderiliyor...';
      status.textContent = 'Mesajın iletiliyor...';
      status.className = 'form-status';
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
        contactForm.reset();
        $$('.help-topic').forEach(item => item.classList.remove('selected'));
        status.textContent = 'Mesajın başarıyla iletildi. Teşekkür ederiz.';
        status.className = 'form-status success';
      } catch (_) {
        status.textContent = 'Mesaj gönderilemedi. Biraz sonra yeniden dene veya e-posta şablonunu kontrol et.';
        status.className = 'form-status error';
      } finally {
        submit.disabled = false;
        submit.innerHTML = 'Talebi gönder <span>↗</span>';
      }
    });
  }
})();
