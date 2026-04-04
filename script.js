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

function initGalleryMasonry() {
  const grid = document.querySelector('.image-grid');
  if (!grid) {
    return;
  }

  const images = Array.from(grid.querySelectorAll('img'));
  if (images.length === 0) {
    return;
  }

  const applyMasonry = () => {
    const rowHeight = parseFloat(getComputedStyle(grid).getPropertyValue('grid-auto-rows')) || 8;
    const rowGap = parseFloat(getComputedStyle(grid).getPropertyValue('gap')) || 0;

    images.forEach((img) => {
      const span = Math.max(1, Math.ceil((img.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap)));
      img.style.gridRowEnd = `span ${span}`;
    });
  };

  images.forEach((img) => {
    if (!img.complete) {
      img.addEventListener('load', applyMasonry, { once: true });
    }
  });

  window.addEventListener('resize', applyMasonry, { passive: true });
  applyMasonry();
}

initGalleryMasonry();

// Lightbox functionality for gallery images
(function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const currentSpan = document.getElementById('lightbox-current');
  const totalSpan = document.getElementById('lightbox-total');
  
  if (!lightbox) return; // Exit if not on gallery page
  
  const galleryImages = document.querySelectorAll('.image-grid img');
  let currentIndex = 0;
  
  if (galleryImages.length > 0) {
    totalSpan.textContent = galleryImages.length;
    
    // Open lightbox on image click
    galleryImages.forEach((img, idx) => {
      img.addEventListener('click', () => {
        currentIndex = idx;
        showLightbox();
      });
    });
    
    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevious();
      if (e.key === 'ArrowRight') showNext();
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', showPrevious);
    nextBtn.addEventListener('click', showNext);
    
    function showLightbox() {
      lightboxImage.src = galleryImages[currentIndex].src;
      lightboxImage.alt = galleryImages[currentIndex].alt;
      currentSpan.textContent = currentIndex + 1;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function showPrevious() {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      showLightbox();
    }
    
    function showNext() {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      showLightbox();
    }
  }
})();
