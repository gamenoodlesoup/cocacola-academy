# Game 2: Plastic Scanner — Complete Asset & Feature Checklist

> **Last Updated:** February 27, 2026
> **Game Route:** `/game/scanner` (~1043 lines)
> **Difficulty:** ⭐⭐ (Medium)
> **Duration:** 3–5 min
> **Deployment:** Azure Static Web Apps (SWA) — auto-deploys on push to `main`
> **Status Legend:** ✅ Done | ⚠️ Partial / Placeholder | ❌ Missing

---

## Table of Contents

1. [Plastic Item Assets (13 items)](#1-plastic-item-assets-13-items)
2. [Scanner Machine Assets](#2-scanner-machine-assets)
3. [Dial Control Assets](#3-dial-control-assets)
4. [Plastic Type Route Buttons](#4-plastic-type-route-buttons)
5. [UI Icon Assets](#5-ui-icon-assets)
6. [Button Assets](#6-button-assets)
7. [Sound Effects](#7-sound-effects)
8. [Screen-by-Screen Feature Checklist](#8-screen-by-screen-feature-checklist)
9. [Game Mechanics Checklist](#9-game-mechanics-checklist)
10. [Data & i18n Checklist](#10-data--i18n-checklist)
11. [Summary: Asset Gap Analysis](#11-summary-asset-gap-analysis)

---

## 1. Plastic Item Assets (13 items)

Each item is currently only represented by an **emoji** inside the scanner frame. No SVG or PNG illustrations exist.

### PET (Polyethylene Terephthalate) — Code ♻️1

| # | Item ID | Name | Emoji | Has SVG | Properties (melt/dens/soft/chl) | Notes |
|---|---------|------|-------|---------|----------------------------------|-------|
| 1 | `pet-water-bottle` | Water Bottle | 🧴 | ❌ | 85/75/55/10 | Sinks, rigid, clear |
| 2 | `pet-food-tray` | Food Tray | 🍱 | ❌ | 82/73/52/8 | Sinks, rigid, clear |
| 3 | `pet-soda-bottle` | Soda Bottle | 🍾 | ❌ | 88/76/56/8 | Sinks, rigid, clear |

### HDPE (High-Density Polyethylene) — Code ♻️2

| # | Item ID | Name | Emoji | Has SVG | Properties (melt/dens/soft/chl) | Notes |
|---|---------|------|-------|---------|----------------------------------|-------|
| 4 | `hdpe-milk-jug` | Milk Jug | 🥛 | ❌ | 48/42/55/5 | Floats, flexible, opaque |
| 5 | `hdpe-shampoo` | Shampoo Bottle | 🧴 | ❌ | 50/44/58/5 | Floats, flexible, opaque |

### PVC (Polyvinyl Chloride) — Code ♻️3

| # | Item ID | Name | Emoji | Has SVG | Properties (melt/dens/soft/chl) | Notes |
|---|---------|------|-------|---------|----------------------------------|-------|
| 6 | `pvc-pipe` | PVC Pipe Piece | 🔧 | ❌ | 58/78/55/90 | Sinks, rigid, **high chlorine** |
| 7 | `pvc-credit-card` | Old Credit Card | 💳 | ❌ | 55/76/50/88 | Sinks, rigid, **high chlorine** |

### LDPE (Low-Density Polyethylene) — Code ♻️4

| # | Item ID | Name | Emoji | Has SVG | Properties (melt/dens/soft/chl) | Notes |
|---|---------|------|-------|---------|----------------------------------|-------|
| 8 | `ldpe-bag` | Plastic Bag | 🛍️ | ❌ | 38/38/50/5 | Floats, flexible |
| 9 | `ldpe-soft-cap` | Soft Cap | 🧢 | ❌ | 40/36/48/5 | Floats, flexible |

### PP (Polypropylene) — Code ♻️5

| # | Item ID | Name | Emoji | Has SVG | Properties (melt/dens/soft/chl) | Notes |
|---|---------|------|-------|---------|----------------------------------|-------|
| 10 | `pp-yogurt-cup` | Yogurt Cup | 🥤 | ❌ | 58/38/65/5 | Floats, flexible |
| 11 | `pp-bottle-cap` | Bottle Cap | 🔴 | ❌ | 60/36/68/5 | Floats, rigid |

### PS (Polystyrene) — Code ♻️6

| # | Item ID | Name | Emoji | Has SVG | Properties (melt/dens/soft/chl) | Notes |
|---|---------|------|-------|---------|----------------------------------|-------|
| 12 | `ps-foam-cup` | Foam Cup | ☕ | ❌ | 78/45/62/8 | Sinks, brittle |
| 13 | `ps-foam-lid` | Foam Bowl Lid | 🍽️ | ❌ | 76/43/58/6 | Sinks, brittle |

### Item Asset Summary

| Metric | Count |
|--------|-------|
| Total plastic items | **13** |
| Items with illustrated SVGs | **0** |
| Items with emoji only | **13** |
| Plastic types covered | **6** (PET, HDPE, PVC, LDPE, PP, PS) |

---

## 2. Scanner Machine Assets

The entire scanner machine (conveyor belt, frame, scan line) is built with **pure CSS gradients and borders**. No image assets exist.

| Asset | Current State | Status | Notes |
|-------|--------------|--------|-------|
| Conveyor belt | CSS gradient (`#1a2a3a→#2a3a4a`) + 4px border | ❌ **Needs illustration** | |
| Belt rivets (12) | CSS radial-gradient circles | ❌ **Needs illustration** | Decorative rivets on belt |
| Scanner frame | Red CSS gradient box | ❌ **Needs illustration** | Should be a proper scanner device |
| Scanner glass | 100×100px CSS area (emoji shown inside) | ❌ **Needs illustration** | Display window for scanned item |
| Scan line | Red CSS box-shadow, slides up/down | ⚠️ Functional | Could benefit from custom art |
| Scanner glow effect | CSS `scanPulse` animation on shadow | ⚠️ Functional | Box-shadow pulse during scan |
| Background / lab scene | None (plain page background) | ❌ **Needs illustration** | Factory/lab environment scene |

---

## 3. Dial Control Assets

4 dials in a 2×2 grid. Each dial is pure CSS (slider track + orange gradient knob + emoji icon). Labels show Chinese (`dial.labelZh`) by default.

| # | Dial | Emoji Icon | Label (ZH) | Range | Status | Notes |
|---|------|-----------|-------------|-------|--------|-------|
| 1 | Melting Point | 🌡️ | 熔點 | 0–100 | ❌ **Needs custom art** | Thermometer dial |
| 2 | Density | ⚖️ | 密度 | 0–100 | ❌ **Needs custom art** | Scale/weight dial |
| 3 | Softening Point | 🔥 | 軟化點 | 0–100 | ❌ **Needs custom art** | Heat gauge dial |
| 4 | Chlorine | ☣️ | 氯含量 | 0–100 | ❌ **Needs custom art** | Chemical indicator |

### Dial Component Assets Needed

| Asset | Current | Status | Notes |
|-------|---------|--------|-------|
| Dial track/rail | CSS gradient strip | ❌ | Slider background |
| Dial knob | Orange CSS gradient circle + emoji | ❌ | Draggable control |
| ◀/▶ Adjustment buttons | CSS buttons with text arrows | ❌ | Fine-tune controls |
| Dial value readout | Plain text number | ⚠️ | Could use LCD/digital display style |

---

## 4. Plastic Type Route Buttons

6 buttons in a 3×2 grid. Color-coded per plastic type. Currently CSS-only + ♻️ emoji.

| # | Type | Code | Color | Current | Status |
|---|------|------|-------|---------|--------|
| 1 | PET | ♻️1 | Blue (`#3498db`) | ♻️ emoji + text | ❌ **Needs icon/illustration** |
| 2 | HDPE | ♻️2 | Green (`#2ecc71`) | ♻️ emoji + text | ❌ **Needs icon/illustration** |
| 3 | PVC | ♻️3 | Orange (`#e67e22`) | ♻️ emoji + text | ❌ **Needs icon/illustration** |
| 4 | LDPE | ♻️4 | Teal (`#1abc9c`) | ♻️ emoji + text | ❌ **Needs icon/illustration** |
| 5 | PP | ♻️5 | Red (`#e74c3c`) | ♻️ emoji + text | ❌ **Needs icon/illustration** |
| 6 | PS | ♻️6 | Purple (`#9b59b6`) | ♻️ emoji + text | ❌ **Needs icon/illustration** |

---

## 5. UI Icon Assets

### Status Bar Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Timer icon | ⏱️ emoji | ❌ Needs custom SVG | Status bar |
| Score icon | 🏆 emoji | ❌ Needs custom SVG | Status bar |
| Lives / Hearts | ❤️ emoji (dimmed when lost) | ❌ Needs custom SVG | Filled/empty states |
| Back button | "← Back" text | ⚠️ | Could use `back_button.svg` |

### Hint Bar Icons

| Icon | Current | Trigger | Status |
|------|---------|---------|--------|
| Float indicator | 🫧 emoji | Density low → "floats" | ❌ Needs custom icon |
| Sink indicator | ⬇️ emoji | Density high → "sinks" | ❌ Needs custom icon |
| Sharp melt peak | 📈 emoji | Sharp melting curve | ❌ Needs custom icon |
| Broad melt peak | 📊 emoji | Broad melting curve | ❌ Needs custom icon |
| Flexible bend | 🔄 emoji | Bends easily | ❌ Needs custom icon |
| Brittle snap | 💥 emoji | Snaps/crumbles | ❌ Needs custom icon |
| Rigid indicator | 🪨 emoji | Very rigid | ❌ Needs custom icon |
| Chlorine alert | ⚠️ emoji | High chlorine detected | ❌ Needs custom icon |

### Recycling Code Badge

| Asset | Current | Status | Notes |
|-------|---------|--------|-------|
| ♻️ triangle with number | ♻️ emoji + text number | ❌ Needs proper SVG | Standard recycling symbol per code |

### Feedback & Results Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Correct checkmark | ✅ emoji | ❌ Needs illustrated SVG | |
| Incorrect X | ❌ emoji | ❌ Needs illustrated SVG | |
| Trophy icon | 🏆 emoji | ❌ Needs custom SVG | Results screen |
| Thumbs up | 👍 emoji | ❌ Needs hand SVG | Good score feedback |
| Strong arm | 💪 emoji | ❌ Needs illustrated SVG | Results motivation |

---

## 6. Button Assets

### Existing Shared Buttons Used

| File | Used For | Status |
|------|----------|--------|
| `/assets/box/msg_box.png` | Tutorial card + feedback card border (nine-patch) | ✅ In use |
| Nine-patch button classes | "Got it!", "Scan Item", "Next Item" etc. | ✅ CSS nine-patch from global button SVGs |

### Missing Buttons

| Button Needed | Where Used | Current | Status |
|---------------|------------|---------|--------|
| Scan Item button | Scanning phase | CSS "🔍 Scan Item" text | ❌ Needs custom art |
| Route/Sort buttons (×6) | After scanning | CSS colored buttons | ❌ Needs custom art |
| Next Item button | Feedback phase | Nine-patch CSS | ⚠️ Functional |
| See Results button | Last feedback | Nine-patch CSS | ⚠️ Functional |
| Play Again button | Results screen | Nine-patch CSS | ⚠️ Functional |
| Game Menu button | Results screen | Nine-patch CSS | ⚠️ Functional |

---

## 7. Sound Effects

**Current state: Zero audio files exist. Zero sounds are played.**

### Required Sound Effects

| # | Sound | Trigger | Status |
|---|-------|---------|--------|
| 1 | Scan initiation beep | Player taps "Scan Item" | ❌ Missing |
| 2 | Scan line sweep | During 1s scan animation | ❌ Missing |
| 3 | Scan complete chime | Scan finishes, hints revealed | ❌ Missing |
| 4 | Dial adjust tick | Player moves a dial | ❌ Missing |
| 5 | Route selection click | Player taps a plastic type | ❌ Missing |
| 6 | Correct identification chime | Correct answer | ❌ Missing |
| 7 | Incorrect buzz | Wrong answer | ❌ Missing |
| 8 | Conveyor belt movement | New item slides in | ❌ Missing |
| 9 | Timer warning | Timer ≤ 30s (red pulse) | ❌ Missing |
| 10 | Game over sound | Lives = 0 or time = 0 | ❌ Missing |
| 11 | Victory fanfare | Good results score | ❌ Missing |
| 12 | Background ambience (optional) | Factory/lab hum during gameplay | ❌ Missing |

---

## 8. Screen-by-Screen Feature Checklist

### 8A. Tutorial Overlay

| Feature | Status | Notes |
|---------|--------|-------|
| Nine-patch card border | ✅ | Uses `/assets/box/msg_box.png` |
| 6 plastic type color tags | ✅ | CSS `.line-tag` spans (PET–PS) |
| Explanation text | ✅ | Hardcoded English |
| "Got it!" button | ✅ | Nine-patch red button |
| Animated tutorial illustration | ❌ | No visual demonstration |
| Dial usage instructions visual | ❌ | Text-only explanation |

### 8B. Status Bar

| Feature | Status | Notes |
|---------|--------|-------|
| Back button | ✅ | "← Back" text to `/games` |
| Timer (countdown from 2:00) | ✅ | ⏱️ emoji + MM:SS format |
| Score display | ✅ | 🏆 emoji + number |
| Lives (hearts) | ✅ | ❤️ emoji × 3, dimmed on loss |
| Item counter (X/13) | ✅ | Text "Item X/Y" |
| Timer red pulse at ≤30s | ✅ | CSS `timerPulse` animation |

### 8C. Scanning Phase

| Feature | Status | Notes |
|---------|--------|-------|
| Conveyor belt visual | ⚠️ | CSS gradient + rivets (no illustration) |
| Item in scanner frame | ⚠️ | Emoji in CSS box (no illustration) |
| "🔍 Scan Item" button | ✅ | Functional |
| Scan line animation (1s) | ✅ | Red line slides across frame |
| Scanner glow pulse | ✅ | CSS `scanPulse` during scan |
| Item slide-in animation | ✅ | `slideInRight` 0.45s cubic-bezier |
| Recycling code badge | ✅ | ♻️ emoji + number + type name |
| Hint bar (8 emoji indicators) | ✅ | Shows after scan completes |
| 4 dial controls | ✅ | Functional sliders with ◀/▶ buttons |
| 6 route buttons (3×2 grid) | ✅ | Color-coded, functional |

### 8D. Feedback Phase

| Feature | Status | Notes |
|---------|--------|-------|
| ✅/❌ result indicator | ✅ | Emoji-based |
| Correct/incorrect text | ✅ | |
| Fun fact display | ✅ | Per-item fun facts |
| Dial comparison (if wrong) | ✅ | Side-by-side player vs correct values |
| `feedbackPop` scale animation | ✅ | 0.8 → 1.0 scale |
| "Next Item →" button | ✅ | |
| "See Results" (on last item) | ✅ | |
| Sound effect | ❌ | No audio |

### 8E. Results Screen

| Feature | Status | Notes |
|---------|--------|-------|
| Title ("Expert!" / "Keep Learning!") | ✅ | Dynamic based on accuracy |
| Score stat card | ✅ | Gold text on semitransparent bg |
| Accuracy percentage | ✅ | |
| Correct count (X/13) | ✅ | |
| Best streak | ✅ | |
| Per-item result rows | ✅ | ✅/❌ + item name + player choice vs correct |
| "PLAY AGAIN" button | ✅ | Nine-patch |
| "GAME MENU" button | ✅ | Nine-patch |
| Auto-return countdown (5s) | ✅ | Returns to `/games` |
| Confetti / celebration | ❌ | None |
| Sound effects | ❌ | None |
| Hand gesture animation | ❌ | None |

---

## 9. Game Mechanics Checklist

### Core Mechanics

| Mechanic | Status | Notes |
|----------|--------|-------|
| Conveyor belt → scan → dials → route → feedback loop | ✅ | Fully wired |
| 13 plastic items, 6 types | ✅ | Shuffled randomly each game |
| 4 dial readings (melt, density, softening, chlorine) | ✅ | 0–100 range, default 50 |
| Hint bar after scanning | ✅ | 8 emoji indicators |
| 6 plastic type route buttons | ✅ | PET, HDPE, PVC, LDPE, PP, PS |
| Scoring: 15 base + 5 streak (≥3) + dial accuracy bonus | ✅ | Up to ~30 pts per item |
| -1 life per incorrect (3 max) | ✅ | |
| Timer: 120s countdown | ✅ | Red pulse at ≤30s |
| Game over: lives = 0 OR timer = 0 OR all 13 done | ✅ | |
| Results breakdown | ✅ | Per-item with dial comparison |

### Animations

| Animation | Status | Notes |
|-----------|--------|-------|
| `slideInRight` — new item entry | ✅ | 0.45s cubic-bezier |
| `scanPulse` — scanner frame glow | ✅ | During scan |
| `hintFadeIn` — hint bar reveal | ✅ | After scan complete |
| `scanLabelPulse` — "Scanning..." text | ✅ | During scan |
| `feedbackPop` — feedback card | ✅ | Scale 0.8 → 1.0 |
| `timerPulse` — urgent timer | ✅ | When ≤30s remaining |
| Dial knob drag effect | ✅ | `scale(1.2)` + glow |
| Route button press effect | ✅ | `translateY(2px)` on `:active` |

---

## 10. Data & i18n Checklist

### Data Files

| File | Items | Status | Notes |
|------|-------|--------|-------|
| `src/lib/data/plastics.json` | 13 items | ✅ | Complete with properties, hints, fun facts |
| `src/stores/scannerStore.ts` | — | ✅ | Full game state + timer + scoring |
| `src/types/scanner.ts` | — | ✅ | All types defined |

### i18n / Localization

| Feature | Status | Notes |
|---------|--------|-------|
| Paraglide i18n infrastructure | ✅ | Configured project-wide |
| Item names: `nameZhHK` in data | ✅ | Available but **not used in components** |
| Dial labels: shows `labelZh` (Chinese) | ⚠️ | **Shows Chinese by default**, not toggled by locale |
| Tutorial text translated | ❌ | Hardcoded English |
| Feedback text translated | ❌ | Hardcoded English |
| UI controls translated | ❌ | Hardcoded English |
| Fun facts translated | ❌ | Hardcoded English only |

---

## 11. Summary: Asset Gap Analysis

### The game IS functional right now with:
- ✅ Full game loop (scan → dials → route → feedback → results)
- ✅ 13 plastic items with complete data (properties, hints, fun facts)
- ✅ 6 plastic types with color-coded route buttons
- ✅ 4 functional dial controls
- ✅ 120s countdown timer with urgency indicator
- ✅ Scoring with streak bonus + dial accuracy bonus
- ✅ Slide-in animations, scan pulse, hint fade
- ✅ Nine-patch card borders from shared assets
- ✅ Results screen with per-item breakdown

### Critical Missing (Blocks polished release)

| Priority | Category | Count | Details |
|----------|----------|-------|---------|
| 🔴 HIGH | Plastic item illustrations | **13** | All 13 items are emoji-only (🧴🍱🍾🥛🔧💳🛍️🧢🥤🔴☕🍽️) |
| 🔴 HIGH | Scanner machine illustration | **1** | Conveyor belt + frame are pure CSS |
| 🔴 HIGH | Sound effects | **12** | Zero audio in the entire game |
| 🟡 MED | Dial control artwork | **4** | Knobs, tracks, icons are CSS + emoji |
| 🟡 MED | Hint bar icons | **8** | All 8 hint indicators are emoji |
| 🟡 MED | Route button icons | **6** | ♻️ emoji + text only |
| 🟡 MED | Background scene | **1** | No factory/lab background |
| 🟡 MED | i18n integration | **All screens** | Paraglide exists but not used; dial labels stuck in Chinese |
| 🟡 MED | UI icons (HUD) | **~5** | Timer, score, hearts, back, trophy |
| 🟡 MED | Recycling code SVGs | **6** | Standard ♻️ triangle with number icons |
| 🟢 LOW | Confetti / celebration | **1** | Results screen |
| 🟢 LOW | Tutorial illustration | **1** | Visual demo of scanning process |
| 🟢 LOW | Feedback icons | **2** | Custom checkmark + X mark |

### Asset Counts Summary

| Asset Type | Exists | Needed | Gap |
|------------|--------|--------|-----|
| Plastic item SVGs | 0 | 13 | **13** |
| Scanner machine illustration | 0 | 1 | **1** |
| Background scene | 0 | 1 | **1** |
| Dial control artwork | 0 | 4 sets | **4** |
| Hint icons | 0 | 8 | **8** |
| Route button icons | 0 | 6 | **6** |
| Recycling code SVGs | 0 | 6 | **6** |
| UI icons (HUD, feedback) | 0 | ~7 | **~7** |
| Button artwork | 0 | ~3 | **~3** |
| Tutorial illustration | 0 | 1 | **1** |
| Sound effects | 0 | 12 | **12** |
| **TOTAL ASSETS** | **~0** | **~62** | **~62** |

> **Note:** Game 2 shares the nine-patch message box (`/assets/box/msg_box.png`) and global button SVGs with Games 1 & 3. No scanner-specific image assets exist anywhere in the project.

---

*This document should be updated as assets are created and features are implemented.*
