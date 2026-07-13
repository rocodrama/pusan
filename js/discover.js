(() => {
  const STORAGE_KEY = 'busan_decided_places';
  const PLACES = window.PLACES || [];
  const ICONS = window.PLACE_ICONS || {};

  const stackEl = document.getElementById('cardStack');
  const emptyEl = document.getElementById('emptyState');
  const progressEl = document.getElementById('progress');
  const likeBtn = document.getElementById('likeBtn');
  const nopeBtn = document.getElementById('nopeBtn');
  const undoBtn = document.getElementById('undoBtn');
  const summaryCount = document.getElementById('summaryCount');

  function loadDecided() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
  function saveDecided(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  let decided = loadDecided();
  let queue = PLACES.filter((p) => !decided.some((d) => d.id === p.id));

  function buildCard(place, depth) {
    const card = document.createElement('div');
    card.className = 'place-card';
    card.style.zIndex = String(10 - depth);
    card.style.transform = `translateY(${depth * 10}px) scale(${1 - depth * 0.04})`;
    card.style.opacity = depth > 2 ? '0' : String(1 - depth * 0.18);

    card.innerHTML = `
      <div class="place-card__media">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[place.icon] || ICONS.default}</svg>
        <img src="images/${place.id}.jpg" alt="" onerror="this.remove()" />
        <span class="place-card__cat">${place.category}</span>
        <span class="stamp-badge stamp-badge--like">좋아요</span>
        <span class="stamp-badge stamp-badge--nope">패스</span>
      </div>
      <div class="place-card__body">
        <h2 class="place-card__name">${place.name}</h2>
        <span class="place-card__area">${place.area}</span>
        <div class="place-card__row"><span>PRICE</span><strong>${place.price}</strong></div>
        <div class="place-card__row"><span>SIGNATURE</span><strong>${place.signature}</strong></div>
        <p class="place-card__desc">${place.desc}</p>
        <a class="place-card__link" href="${place.link}" target="_blank" rel="noopener">자세히 보기 →</a>
      </div>
    `;
    return card;
  }

  function render() {
    stackEl.innerHTML = '';
    progressEl.textContent = `${decided.length} / ${PLACES.length}`;
    undoBtn.disabled = decided.length === 0;

    if (queue.length === 0) {
      stackEl.style.display = 'none';
      emptyEl.style.display = 'grid';
      likeBtn.style.display = 'none';
      nopeBtn.style.display = 'none';
      const likedCount = decided.filter((d) => d.liked).length;
      summaryCount.textContent = String(likedCount);
      return;
    }

    stackEl.style.display = 'block';
    emptyEl.style.display = 'none';
    likeBtn.style.display = '';
    nopeBtn.style.display = '';

    const visible = queue.slice(0, 3);
    visible.forEach((place, depth) => {
      stackEl.appendChild(buildCard(place, depth));
    });

    attachDrag(stackEl.querySelector('.place-card'));
  }

  function commit(liked) {
    if (queue.length === 0) return;
    const place = queue.shift();
    decided.push({ id: place.id, liked });
    saveDecided(decided);
    render();
  }

  function undo() {
    if (decided.length === 0) return;
    const last = decided.pop();
    saveDecided(decided);
    const place = PLACES.find((p) => p.id === last.id);
    if (place) queue.unshift(place);
    render();
  }

  function flyOut(card, direction) {
    const dx = direction === 'like' ? window.innerWidth : -window.innerWidth;
    card.classList.remove('dragging');
    card.style.transform = `translate(${dx}px, -40px) rotate(${direction === 'like' ? 24 : -24}deg)`;
    card.style.opacity = '0';
    window.setTimeout(() => commit(direction === 'like'), 260);
  }

  function attachDrag(card) {
    if (!card) return;
    const likeStamp = card.querySelector('.stamp-badge--like');
    const nopeStamp = card.querySelector('.stamp-badge--nope');
    let dragging = false;
    let startX = 0;
    let startY = 0;

    card.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      card.classList.add('dragging');
      card.setPointerCapture(e.pointerId);
    });

    card.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx / 18}deg)`;
      likeStamp.style.opacity = String(Math.max(0, Math.min(1, dx / 100)));
      nopeStamp.style.opacity = String(Math.max(0, Math.min(1, -dx / 100)));
    });

    function release(e) {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      card.classList.remove('dragging');
      if (dx > 100) {
        flyOut(card, 'like');
      } else if (dx < -100) {
        flyOut(card, 'dislike');
      } else {
        card.style.transform = '';
        likeStamp.style.opacity = '0';
        nopeStamp.style.opacity = '0';
      }
    }

    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
  }

  likeBtn.addEventListener('click', () => {
    const card = stackEl.querySelector('.place-card');
    if (card) flyOut(card, 'like');
  });
  nopeBtn.addEventListener('click', () => {
    const card = stackEl.querySelector('.place-card');
    if (card) flyOut(card, 'dislike');
  });
  undoBtn.addEventListener('click', undo);

  render();
})();
