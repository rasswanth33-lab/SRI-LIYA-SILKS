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
  '.collection-card, .product-card, .offer-card, .shop-photo, .about-media, .about-content, .contact-info, .contact-map, .process-steps li'
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

// Hero background video — respect reduced-motion preference.
// muted/playsInline are also set as JS properties (not just HTML attributes)
// because some mobile browsers only honor the mute state reliably that way.
const heroVideo = document.querySelector('.hero-media video');
if (heroVideo) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  } else {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.play().catch(() => {}); // ignore autoplay-block errors
  }
}

// Category card videos keep the native `autoplay` attribute (the most
// reliable way to get mobile browsers to play muted video at all) and use
// this observer only to pause them once scrolled far out of view and
// resume when they come back — not to trigger the very first play, which
// mobile Safari/Chrome can silently refuse if it's script-only.
const catVideos = document.querySelectorAll('.cat-card-media');
if (catVideos.length) {
  const catPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (catPrefersReduced) {
    catVideos.forEach(video => { video.removeAttribute('autoplay'); video.pause(); });
  } else {
    catVideos.forEach(video => {
      video.muted = true;
      video.playsInline = true;
    });

    const catVideoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.2, rootMargin: '250px 0px' });

    catVideos.forEach(video => catVideoObserver.observe(video));
  }
}

// Featured Categories — slow automatic horizontal drift, with full manual
// override: drag (mouse), swipe (touch), wheel/trackpad, or the hidden
// native scrollbar all work, and auto-scroll pauses whenever the user
// touches it, resuming after a short idle period.
const catScroller = document.getElementById('catScroller');
const catTrack = document.getElementById('catTrack');

if (catScroller && catTrack) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEED = 0.45;        // px per frame — slow, cinematic drift
  const RESUME_DELAY = 2600; // ms of no interaction before auto-scroll resumes

  let direction = 1;
  let paused = false;
  let resumeTimer = null;

  function maxScroll() {
    return catScroller.scrollWidth - catScroller.clientWidth;
  }

  function tick() {
    if (!paused && !prefersReducedMotion) {
      const max = maxScroll();
      if (max > 0) {
        let next = catScroller.scrollLeft + direction * SPEED;
        if (next >= max) { next = max; direction = -1; }
        if (next <= 0) { next = 0; direction = 1; }
        catScroller.scrollLeft = next;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function pauseAutoScroll() {
    paused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { paused = false; }, RESUME_DELAY);
  }

  ['pointerdown', 'wheel', 'touchstart'].forEach(evt => {
    catScroller.addEventListener(evt, pauseAutoScroll, { passive: true });
  });

  // Click-and-drag scrolling for mouse/trackpad users
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  catScroller.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return; // native touch scrolling handles this
    isDragging = true;
    catScroller.classList.add('dragging');
    dragStartX = e.clientX;
    dragStartScroll = catScroller.scrollLeft;
    catScroller.setPointerCapture(e.pointerId);
  });
  catScroller.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    catScroller.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
    catScroller.addEventListener(evt, () => {
      isDragging = false;
      catScroller.classList.remove('dragging');
    });
  });

  // Let a plain vertical mouse wheel drive horizontal movement while hovered
  catScroller.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      catScroller.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

// Enquiry form — no backend, so it composes the message and hands off to
// WhatsApp directly. WHATSAPP_NUMBER is the same placeholder used by every
// other WhatsApp link on the site; update it in one place once the real
// shop number is available (search the codebase for "910000000000").
const WHATSAPP_NUMBER = '910000000000';
const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = enquiryForm.name.value.trim();
    const phone = enquiryForm.phone.value.trim();
    const message = enquiryForm.message.value.trim();

    const text = `Hi Sri Liya Silks, I'd like to enquire.\n\nName: ${name}\nPhone: ${phone}\nRequirement: ${message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
}
