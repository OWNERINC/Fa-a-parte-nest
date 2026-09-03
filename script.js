if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      "stroke-width": 1.6,
    },
  });
}

const heroTitle = document.querySelector('.hero__title');
const prefersReducedMotionInit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroTitle && !prefersReducedMotionInit) {
  const makeWordSpan = (text) => {
    const outer = document.createElement('span');
    outer.className = 'word';
    const inner = document.createElement('span');
    inner.className = 'word-inner';
    inner.textContent = text;
    outer.appendChild(inner);
    return outer;
  };

  const nodes = Array.from(heroTitle.childNodes);
  heroTitle.innerHTML = '';

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (part.trim() === '') {
          if (part.length) heroTitle.appendChild(document.createTextNode(part));
        } else {
          heroTitle.appendChild(makeWordSpan(part));
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
      heroTitle.appendChild(document.createElement('br'));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const outer = document.createElement('span');
      outer.className = 'word';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.appendChild(node.cloneNode(true));
      outer.appendChild(inner);
      heroTitle.appendChild(outer);
    }
  });

  heroTitle.querySelectorAll('.word-inner').forEach((word, index) => {
    word.style.transitionDelay = `${index * 45}ms`;
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroTitle.classList.add('is-revealed');
    });
  });
}

const siteHeader = document.querySelector('[data-site-header]');

if (siteHeader) {
  const setScrolled = () => {
    siteHeader.classList.toggle('site-header--scrolled', window.scrollY > 12);
  };

  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });
}

const scrollProgress = document.querySelector('[data-scroll-progress]');

if (scrollProgress) {
  const setProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };

  setProgress();
  window.addEventListener('scroll', setProgress, { passive: true });
  window.addEventListener('resize', setProgress);
}

const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.getElementById('site-nav');
const navScrim = document.querySelector('[data-nav-scrim]');

if (navToggle && siteNav) {
  const closeNav = () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    navScrim?.classList.remove('is-visible');
    document.body.classList.remove('nav-open');
  };

  const openNav = () => {
    siteNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Fechar menu');
    navScrim?.classList.add('is-visible');
    document.body.classList.add('nav-open');
  };

  navToggle.addEventListener('click', () => {
    if (siteNav.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  navScrim?.addEventListener('click', closeNav);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('.youtube-card').forEach((card) => {
  const videoId = card.dataset.youtubeId;
  const embedSrc = card.dataset.embedSrc;

  const withAutoplay = (url) => {
    const parsed = new URL(url, window.location.href);
    parsed.searchParams.set('autoplay', '1');
    parsed.searchParams.set('rel', '0');
    return parsed.toString();
  };

  const loadVideo = () => {
    if (card.querySelector('iframe')) return;

    if (!embedSrc && !videoId) return;

    const iframe = document.createElement('iframe');
    iframe.title = 'Video NEST no YouTube';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';

    if (embedSrc) {
      iframe.src = withAutoplay(embedSrc);
    } else {
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&autoplay=1`;
    }

    card.appendChild(iframe);
    card.classList.add('is-playing');
  };

  card.addEventListener('click', loadVideo);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      loadVideo();
    }
  });
});

document.querySelectorAll('.youtube-card__thumb').forEach((img) => {
  const videoId = img.dataset.videoId;
  const thumbs = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
  ];

  const tryNext = () => {
    const level = Number(img.dataset.fallbackLevel || '0');
    if (level >= thumbs.length) return;
    img.dataset.fallbackLevel = String(level + 1);
    img.src = thumbs[level];
  };

  img.addEventListener('error', tryNext);
  tryNext();
});

const revealItems = document.querySelectorAll('.reveal');

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const parallaxSections = document.querySelectorAll('[data-parallax]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (parallaxSections.length && !prefersReducedMotion) {
  const maxShift = 65;
  let ticking = false;

  const updateParallax = () => {
    const viewportH = window.innerHeight;

    parallaxSections.forEach((section) => {
      const media = section.querySelector('[data-parallax-media]');
      if (!media) return;

      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportH / 2;
      const progress = (sectionCenter - viewportCenter) / (viewportH / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));

      media.style.transform = `translate3d(0, ${(clamped * maxShift).toFixed(1)}px, 0)`;
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateParallax();
}

const form = document.querySelector('.lead-form');
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/14572152/4u1r0p6/';

if (form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonLabel = submitButton ? submitButton.textContent : '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      nome: formData.get('nome') || '',
      telefone: formData.get('telefone') || '',
      email: formData.get('email') || '',
      aceite: formData.get('aceite') ? 'sim' : 'nao',
      pagina: window.location.href,
      enviado_em: new Date().toISOString(),
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
    }

    try {
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });

      form.reset();
      window.alert('Recebemos seu contato! Em breve falaremos com voce no WhatsApp.');
    } catch (error) {
      window.alert('Nao foi possivel enviar agora. Tente novamente em instantes.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonLabel;
      }
    }
  });
}

const shareButton = document.querySelector('[data-share-button]');

if (shareButton) {
  shareButton.addEventListener('click', async () => {
    const shareData = {
      title: document.title,
      text: 'Conhece alguem que amaria ter essa experiencia? Da uma olhada no NEST Mountain Lodge.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // usuario cancelou o compartilhamento
      }
      return;
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        window.alert('Link copiado! Cole para compartilhar com quem voce quiser.');
        return;
      } catch (error) {
        // segue para o prompt manual abaixo
      }
    }

    window.prompt('Copie o link para compartilhar:', shareData.url);
  });
}
