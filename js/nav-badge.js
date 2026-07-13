(() => {
  const badge = document.getElementById('tabBadge');
  if (!badge) return;
  try {
    const decided = JSON.parse(localStorage.getItem('busan_decided_places') || '[]');
    const liked = decided.filter((d) => d.liked).length;
    badge.textContent = String(liked);
    badge.style.display = liked > 0 ? 'flex' : 'none';
  } catch {
    badge.style.display = 'none';
  }
})();
