const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const header = document.querySelector('[data-header]');

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(willOpen));
    navigation.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => event.key === 'Escape' && closeMenu());
}

const updateHeader = () => header?.classList.toggle('is-stuck', window.scrollY > 120);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

document.querySelectorAll('[data-asset]').forEach((slot) => {
  const image = slot.querySelector('img');
  if (!image) return;

  const showImage = () => slot.classList.add('has-image');
  const showPlaceholder = () => slot.classList.remove('has-image');
  image.addEventListener('load', showImage);
  image.addEventListener('error', showPlaceholder);

  if (image.complete) {
    image.naturalWidth > 0 ? showImage() : showPlaceholder();
  }
});

document.querySelectorAll('[data-hero-stage]').forEach((stage) => {
  const layerImages = Array.from(stage.querySelectorAll('[data-hero-layer]'));
  const characters = Array.from(stage.querySelectorAll('[data-repel]'));
  const canFloat = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let loadedCount = 0;
  let failedCount = 0;

  const markReady = () => {
    if (loadedCount > 0) stage.classList.add('has-ready-layers');
    if (failedCount === layerImages.length) stage.classList.add('is-unavailable');
  };

  layerImages.forEach((image) => {
    const onLoad = () => {
      loadedCount += 1;
      image.closest('[data-repel]')?.classList.add('has-image');
      markReady();
    };

    const onError = () => {
      failedCount += 1;
      const character = image.closest('[data-repel]');
      character?.classList.add('is-missing');
      markReady();
    };

    image.addEventListener('load', onLoad, { once: true });
    image.addEventListener('error', onError, { once: true });

    if (image.complete) {
      image.naturalWidth > 0 ? onLoad() : onError();
    }
  });

  if (!canFloat || reduceMotion || characters.length === 0) return;

  let rafId = 0;
  let pointerX = 0;
  let pointerY = 0;

  const resetRepel = () => {
    characters.forEach((character) => {
      character.style.setProperty('--repel-x', '0px');
      character.style.setProperty('--repel-y', '0px');
    });
  };

  const applyRepel = () => {
    rafId = 0;

    characters.forEach((character) => {
      if (character.classList.contains('is-missing')) return;

      const rect = character.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = centerX - pointerX;
      const deltaY = centerY - pointerY;
      const distance = Math.hypot(deltaX, deltaY);
      const radius = Number(character.style.getPropertyValue('--hero-radius')) || 160;

      if (distance > radius || distance === 0) {
        character.style.setProperty('--repel-x', '0px');
        character.style.setProperty('--repel-y', '0px');
        return;
      }

      const force = (1 - distance / radius) ** 2;
      const maxOffset = 18;
      const offsetX = (deltaX / distance) * force * maxOffset;
      const offsetY = (deltaY / distance) * force * maxOffset;

      character.style.setProperty('--repel-x', `${offsetX.toFixed(2)}px`);
      character.style.setProperty('--repel-y', `${offsetY.toFixed(2)}px`);
    });
  };

  stage.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!rafId) rafId = window.requestAnimationFrame(applyRepel);
  });

  stage.addEventListener('pointerleave', resetRepel);
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('[data-year]').forEach((target) => {
  target.textContent = new Date().getFullYear();
});
