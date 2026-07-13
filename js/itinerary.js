(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');

  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', slide.dataset.label || `슬라이드 ${i + 1}`);
    dot.addEventListener('click', () => slide.scrollIntoView({ behavior: 'smooth' }));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = slides.indexOf(entry.target);
          dots.forEach((d) => d.classList.remove('active'));
          dots[idx]?.classList.add('active');
        }
      });
    },
    { threshold: 0.6 }
  );

  slides.forEach((s) => observer.observe(s));

  document.addEventListener('keydown', (e) => {
    const activeIdx = dots.findIndex((d) => d.classList.contains('active'));
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      slides[Math.min(activeIdx + 1, slides.length - 1)]?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      slides[Math.max(activeIdx - 1, 0)]?.scrollIntoView({ behavior: 'smooth' });
    }
  });
})();
