// ========================================
// FLUID GLASS - Main JavaScript
// ========================================

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCustomCursor();
  initMenu();
  initTestimonials();
  initProjectHover();
  initParallax();
  initNavTitle();
  initSmoothScroll();
});

// ========================================
// SCROLL ANIMATIONS (Intersection Observer)
// ========================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

// ========================================
// CUSTOM CURSOR
// ========================================
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let cursorX = 0;
  let cursorY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Smooth cursor follow
  function animateCursor() {
    const dx = targetX - cursorX;
    const dy = targetY - cursorY;
    cursorX += dx * 0.12;
    cursorY += dy * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Show cursor on hero
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', () => {
      cursor.classList.add('visible');
      cursor.querySelector('span').textContent = 'SCROLL';
    });
    hero.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
  }

  // Show cursor on product cards
  document.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      cursor.classList.add('visible');
      cursor.querySelector('span').textContent = 'VIEW';
    });
    card.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
  });

  // Show cursor on project images
  document.querySelectorAll('.project-image').forEach((img) => {
    img.addEventListener('mouseenter', () => {
      cursor.classList.add('visible');
      cursor.querySelector('span').textContent = 'EXPLORE';
    });
    img.addEventListener('mouseleave', () => {
      cursor.classList.remove('visible');
    });
  });
}

// ========================================
// MENU
// ========================================
function initMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const menuOverlay = document.getElementById('menuOverlay');
  const hamburger = menuToggle?.querySelector('.hamburger');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (!menuToggle || !menuOverlay) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    menuOverlay.classList.toggle('active', isOpen);
    hamburger?.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', toggleMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        toggleMenu();
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    });
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggleMenu();
  });
}

// ========================================
// TESTIMONIALS CAROUSEL
// ========================================
function initTestimonials() {
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const currentEl = document.querySelector('.testimonials__current');
  const totalEl = document.querySelector('.testimonials__total');
  let current = 0;

  if (!testimonials.length) return;

  if (totalEl) totalEl.textContent = String(testimonials.length).padStart(2, '0');

  function showTestimonial(index) {
    testimonials.forEach((t) => t.classList.remove('active'));
    testimonials[index].classList.add('active');
    if (currentEl) currentEl.textContent = String(index + 1).padStart(2, '0');
  }

  prevBtn?.addEventListener('click', () => {
    current = (current - 1 + testimonials.length) % testimonials.length;
    showTestimonial(current);
  });

  nextBtn?.addEventListener('click', () => {
    current = (current + 1) % testimonials.length;
    showTestimonial(current);
  });

  // Auto-advance
  setInterval(() => {
    current = (current + 1) % testimonials.length;
    showTestimonial(current);
  }, 7000);
}

// ========================================
// PROJECT HOVER IMAGE
// ========================================
function initProjectHover() {
  const hoverImage = document.getElementById('projectHoverImage');
  const hoverImg = hoverImage?.querySelector('img');
  const projectRows = document.querySelectorAll('.project-row[data-image]');

  if (!hoverImage || !hoverImg || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let imgX = 0;
  let imgY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateHoverImage() {
    imgX += (mouseX - imgX) * 0.1;
    imgY += (mouseY - imgY) * 0.1;
    hoverImage.style.left = imgX + 'px';
    hoverImage.style.top = imgY + 'px';
    requestAnimationFrame(animateHoverImage);
  }
  animateHoverImage();

  projectRows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      const src = row.getAttribute('data-image');
      if (src) {
        hoverImg.src = src;
        hoverImage.classList.add('visible');
      }
    });

    row.addEventListener('mouseleave', () => {
      hoverImage.classList.remove('visible');
    });
  });
}

// ========================================
// PARALLAX EFFECTS
// ========================================
function initParallax() {
  const hero = document.querySelector('.hero__bg img');
  const footer = document.querySelector('.footer__bg img');

  function handleScroll() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    // Hero parallax
    if (hero) {
      const heroSection = document.querySelector('.hero');
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom > 0) {
        hero.style.transform = `scale(${1.1 - scrollY * 0.0001}) translateY(${scrollY * 0.3}px)`;
      }
    }

    // Footer parallax
    if (footer) {
      const footerSection = document.querySelector('.footer');
      const footerRect = footerSection.getBoundingClientRect();
      if (footerRect.top < windowH) {
        const progress = (windowH - footerRect.top) / (windowH + footerRect.height);
        footer.style.transform = `translateY(${-progress * 80}px)`;
      }
    }

    // Showroom sticky effect
    const showroom = document.querySelector('.showroom__media');
    if (showroom) {
      const rect = showroom.getBoundingClientRect();
      const parent = showroom.closest('.showroom');
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        if (parentRect.top < 0 && parentRect.bottom > windowH) {
          showroom.style.position = 'sticky';
          showroom.style.top = '10rem';
        }
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ========================================
// NAV TITLE UPDATE
// ========================================
function initNavTitle() {
  const navTitle = document.getElementById('navTitle');
  if (!navTitle) return;

  const sections = [
    { id: 'hero', name: 'HOME' },
    { id: 'about', name: 'ABOUT' },
    { id: 'products', name: 'PRODUCTS' },
    { id: 'projects', name: 'PROJECTS' },
    { id: 'showroom', name: 'SHOWROOM' },
    { id: 'testimonials', name: 'REVIEWS' },
    { id: 'cta', name: 'APPROACH' },
    { id: 'footer', name: 'CONTACT' },
  ];

  function updateNavTitle() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    let currentSection = 'HOME';

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowH / 2) {
          currentSection = section.name;
        }
      }
    }

    if (navTitle.textContent !== currentSection) {
      navTitle.style.opacity = '0';
      setTimeout(() => {
        navTitle.textContent = currentSection;
        navTitle.style.opacity = '1';
      }, 150);
    }
  }

  navTitle.style.transition = 'opacity 0.15s ease';
  window.addEventListener('scroll', updateNavTitle, { passive: true });
  updateNavTitle();
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
