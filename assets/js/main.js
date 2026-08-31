/**
 * B306 Laboratory Recruitment Page - Interactive Scripts (Light Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initCopyGroupNumber();
  initFAQAccordion();
  initModal();
  initMobileMenu();
  initScrollEffects();
});

/* ==========================================================================
   1. Dynamic Tech Wave & Particle Canvas (High-DPI & Multi-Zoom Compatible)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0;
  let dpr = window.devicePixelRatio || 1;
  let animationFrameId;
  let mouse = { x: null, y: null, maxDist: 120 };

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particles
  const particleCount = Math.min(Math.floor(window.innerWidth / 22), 40);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * (width || 800),
      y: Math.random() * (height || 600),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: i % 3 === 0 ? 'rgba(2, 132, 199, ' : (i % 3 === 1 ? 'rgba(13, 148, 136, ' : 'rgba(99, 102, 241, ')
    });
  }

  let step = 0;

  function render() {
    if (width === 0 || height === 0) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    step += 0.02;

    // Draw tech sine waves
    const waveCount = 3;
    for (let w = 0; w < waveCount; w++) {
      ctx.beginPath();
      ctx.lineWidth = w === 0 ? 1.5 : 1;
      const alpha = 0.12 - w * 0.03;
      ctx.strokeStyle = w === 0 ? `rgba(2, 132, 199, ${alpha})` : `rgba(13, 148, 136, ${alpha})`;

      for (let x = 0; x < width; x += 10) {
        const freq = 0.003 + w * 0.001;
        const amp = 30 + w * 10;
        const phase = step + w * 1.5;
        const y = height * 0.65 + Math.sin(x * freq + phase) * amp + Math.cos(x * 0.002 + step * 0.5) * 15;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDist) {
          const force = (1 - dist / mouse.maxDist) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.4)';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - dist / 90) * 0.12})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. Copy QQ Group Number to Clipboard & Toast
   ========================================================================== */
function initCopyGroupNumber() {
  const copyButtons = document.querySelectorAll('.btn-copy-group');
  const defaultGroupNumber = '1108883297';

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const groupNumber = btn.dataset.groupNumber || defaultGroupNumber;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(groupNumber);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = groupNumber;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        showToast(`🎉 群号 ${groupNumber} 已成功复制到剪贴板！`, 'success');
      } catch (err) {
        showToast(`群号: ${groupNumber} (请手动复制)`, 'info');
      }
    });
  });
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;

  if (type === 'success') {
    toastIcon.className = 'fa-solid fa-circle-check text-emerald-600 text-lg mr-2';
  } else {
    toastIcon.className = 'fa-solid fa-circle-info text-cyan-600 text-lg mr-2';
  }

  toast.classList.add('show');

  if (window._toastTimer) clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ==========================================================================
   3. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const accordions = document.querySelectorAll('.accordion-header');

  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
          }
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Open first item by default
  const firstItem = document.querySelector('.accordion-item');
  if (firstItem) {
    firstItem.classList.add('active');
    const firstContent = firstItem.querySelector('.accordion-content');
    if (firstContent) {
      firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
  }
}

/* ==========================================================================
   4. Image Modal Viewer
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const modalCaption = document.getElementById('modal-caption');
  const closeBtn = document.getElementById('modal-close');
  const previewTriggers = document.querySelectorAll('[data-preview]');

  if (!modal || !modalImg) return;

  function openModal(src, caption) {
    modalImg.src = src;
    modalCaption.textContent = caption || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  previewTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-preview') || trigger.src;
      const caption = trigger.getAttribute('data-caption') || trigger.alt;
      openModal(src, caption);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    toggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside mobile drawer
  document.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('hidden')) {
      if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

/* ==========================================================================
   6. Scroll Effects & Back to Top
   ========================================================================== */
function initScrollEffects() {
  const backToTop = document.getElementById('back-to-top');
  const navbar = document.getElementById('navbar');

  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Navbar blur background
    if (scrollY > 30) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'border-slate-200/90', 'shadow-sm');
      navbar.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'border-slate-200/90', 'shadow-sm');
      navbar.classList.add('bg-transparent', 'border-transparent');
    }

    // Back to top button
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.remove('opacity-0', 'pointer-events-none');
        backToTop.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTop.classList.add('opacity-0', 'pointer-events-none');
        backToTop.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
