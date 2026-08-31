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
  '.collection-card, .product-card, .offer-card, .gallery-item, .about-media, .about-content, .contact-info, .contact-map, .process-steps li'
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

// Category card videos — same reduced-motion respect as the hero
document.querySelectorAll('.cat-card-media').forEach(video => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  } else {
    video.play().catch(() => {});
  }
});

// Featured Categories — cinematic horizontal scroll (desktop/tablet only).
// A tall spacer keeps the row pinned via position:sticky while the user scrolls;
// horizontal position is driven by how far the spacer has scrolled past, so the
// motion is a direct, 1:1 result of scrolling rather than a separate animation.
const catWrap = document.getElementById('catScrollWrap');
const catTrack = document.getElementById('catTrack');

function catPinEnabled() {
  return (
    catWrap && catTrack &&
    window.matchMedia('(min-width: 901px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function updateCatScroll() {
  if (!catPinEnabled()) {
    if (catTrack) catTrack.style.transform = '';
    return;
  }
  const rect = catWrap.getBoundingClientRect();
  const scrollableDistance = catWrap.offsetHeight - window.innerHeight;
  if (scrollableDistance <= 0) { catTrack.style.transform = 'translateX(0)'; return; }

  let progress = -rect.top / scrollableDistance;
  progress = Math.min(1, Math.max(0, progress));

  const maxTranslate = Math.max(0, catTrack.scrollWidth - catWrap.offsetWidth);
  catTrack.style.transform = `translateX(${-progress * maxTranslate}px)`;
}

let catTicking = false;
function onCatScroll() {
  if (catTicking) return;
  catTicking = true;
  requestAnimationFrame(() => {
    updateCatScroll();
    catTicking = false;
  });
}

if (catWrap && catTrack) {
  window.addEventListener('scroll', onCatScroll, { passive: true });
  window.addEventListener('resize', updateCatScroll);
  updateCatScroll();
}
