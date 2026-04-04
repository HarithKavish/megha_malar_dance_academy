const menuButton = document.querySelector('[data-menu-btn]');
const navLinks = document.querySelector('[data-nav-links]');
const siteHeader = document.querySelector('.site-header');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if (siteHeader) {
  const syncHeaderState = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 8);
  };

  syncHeaderState();
  window.addEventListener('scroll', syncHeaderState, { passive: true });
}

const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
  revealElements.forEach((el, idx) => {
    const staggerClass = `stagger-${(idx % 4) + 1}`;
    el.classList.add(staggerClass);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

document.querySelectorAll('[data-rotator]').forEach((rotator) => {
  const slides = rotator.querySelectorAll('.slide-item');
  if (slides.length === 0) {
    return;
  }

  let index = 0;
  const interval = Number(rotator.getAttribute('data-interval')) || 3200;
  slides[index].classList.add('active');

  if (slides.length === 1) {
    return;
  }

  setInterval(() => {
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
  }, interval);
});
