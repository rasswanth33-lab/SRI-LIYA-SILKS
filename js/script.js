// ===== Sri Liya Silks — interactions =====

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.cat-card, .collection-card, .product-card, .offer-card, .gallery-item, .about-media, .about-content, .contact-info, .contact-map'
);
revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => observer.observe(el));

// Header shadow on scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 12 ? '0 8px 24px -12px rgba(43,34,26,0.25)' : 'none';
});

// Hero background video — respect reduced-motion preference
const heroVideo = document.querySelector('.hero-media video');
if (heroVideo) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  } else {
    heroVideo.play().catch(() => {}); // ignore autoplay-block errors
  }
}
