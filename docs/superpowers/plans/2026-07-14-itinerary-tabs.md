# Itinerary Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the vertical slide-deck `itinerary.html` with a mobile-first, bottom-tab layout (전체 / 1일차 / 2일차 / 3일차), each tab showing a timeline table, a hand-drawn route sketch, and a place card, plus a packing checklist in the 전체 tab.

**Architecture:** Single static page. All four panels live in the DOM at once; a small JS file toggles an `active` class on the matching panel and tab button. No build step, no data file, no map API — content is hardcoded HTML per the approved spec.

**Tech Stack:** Plain HTML/CSS/vanilla JS (matches the rest of this repo — no bundler, no package.json, no test framework). Verification in this plan uses the `chrome-devtools` MCP tool (`navigate_page`, `evaluate_script`, `click`) to open the file directly via a `file://` URL and assert DOM state — this project has no automated test runner, so this is the closest available substitute for a real test cycle.

## Global Constraints

- No real map embeds or API keys — route display is a hand-drawn-style SVG sketch (spec: "Map").
- No photo assets yet — place cards are link-only for now; photo `<img>` tags will be added later by hand when the user provides files (spec: "Place cards").
- No JSON/config layer — content is hardcoded directly in markup (spec: "Data storage").
- Day 1 / Day 3 show only currently-confirmed items; empty slots are labeled "자유일정" (spec: "Day 1 / Day 3 content").
- 준비물 checklist lives inside the 전체 tab only, no separate tab (spec: "준비물").
- Tab switching is single-page + JS class toggling, no URL hash routing (spec: "Tab switching").

---

### Task 1: Rewrite itinerary markup and styles (static layout)

**Files:**
- Modify: `itinerary.html` (full body rewrite)
- Modify: `css/itinerary.css` (full file rewrite)

**Interfaces:**
- Produces: DOM structure Task 2 depends on — `.tab-btn[data-tab="all"|"day1"|"day2"|"day3"]` buttons inside `<nav class="tab-bar">`, and `.panel[data-panel="all"|"day1"|"day2"|"day3"]` sections inside `<main class="panels">`. `.panel.active` is the CSS hook that makes a panel visible (`display: block`); all other panels have no `.active` class and stay `display: none` by default per the stylesheet.

- [ ] **Step 1: Write the new `itinerary.html`**

Replace the entire file with:

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>부산 2박 3일 일정</title>
  <meta name="description" content="2026.08.09-11 부산 여행 일정표" />
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/itinerary.css" />
</head>
<body class="itinerary">
  <a class="back-link" href="index.html">← 초대장으로</a>

  <header class="trip-header">
    <span class="eyebrow">2026 여름 · 부산 2박 3일</span>
    <h1 class="trip-header__title">08.09 (일) → 08.11 (화)</h1>
  </header>

  <main class="panels">
    <section class="panel active" id="panel-all" data-panel="all">
      <div class="day-block">
        <h2 class="day-header">DAY 1 · 08.09 (일)</h2>
        <div class="timeline">
          <div class="leg">
            <span class="leg__time">시간 미정</span>
            <span class="leg__route">춘천터미널 → 강변</span>
            <span class="leg__mode">버스</span>
          </div>
          <div class="leg">
            <span class="leg__time">시간 미정</span>
            <span class="leg__route">강변 → 수서</span>
            <span class="leg__mode">지하철</span>
          </div>
          <div class="leg leg--main">
            <span class="leg__time">10:00</span>
            <span class="leg__route">수서 → 부산</span>
            <span class="leg__mode">SRT</span>
          </div>
          <div class="leg">
            <span class="leg__time">도착 후</span>
            <span class="leg__route">부산역 → 숙소(모네의 여름) 체크인</span>
            <span class="leg__mode">이동</span>
          </div>
        </div>
      </div>

      <div class="day-block">
        <h2 class="day-header">DAY 2 · 08.10 (월)</h2>
        <div class="timeline">
          <div class="leg">
            <span class="leg__time">오전</span>
            <span class="leg__route">해운대 해변 산책</span>
            <span class="leg__mode">자유</span>
          </div>
          <div class="leg leg--main">
            <span class="leg__time">낮</span>
            <span class="leg__route">해운대 블루라인파크 · 스카이캡슐</span>
            <span class="leg__mode">확정</span>
          </div>
          <div class="leg">
            <span class="leg__time">저녁</span>
            <span class="leg__route">자유일정</span>
            <span class="leg__mode">자유</span>
          </div>
        </div>
      </div>

      <div class="day-block">
        <h2 class="day-header">DAY 3 · 08.11 (화)</h2>
        <div class="timeline">
          <div class="leg">
            <span class="leg__time">오전</span>
            <span class="leg__route">체크아웃 · 근처 자유일정</span>
            <span class="leg__mode">자유</span>
          </div>
          <div class="leg leg--main">
            <span class="leg__time">14:00</span>
            <span class="leg__route">부산 → 수서</span>
            <span class="leg__mode">SRT</span>
          </div>
        </div>
      </div>

      <div class="checklist-block">
        <h2 class="day-header">준비물</h2>
        <ul class="checklist">
          <li>여권/신분증</li>
          <li>지갑</li>
          <li>충전기 · 보조배터리</li>
          <li>수영복 · 수건 (송정/해운대 바다)</li>
          <li>우산 or 우비</li>
          <li>편한 신발</li>
          <li>선크림</li>
          <li>카메라 · 폰 방수파우치</li>
        </ul>
      </div>
    </section>

    <section class="panel" id="panel-day1" data-panel="day1">
      <h2 class="day-header">DAY 1 · 08.09 (일)</h2>
      <div class="timeline">
        <div class="leg">
          <span class="leg__time">시간 미정</span>
          <span class="leg__route">춘천터미널 → 강변</span>
          <span class="leg__mode">버스</span>
        </div>
        <div class="leg">
          <span class="leg__time">시간 미정</span>
          <span class="leg__route">강변 → 수서</span>
          <span class="leg__mode">지하철</span>
        </div>
        <div class="leg leg--main">
          <span class="leg__time">10:00</span>
          <span class="leg__route">수서 → 부산</span>
          <span class="leg__mode">SRT</span>
        </div>
        <div class="leg">
          <span class="leg__time">도착 후</span>
          <span class="leg__route">부산역 → 숙소(모네의 여름) 체크인</span>
          <span class="leg__mode">이동</span>
        </div>
      </div>
      <div class="route-sketch" aria-hidden="true">
        <svg viewBox="0 0 320 140">
          <path d="M20,110 Q100,20 160,70 T300,40" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="6 6" />
          <circle cx="20" cy="110" r="5" fill="var(--coral)" />
          <circle cx="160" cy="70" r="5" fill="var(--coral)" />
          <circle cx="300" cy="40" r="5" fill="var(--gold)" />
          <text x="6" y="128" class="route-sketch__label">수서</text>
          <text x="132" y="60" class="route-sketch__label">부산역</text>
          <text x="248" y="30" class="route-sketch__label">숙소(송정)</text>
        </svg>
      </div>
      <div class="stay-card">
        <div class="stay-card__row"><span>장소</span><strong>모네의 여름 (숙소)</strong></div>
        <div class="stay-card__row"><span>주소</span><strong>부산 해운대구 송정광어골로 65</strong></div>
        <a class="map-link" href="https://map.naver.com/p/search/부산 해운대구 송정광어골로 65 모네의여름" target="_blank" rel="noopener">지도에서 보기 →</a>
      </div>
    </section>

    <section class="panel" id="panel-day2" data-panel="day2">
      <h2 class="day-header">DAY 2 · 08.10 (월)</h2>
      <div class="timeline">
        <div class="leg">
          <span class="leg__time">오전</span>
          <span class="leg__route">해운대 해변 산책</span>
          <span class="leg__mode">자유</span>
        </div>
        <div class="leg leg--main">
          <span class="leg__time">낮</span>
          <span class="leg__route">해운대 블루라인파크 · 스카이캡슐</span>
          <span class="leg__mode">확정</span>
        </div>
        <div class="leg">
          <span class="leg__time">저녁</span>
          <span class="leg__route">자유일정</span>
          <span class="leg__mode">자유</span>
        </div>
      </div>
      <div class="route-sketch" aria-hidden="true">
        <svg viewBox="0 0 320 140">
          <path d="M20,90 Q160,20 300,90" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="6 6" />
          <circle cx="20" cy="90" r="5" fill="var(--coral)" />
          <circle cx="160" cy="34" r="5" fill="var(--gold)" />
          <circle cx="300" cy="90" r="5" fill="var(--coral)" />
          <text x="6" y="108" class="route-sketch__label">미포</text>
          <text x="138" y="24" class="route-sketch__label">청사포</text>
          <text x="272" y="108" class="route-sketch__label">송정</text>
        </svg>
      </div>
      <div class="stay-card">
        <div class="stay-card__row"><span>장소</span><strong>해운대 블루라인파크 · 스카이캡슐</strong></div>
        <div class="stay-card__row"><span>메모</span><strong>미포~청사포~송정 구간, 성수기 예약 필수</strong></div>
        <a class="map-link" href="https://map.naver.com/p/search/해운대 블루라인파크" target="_blank" rel="noopener">지도에서 보기 →</a>
      </div>
    </section>

    <section class="panel" id="panel-day3" data-panel="day3">
      <h2 class="day-header">DAY 3 · 08.11 (화)</h2>
      <div class="timeline">
        <div class="leg">
          <span class="leg__time">오전</span>
          <span class="leg__route">체크아웃 · 근처 자유일정</span>
          <span class="leg__mode">자유</span>
        </div>
        <div class="leg leg--main">
          <span class="leg__time">14:00</span>
          <span class="leg__route">부산 → 수서</span>
          <span class="leg__mode">SRT</span>
        </div>
      </div>
      <div class="route-sketch" aria-hidden="true">
        <svg viewBox="0 0 320 140">
          <path d="M20,40 Q160,110 300,60" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="6 6" />
          <circle cx="20" cy="40" r="5" fill="var(--gold)" />
          <circle cx="160" cy="100" r="5" fill="var(--coral)" />
          <circle cx="300" cy="60" r="5" fill="var(--coral)" />
          <text x="6" y="30" class="route-sketch__label">숙소(송정)</text>
          <text x="126" y="122" class="route-sketch__label">부산역</text>
          <text x="272" y="50" class="route-sketch__label">수서</text>
        </svg>
      </div>
      <div class="stay-card">
        <div class="stay-card__row"><span>장소</span><strong>모네의 여름 (숙소)</strong></div>
        <div class="stay-card__row"><span>주소</span><strong>부산 해운대구 송정광어골로 65</strong></div>
        <a class="map-link" href="https://map.naver.com/p/search/부산 해운대구 송정광어골로 65 모네의여름" target="_blank" rel="noopener">지도에서 보기 →</a>
      </div>
    </section>
  </main>

  <nav class="tab-bar">
    <button class="tab-btn active" type="button" data-tab="all">전체</button>
    <button class="tab-btn" type="button" data-tab="day1">1일차</button>
    <button class="tab-btn" type="button" data-tab="day2">2일차</button>
    <button class="tab-btn" type="button" data-tab="day3">3일차</button>
  </nav>

  <script src="js/itinerary.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write the new `css/itinerary.css`**

Replace the entire file with:

```css
/* ==========================================================================
   일정표 페이지 — 하단 탭 구조 (보딩패스 시리즈)
   ========================================================================== */

body.itinerary {
  min-height: 100vh;
  padding-bottom: calc(76px + var(--safe-b));
}

.trip-header {
  padding: 4.2rem 1.25rem 1.4rem;
  text-align: center;
  color: var(--sand);
  background: radial-gradient(1000px 500px at 50% -10%, rgba(20, 107, 140, 0.55), transparent 60%), var(--sea-deep);
}

.trip-header__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 6vw, 2.1rem);
  margin: 0.4rem 0 0;
}

.panels {
  background: var(--sand);
  color: var(--ink);
}

.panel {
  display: none;
  padding: 1.6rem 1.25rem 2rem;
  max-width: 640px;
  margin: 0 auto;
}

.panel.active {
  display: block;
}

.day-block + .day-block {
  margin-top: 2rem;
}

.day-header {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sea-mid);
  margin: 0 0 0.8rem;
}

/* ---- leg (transport ticket stub) ---- */

.leg {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 0;
  border-bottom: 1px dashed rgba(27, 36, 48, 0.15);
}

.leg:last-child {
  border-bottom: none;
}

.leg__time {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  min-width: 4.6rem;
  opacity: 0.75;
}

.leg__route {
  font-size: 1.05rem;
  font-weight: 600;
}

.leg__mode {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  border: 1px solid currentColor;
  opacity: 0.7;
  white-space: nowrap;
}

.leg--main .leg__route {
  color: var(--coral);
}

.leg--main .leg__mode {
  color: var(--coral);
  border-color: var(--coral);
  opacity: 1;
}

/* ---- route sketch (hand-drawn style map) ---- */

.route-sketch {
  margin: 1.4rem 0;
}

.route-sketch svg {
  width: 100%;
  height: auto;
  display: block;
}

.route-sketch__label {
  font-family: var(--font-mono);
  font-size: 9px;
  fill: var(--ink);
  opacity: 0.7;
}

/* ---- checklist (준비물) ---- */

.checklist-block {
  margin-top: 2.4rem;
  padding-top: 1.6rem;
  border-top: 1px dashed rgba(27, 36, 48, 0.15);
}

.checklist {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: grid;
  gap: 0.6rem;
}

.checklist li {
  position: relative;
  padding-left: 1.6rem;
  font-size: 0.95rem;
}

.checklist li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.2rem;
  width: 1.05rem;
  height: 1.05rem;
  border: 1.5px solid var(--sea-mid);
  border-radius: 5px;
}

/* ---- place card (reuses ticket-style stay card) ---- */

.stay-card {
  display: grid;
  gap: 1.1rem;
  padding: 1.8rem;
  margin-top: 1.4rem;
  border-radius: var(--radius);
  background: rgba(11, 61, 92, 0.04);
  border: 1px solid rgba(11, 61, 92, 0.1);
}

.stay-card__row {
  display: grid;
  grid-template-columns: 5.2rem 1fr;
  gap: 0.6rem;
  font-size: 0.95rem;
}

.stay-card__row span {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.5;
  padding-top: 0.15rem;
}

.stay-card__row strong {
  font-weight: 600;
}

.stay-card a.map-link {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  text-decoration: underline;
  color: var(--sea-mid);
}

/* ---- tab bar ---- */

.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  background: var(--sea-deep);
  padding: 0.6rem var(--safe-r) calc(0.6rem + var(--safe-b)) var(--safe-l);
  box-shadow: 0 -8px 24px -12px rgba(0, 0, 0, 0.4);
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  color: var(--sand);
  opacity: 0.55;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.6rem 0;
}

.tab-btn.active {
  opacity: 1;
  color: var(--gold);
}

.back-link {
  position: fixed;
  left: 1.2rem;
  top: 1.2rem;
  z-index: 20;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--sand);
  opacity: 0.6;
  text-decoration: none;
}

.back-link:hover {
  opacity: 1;
}

@media (max-width: 560px) {
  .leg {
    grid-template-columns: auto 1fr;
  }
  .leg__mode {
    grid-column: 1 / -1;
    justify-self: start;
  }
}
```

- [ ] **Step 3: Verify the static layout renders correctly**

Use the `chrome-devtools` MCP tool:
1. `navigate_page` to `file:///D:/project/pusan/itinerary.html`
2. `evaluate_script` with:
   ```js
   () => ({
     visiblePanels: Array.from(document.querySelectorAll('.panel.active')).map(p => p.dataset.panel),
     tabCount: document.querySelectorAll('.tab-btn').length,
     activeTab: document.querySelector('.tab-btn.active')?.dataset.tab,
     checklistItems: document.querySelectorAll('.checklist li').length,
   })
   ```
   Expected: `{ visiblePanels: ["all"], tabCount: 4, activeTab: "all", checklistItems: 8 }`

If the result doesn't match, re-check the `data-panel`/`data-tab` attributes and the `.panel.active` CSS rule before moving on.

- [ ] **Step 4: Commit**

```bash
git add itinerary.html css/itinerary.css
git commit -m "Redesign itinerary page as static tabbed layout"
```

---

### Task 2: Add tab-switching behavior

**Files:**
- Modify: `js/itinerary.js` (full file rewrite)

**Interfaces:**
- Consumes: `.tab-btn[data-tab]` buttons and `.panel[data-panel]` sections produced by Task 1. The `data-tab` value on a button always matches the `data-panel` value on the section it should reveal (`"all"`, `"day1"`, `"day2"`, `"day3"`).
- Produces: nothing consumed by later tasks — this is the last task in the plan.

- [ ] **Step 1: Write the new `js/itinerary.js`**

Replace the entire file with:

```js
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
```

- [ ] **Step 2: Verify tab switching works for every tab**

Use the `chrome-devtools` MCP tool (page already open from Task 1, or re-`navigate_page` to `file:///D:/project/pusan/itinerary.html`):

For each `tab` in `["day1", "day2", "day3", "all"]`:
1. `click` the button matching `.tab-btn[data-tab="<tab>"]`
2. `evaluate_script` with:
   ```js
   (tab) => ({
     visiblePanels: Array.from(document.querySelectorAll('.panel.active')).map(p => p.dataset.panel),
     activeTabBtn: document.querySelector('.tab-btn.active')?.dataset.tab,
   })
   ```
   Expected each time: `{ visiblePanels: ["<tab>"], activeTabBtn: "<tab>" }` — exactly one panel visible, matching the clicked tab, and exactly one active tab button.

- [ ] **Step 3: Visual mobile check**

Use `resize_page` to set a mobile viewport (390x844), `take_screenshot`, and confirm by inspection: header readable, timeline rows don't overflow horizontally, route-sketch SVG scales to width, tab bar sits flush at the bottom without covering content (the `padding-bottom` on `body.itinerary` from Task 1 should prevent overlap).

- [ ] **Step 4: Commit**

```bash
git add js/itinerary.js
git commit -m "Wire up bottom tab switching for itinerary page"
```
