(() => {
  const STORAGE_KEY = 'busan_decided_places';
  const PLACES = window.PLACES || [];
  const ICONS = window.PLACE_ICONS || {};

  const listEl = document.getElementById('savedList');
  const emptyEl = document.getElementById('savedEmpty');
  const subEl = document.getElementById('savedSub');

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

  function render() {
    const decided = loadDecided();
    const likedIds = decided.filter((d) => d.liked).map((d) => d.id).reverse();
    const likedPlaces = likedIds.map((id) => PLACES.find((p) => p.id === id)).filter(Boolean);

    subEl.textContent = `찜한 곳 ${likedPlaces.length}곳`;
    listEl.innerHTML = '';

    if (likedPlaces.length === 0) {
      listEl.style.display = 'none';
      emptyEl.style.display = 'grid';
      return;
    }
    listEl.style.display = 'grid';
    emptyEl.style.display = 'none';

    likedPlaces.forEach((place) => {
      const item = document.createElement('div');
      item.className = 'saved-item';
      item.innerHTML = `
        <div class="saved-item__thumb">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[place.icon] || ICONS.default}</svg>
          <img src="images/${place.id}.jpg" alt="" onerror="this.remove()" />
        </div>
        <div class="saved-item__info">
          <span class="saved-item__cat">${place.category} · ${place.area}</span>
          <span class="saved-item__name">${place.name}</span>
          <span class="saved-item__price">${place.price}</span>
          <a class="saved-item__link" href="${place.link}" target="_blank" rel="noopener">자세히 보기 →</a>
        </div>
        <button class="saved-item__remove" type="button" aria-label="찜 취소">✕</button>
      `;
      item.querySelector('.saved-item__remove').addEventListener('click', () => {
        const list = loadDecided();
        const entry = list.find((d) => d.id === place.id);
        if (entry) entry.liked = false;
        saveDecided(list);
        render();
      });
      listEl.appendChild(item);
    });
  }

  render();
})();
