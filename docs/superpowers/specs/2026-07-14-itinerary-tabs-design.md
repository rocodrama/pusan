# Itinerary page: tab-based mobile redesign

## Problem

`itinerary.html` is currently a vertical slide/scroll deck (one full-screen slide per day, snap-scroll). The user wants a mobile-first layout with a bottom tab bar instead: 전체 / 1일차 / 2일차 / 3일차. Each day tab needs a timeline table, a map-style place display, and a place card with a link (photo later). The 전체 tab needs a combined timeline plus a packing checklist (준비물).

## Decisions (from brainstorming)

- **Map**: hand-drawn/illustration-style SVG route sketch per day (no real coordinates, no map API/key).
- **준비물**: lives inside the 전체 tab, below the combined timeline (no separate 5th tab).
- **Day 1 / Day 3 content**: only currently-confirmed items (transit legs, 숙소 체크인/체크아웃, SRT). Empty slots shown as "자유일정". No speculative candidate places from `추천여행지.md` are added yet.
- **Place cards**: external link only (Naver Map search / official site), no photo assets exist in the repo yet. Structure leaves room to drop in an `<img>` later without restructuring — when the user provides photo files, add one `<img>` tag per card.
- **Tab switching**: single `itinerary.html`, all 4 panels in the DOM, JS toggles visibility (no URL hash routing, no separate pages).
- **Data storage**: no JSON/config layer — content is small and fixed, so it's hardcoded directly in the HTML markup. Future edits (once the user finalizes a schedule via a `timeline.md` they'll hand over, plus photos) are done by editing the HTML/JS directly.

## Architecture

Single page, single JS file, single CSS file (existing `itinerary.css`, extended). No new pages, no build step, no data-fetching.

```
itinerary.html
├── back-link (existing, unchanged)
├── header bar (compressed cover: title + dates — replaces old "표지" slide)
├── panels (one per tab, only one visible at a time)
│   ├── #panel-all    → combined timeline (Day 1/2/3 sections) + 준비물 checklist
│   ├── #panel-day1   → timeline + route sketch + 숙소 place card
│   ├── #panel-day2   → timeline + route sketch + 블루라인파크 place card
│   └── #panel-day3   → timeline + route sketch + 숙소 place card (체크아웃)
└── tab-bar (fixed bottom, 4 buttons, mirrors old discover/saved tab-bar visual language)
```

`js/itinerary.js` is rewritten: drop the old scroll-spy/dot-nav logic (no more slides), add a plain click-handler that toggles an `active` class on the matching panel and tab button.

## Components (CSS)

- `.timeline` / `.timeline__row`: replaces `.slide` context for `.leg` rows (the existing `.leg`, `.leg__time`, `.leg__route`, `.leg__mode` classes are kept as-is, just reparented into panels instead of slides).
- `.day-header`: small label ("DAY 1 · 08.09 (일)") atop each day's timeline inside the 전체 tab and atop each day panel.
- `.route-sketch`: SVG container, one hand-drawn-style SVG per day (simple curved path + a few dot "pins" + place labels), reuses `--gold`/`--coral`/`--sand` tokens for a sketchy look (dashed strokes, slight rotation on labels).
- `.place-card`: reuses the existing `.stay-card` look (title row + note + `.map-link`). Renamed usage stays the same class (`.stay-card`) to avoid duplicating styles — no new class needed here, just reused in more places.
- `.checklist`: simple list with checkbox-style bullets for 준비물 (visual only, not interactive — this is a shared static page, not a per-user todo list, so no localStorage/tick-persistence).
- `.tab-bar`: fixed bottom nav, 4 buttons in a row (was previously 2-item nav in discover/saved, now generalized to 4). Recreated in `itinerary.css` since the old `discover.css`/`saved.css` that held this pattern were deleted.

## Content per tab

**전체**
- Day 1 / Day 2 / Day 3 timeline sections stacked, each with a `.day-header`
- 준비물 checklist below: 여권/신분증, 지갑, 충전기·보조배터리, 수영복·수건 (송정/해운대 바다), 우산 or 우비, 편한 신발, 선크림, 카메라/폰 방수파우치 — draft list, user can edit later

**1일차** (08.09 일)
- Timeline: 춘천터미널→강변 (버스) · 강변→수서 (지하철) · 수서→부산 10:00 (SRT) · 부산역→숙소 체크인
- Route sketch: 수서 → 부산 → 숙소 (송정) 방향 동선
- Place card: 모네의 여름 (숙소) — 주소 + 지도 링크

**2일차** (08.10 월)
- Timeline: 오전 해변 산책 · 낮 스카이캡슐 탑승 · 저녁 자유일정
- Route sketch: 미포 ~ 청사포 ~ 송정 캡슐 라인
- Place card: 해운대 블루라인파크 (스카이캡슐) — note + 지도 링크

**3일차** (08.11 화)
- Timeline: 오전 체크아웃·자유일정 · 14:00 부산→수서 (SRT)
- Route sketch: 숙소 → 부산 → 수서 방향 동선 (1일차 반대)
- Place card: 모네의 여름 (숙소) — 체크아웃 기준, 1일차와 동일 정보 재사용

The old "마무리" (부산에서 만나요) closing slide content is dropped — it doesn't fit a tab layout; the header bar's title/date already carries that framing.

## Out of scope (YAGNI)

- Real map embeds / API keys
- Photo assets and `<img>` markup (added later when files are provided)
- JSON/config-driven content (hardcoded HTML is enough for this size)
- Checklist persistence (checked/unchecked state) — static display only
- URL hash routing between tabs
