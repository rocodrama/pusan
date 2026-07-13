(() => {
  const cancelBtn = document.getElementById('cancelBtn');
  const acceptBtn = document.getElementById('acceptBtn');
  const caption = document.getElementById('dodgeCaption');
  const stage = document.querySelector('.stage');

  const TAUNTS = [
    '어허, 그건 안 돼요',
    '잡아봐요',
    '취소는 매진되었습니다',
    '이 버스는 이미 출발했어요',
    '수서역에서 만나요',
    '티켓은 환불이 안 돼요',
    '어딜 도망가려고',
    '오늘도 못 잡았네요',
  ];

  let attempts = 0;
  let locked = false;
  const COOLDOWN = 400;

  function farEnough(x, y, fromX, fromY) {
    if (fromX == null) return true;
    return Math.hypot(x - fromX, y - fromY) > 180;
  }

  function safeInset(name) {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(v) ? v : 0;
  }

  function dodge(fromX, fromY) {
    if (locked) return;
    locked = true;
    window.setTimeout(() => (locked = false), COOLDOWN);
    attempts += 1;

    const rect = cancelBtn.getBoundingClientRect();
    const margin = 24;
    const safeTop = margin + safeInset('--safe-t');
    const safeBottom = margin + safeInset('--safe-b') + 12;
    const safeLeft = margin + safeInset('--safe-l');
    const safeRight = margin + safeInset('--safe-r');
    const minX = safeLeft;
    const minY = safeTop;
    const maxX = window.innerWidth - rect.width - safeRight;
    const maxY = window.innerHeight - rect.height - safeBottom;

    let nextX;
    let nextY;
    let tries = 0;
    do {
      nextX = minX + Math.random() * Math.max(0, maxX - minX);
      nextY = minY + Math.random() * Math.max(0, maxY - minY);
      tries += 1;
    } while (!farEnough(nextX, nextY, fromX, fromY) && tries < 6);

    cancelBtn.classList.add('roaming');
    cancelBtn.style.left = `${nextX}px`;
    cancelBtn.style.top = `${nextY}px`;

    const text = TAUNTS[(attempts - 1) % TAUNTS.length];
    caption.textContent = text;
    caption.style.left = `${nextX}px`;
    caption.style.top = `${Math.max(8, nextY - 34)}px`;
    caption.classList.add('show');
    window.clearTimeout(dodge._t);
    dodge._t = window.setTimeout(() => caption.classList.remove('show'), 900);
  }

  cancelBtn.addEventListener('pointerenter', (e) => dodge(e.clientX, e.clientY));
  cancelBtn.addEventListener('focus', () => {
    const r = cancelBtn.getBoundingClientRect();
    dodge(r.left + r.width / 2, r.top + r.height / 2);
  });
  cancelBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    dodge(t?.clientX, t?.clientY);
  }, { passive: false });

  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dodge();
  });

  acceptBtn.addEventListener('click', () => {
    stage.style.transition = 'transform .4s ease, opacity .4s ease';
    stage.style.transform = 'scale(0.96)';
    stage.style.opacity = '0';
    window.setTimeout(() => {
      window.location.href = 'discover.html';
    }, 380);
  });
})();
