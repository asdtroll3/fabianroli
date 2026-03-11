/* ============================================================
   ALEX MERCER — Hairdresser Portfolio
   script.js
   Author: Senior Front-End Developer
   ============================================================ */

'use strict';

/* ── 1. DOM REFERENCES ──────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');
const yearEl        = document.getElementById('year');


/* ── 2. DYNAMIC COPYRIGHT YEAR ──────────────────────────────── */
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ── 3. STICKY NAVBAR ───────────────────────────────────────── */
/**
 * Adds/removes the `.scrolled` class on the navbar based on scroll position.
 * At top: transparent (overlaid on hero).
 * After scrolling: frosted-glass white.
 */
function handleNavScroll() {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // Run once on load


/* ── 4. HERO IMAGE LOAD ANIMATION ──────────────────────────── */
/**
 * Triggers a subtle Ken Burns scale-in effect once the hero image loads.
 */
const heroSection = document.querySelector('.hero');
const heroImg     = document.querySelector('.hero-img');

if (heroImg) {
  const triggerHeroAnimation = () => heroSection?.classList.add('loaded');
  if (heroImg.complete) {
    triggerHeroAnimation();
  } else {
    heroImg.addEventListener('load', triggerHeroAnimation);
  }
}


/* ── 5. HAMBURGER / MOBILE MENU ─────────────────────────────── */
/**
 * Toggles the full-screen mobile menu open/closed.
 * Also locks body scroll while open and manages ARIA attributes.
 */
function openMobileMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});

// Close on any mobile nav link click
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu();
    closeLightbox();
  }
});


/* ── 6. SCROLL-REVEAL ───────────────────────────────────────── */
/**
 * Uses IntersectionObserver to trigger fade-up animations
 * as elements enter the viewport.
 */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

// Observe all elements with .reveal class
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ── 7. GALLERY LIGHTBOX ────────────────────────────────────── */
/**
 * Builds a lightweight lightbox for the portfolio gallery.
 * Supports: open on click, close, prev/next navigation, keyboard arrows.
 */

let currentLightboxIndex = 0;

// Collect all gallery image data once
const galleryData = Array.from(galleryItems).map(item => ({
  src:     item.querySelector('img').src,
  alt:     item.querySelector('img').alt,
  caption: item.querySelector('.gallery-overlay span')?.textContent || '',
}));

/** Opens the lightbox at a given index */
function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxContent();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Closes the lightbox */
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/** Updates the lightbox image & caption for currentLightboxIndex */
function updateLightboxContent() {
  const data = galleryData[currentLightboxIndex];
  if (!data) return;

  // Fade out, swap, fade in
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
    lightboxImg.style.opacity = '1';
  }, 200);
}

/** Navigate to the previous image (wraps around) */
function prevImage() {
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
  updateLightboxContent();
}

/** Navigate to the next image (wraps around) */
function nextImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
  updateLightboxContent();
}

// Attach click handlers to gallery items
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
  // Make keyboard-accessible
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(index);
    }
  });
});

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevImage);
lightboxNext.addEventListener('click', nextImage);

// Close on overlay click (but not on the image itself)
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation while lightbox is open
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  prevImage();
  if (e.key === 'ArrowRight') nextImage();
});

// Touch/swipe support for lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 50) {
    delta < 0 ? nextImage() : prevImage();
  }
}, { passive: true });


/* ── 8. SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────────────── */
/**
 * Adds offset to account for the fixed navbar height when
 * scrolling to anchor sections.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ── 9. CONTACT FORM ────────────────────────────────────────── */
/**
 * Handles the contact form submission with basic validation.
 * Shows a success message on submit (no backend — demo only).
 */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal    = contactForm.name.value.trim();
    const emailVal   = contactForm.email.value.trim();
    const messageVal = contactForm.message.value.trim();

    // Simple validation
    if (!nameVal || !emailVal || !messageVal) {
      // Highlight empty fields
      [contactForm.name, contactForm.email, contactForm.message].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#C0392B';
          field.addEventListener('input', () => {
            field.style.borderColor = '';
          }, { once: true });
        }
      });
      return;
    }

    // Simulate a successful send (replace with fetch/API call in production)
    const submitBtn = contactForm.querySelector('.btn');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      formSuccess.classList.add('visible');

      // Hide success message after 5 seconds
      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 5000);
    }, 900);
  });
}


/* ── 10. ACTIVE NAV LINK HIGHLIGHTING ───────────────────────── */
/**
 * Highlights the nav link corresponding to the section currently in view.
 * Uses IntersectionObserver for efficient detection.
 */
const sections    = document.querySelectorAll('main section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle(
            'active-link',
            a.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));
