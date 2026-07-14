(() => {
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  function activate(tabName) {
    tabButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabName));
    panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === tabName));
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => activate(btn.dataset.tab));
  });
})();
