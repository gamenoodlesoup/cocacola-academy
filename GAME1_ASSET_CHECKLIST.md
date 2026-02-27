# Game 1: Explore & Sort — Complete Asset & Feature Checklist

> **Last Updated:** February 27, 2026
> **Game Route:** `/game` (main), `/tutorial`, `/results`, `/games` (hub)
> **Deployment:** Azure Static Web Apps (SWA) — auto-deploys on push to `main`
> **Status Legend:** ✅ Done | ⚠️ Partial / Placeholder | ❌ Missing

---

## Table of Contents

1. [Item Assets (20 items)](#1-item-assets-20-items)
2. [Area / Map Assets (4 areas + 1 map)](#2-area--map-assets)
3. [Button Assets](#3-button-assets)
4. [UI Icon Assets](#4-ui-icon-assets)
5. [Hand Gesture Assets](#5-hand-gesture-assets)
6. [Branding Assets](#6-branding-assets)
7. [Sound Effects](#7-sound-effects)
8. [Screen-by-Screen Feature Checklist](#8-screen-by-screen-feature-checklist)
9. [Game Mechanics Checklist](#9-game-mechanics-checklist)
10. [Data & Backend Checklist](#10-data--backend-checklist)
11. [Deployment Checklist](#11-deployment-checklist)
12. [Summary: What's Blocking a Playable Game](#12-summary-whats-blocking-a-playable-game)

---

## 1. Item Assets (20 items)

Each item needs **two versions**: a small scene icon (~100×100px) and a large popup close-up (~200×200px). Currently only one SVG per item exists at `/static/assets/items/`, used for both.

### Recyclable Items (10)

| # | Item ID | Name | Area | Scene SVG (`/assets/items/`) | Popup SVG (close-up) | Has Real Art | Notes |
|---|---------|------|------|------|------|------|------|
| 1 | `plastic-bottle` | Plastic Bottle | Kitchen | ✅ `plastic-bottle.svg` | ⚠️ Same file | ✅ Mapped from `white_bottle.svg` | |
| 2 | `aluminum-can` | Aluminum Can | Kitchen | ✅ `aluminum-can.svg` | ⚠️ Same file | ✅ Mapped from `gold_can.svg` | |
| 3 | `glass-bottle` | Glass Bottle | Kitchen | ✅ `glass-bottle.svg` | ⚠️ Same file | ✅ Mapped from `glass_bottle.svg` | |
| 4 | `cardboard-box` | Cardboard Box | Living Room | ✅ `cardboard-box.svg` | ⚠️ Same file | ✅ Mapped from `cardboard_box.svg` | |
| 5 | `newspaper` | Newspaper | Living Room | ✅ `newspaper.svg` | ⚠️ Same file | ✅ Mapped from `newsapaper.svg` | |
| 6 | `steel-can` | Steel Can | Kitchen | ✅ `steel-can.svg` | ⚠️ Same file | ✅ Mapped from `fish_can.svg` | |
| 7 | `milk-carton` | Milk Carton | Kitchen | ✅ `milk-carton.svg` | ⚠️ Same file | ✅ Mapped from `milk_carton.svg` | |
| 8 | `plastic-container` | Plastic Container | Bathroom | ✅ `plastic-container.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |
| 9 | `magazine` | Magazine | Bedroom | ✅ `magazine.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |
| 10 | `water-bottle` | Water Bottle | Bedroom | ✅ `water-bottle.svg` | ⚠️ Same file | ✅ Mapped from `yellow_bottle.svg` | |

### Non-Recyclable Items (10)

| # | Item ID | Name | Area | Scene SVG (`/assets/items/`) | Popup SVG (close-up) | Has Real Art | Notes |
|---|---------|------|------|------|------|------|------|
| 11 | `food-waste` | Food Waste | Kitchen | ✅ `food-waste.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |
| 12 | `plastic-bag` | Plastic Bag | Living Room | ✅ `plastic-bag.svg` | ⚠️ Same file | ✅ Mapped from `plastic_bag.svg` | |
| 13 | `styrofoam` | Styrofoam | Living Room | ✅ `styrofoam.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |
| 14 | `battery` | Battery | Bedroom | ✅ `battery.svg` | ⚠️ Same file | ✅ Mapped from `battery.svg` | |
| 15 | `light-bulb` | Light Bulb | Living Room | ✅ `light-bulb.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |
| 16 | `pizza-box-greasy` | Greasy Pizza Box | Kitchen | ✅ `pizza-box-greasy.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |
| 17 | `chip-bag` | Chip Bag | Living Room | ✅ `chip-bag.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |
| 18 | `disposable-cup` | Disposable Coffee Cup | Bedroom | ✅ `disposable-cup.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |
| 19 | `tissue` | Used Tissue | Bathroom | ✅ `tissue.svg` | ⚠️ Same file | ✅ Mapped from `trash_paper.svg` | |
| 20 | `plastic-straw` | Plastic Straw | Bathroom | ✅ `plastic-straw.svg` | ⚠️ Same file | ❌ **PLACEHOLDER** | Needs real illustrated SVG |

### Item Asset Summary

| Metric | Count |
|--------|-------|
| Total items in game | **20** |
| Items with real illustrated SVGs | **11** |
| Items with placeholder SVGs | **9** |
| Items with separate popup close-up | **0** (all reuse scene SVG) |
| **Items per area** | Kitchen: 7, Living Room: 6, Bedroom: 4, Bathroom: 3 |

### Items Still Needing Real Art (9 placeholder SVGs)

1. ❌ `plastic-container.svg` — Plastic Container (tupperware)
2. ❌ `magazine.svg` — Magazine (glossy magazine)
3. ❌ `food-waste.svg` — Food Waste (banana peel, apple core, scraps)
4. ❌ `styrofoam.svg` — Styrofoam Container (takeout box)
5. ❌ `light-bulb.svg` — Light Bulb (incandescent)
6. ❌ `pizza-box-greasy.svg` — Greasy Pizza Box
7. ❌ `chip-bag.svg` — Chip Bag (snack bag)
8. ❌ `disposable-cup.svg` — Disposable Coffee Cup
9. ❌ `plastic-straw.svg` — Plastic Straw (bendy straw)

### Optional: Popup Close-Up Versions (0/20 done)

Per GAME_FLOW.md, the item popup should show a ~200×200px **close-up** detail image. Currently the same scene SVG is used for both. If separate close-ups are desired:

| Status | Asset Needed |
|--------|-------------|
| ❌ | `plastic-bottle-popup.svg` |
| ❌ | `aluminum-can-popup.svg` |
| ❌ | `glass-bottle-popup.svg` |
| ❌ | `cardboard-box-popup.svg` |
| ❌ | `newspaper-popup.svg` |
| ❌ | `steel-can-popup.svg` |
| ❌ | `milk-carton-popup.svg` |
| ❌ | `plastic-container-popup.svg` |
| ❌ | `magazine-popup.svg` |
| ❌ | `water-bottle-popup.svg` |
| ❌ | `food-waste-popup.svg` |
| ❌ | `plastic-bag-popup.svg` |
| ❌ | `styrofoam-popup.svg` |
| ❌ | `battery-popup.svg` |
| ❌ | `light-bulb-popup.svg` |
| ❌ | `pizza-box-greasy-popup.svg` |
| ❌ | `chip-bag-popup.svg` |
| ❌ | `disposable-cup-popup.svg` |
| ❌ | `tissue-popup.svg` |
| ❌ | `plastic-straw-popup.svg` |

---

## 2. Area / Map Assets

### Map Overview

| Asset | File | Location | Status | Notes |
|-------|------|----------|--------|-------|
| World/city map | `map.png` | `/static/assets/areas/map.png` | ✅ Exists & used | Used in `MapOverview.svelte` as background |

### Area Backgrounds (4 areas)

Each area now has a unique illustrated background PNG. `AreaScene.svelte` renders a **blurred full-bleed copy** (blur 12px, brightness 0.7) behind a **centered sharp copy** at 70% size with rounded corners and drop shadow, plus a gradient tint overlay at 15% opacity.

| # | Area | File | Location | Status | Notes |
|---|------|------|----------|--------|-------|
| 1 | Living Room 🛋️ | `living_room.png` | `/static/assets/areas/` | ✅ **Done** | Blurred bg + centered sharp image |
| 2 | Bathroom 🚿 | `bathroom.png` | `/static/assets/areas/` | ✅ **Done** | Blurred bg + centered sharp image |
| 3 | Kitchen 🍳 | `kitchen.png` | `/static/assets/areas/` | ✅ **Done** | Blurred bg + centered sharp image |
| 4 | Bedroom 🛏️ | `bedroom.png` | `/static/assets/areas/` | ✅ **Done** | Blurred bg + centered sharp image |

> **Note:** Legacy files `room.png` and `map.png` also exist in `/static/assets/areas/`. The `room.png` is no longer used; each area now points to its own specific background in `areas.json`.

### Area Map Pin Icons (4)

Per GAME_FLOW.md: illustrated area tiles on the map, not emoji.

| # | Area | Current | Status | Notes |
|---|------|---------|--------|-------|
| 1 | Living Room | 🛋️ emoji | ❌ **Needs illustrated pin** | |
| 2 | Bathroom | 🚿 emoji | ❌ **Needs illustrated pin** | |
| 3 | Kitchen | 🍳 emoji | ❌ **Needs illustrated pin** | |
| 4 | Bedroom | 🛏️ emoji | ❌ **Needs illustrated pin** | |

---

## 3. Button Assets

### Existing Buttons in `/static/assets/buttons/`

| File | Name | Used In Game 1? | Status |
|------|------|-----------------|--------|
| `back_button.svg` | Back/Return (red, left arrow) | ✅ AreaScene | ✅ In use |
| `green_button.svg` | Green Action (recyclable) | ✅ ItemPopup | ✅ In use |
| `red_button.svg` | Red Action (not recyclable) | ✅ ItemPopup | ✅ In use |
| `blue_button.svg` | Blue Action | ❌ Not used | ⚠️ Available but unused |
| `orange_button.svg` | Orange Action | ❌ Not used | ⚠️ Available but unused |
| `setting_button.svg` | Settings/Gear | ❌ Not used | ⚠️ Available but unused |
| `redo_button.svg` | Redo/Forward | ❌ Not used | ⚠️ Available but unused |
| `undo_button.svg` | Undo/Backward | ❌ Not used | ⚠️ Available but unused |

### Missing Buttons

| Button Needed | Where Used | Status |
|---------------|------------|--------|
| Start / Play button | Start Screen, Tutorial "GOT IT!" | ❌ Currently plain CSS |
| Pause button | Game screen | ❌ Currently ⏸️ emoji |
| Resume button | Pause overlay | ❌ Currently ▶️ emoji + CSS |
| Quit button | Pause overlay | ❌ Currently 🏠 emoji + CSS |
| Play Again button | Results screen | ❌ Currently 🔄 emoji + CSS |
| Close (✕) button | Item Popup | ⚠️ Currently text character |

---

## 4. UI Icon Assets

### Top Bar / HUD Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Timer icon | ⏱️ emoji | ❌ Needs custom SVG | TopBar |
| Score icon | None (text only) | ❌ Needs custom SVG | TopBar |
| Lives / Hearts | ❤️/🖤 emoji | ❌ Needs custom SVG heart | TopBar — filled/empty states |
| Streak fire icon | 🔥 emoji | ❌ Needs custom SVG | TopBar — shown at 3+ streak |
| Areas map icon | 🗺️ emoji | ❌ Needs custom SVG | TopBar |
| Progress bar | CSS only | ⚠️ Functional | Could use themed styling |

### Feedback Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Checkmark (correct) | CSS circle + ✓ text | ❌ Needs illustrated SVG | Green checkmark overlay |
| X mark (incorrect) | CSS circle + ✗ text | ❌ Needs illustrated SVG | Red X overlay |
| Thumbs up | 👍 emoji | ❌ Needs hand gesture SVG | Correct feedback |
| Wave hand | 👋 emoji | ❌ Needs hand gesture SVG | Incorrect feedback |
| Star burst | None | ❌ Needs illustrated asset | Perfect streak (5 in a row) |
| Celebration | 🎉 emoji | ❌ Needs illustrated SVG | Streak bonus |

### Results Screen Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Stars (rating) | ⭐/☆ emoji | ❌ Needs custom star SVG | 0–3 star rating |
| Score icon | 🎯 emoji | ❌ Needs custom SVG | |
| Correct icon | ✅ emoji | ❌ Needs custom SVG | |
| Areas icon | 🗺️ emoji | ❌ Needs custom SVG | |
| Fun fact icon | 💡 emoji | ❌ Needs custom SVG | |
| Confetti / particles | CSS colored rectangles | ❌ Needs real particle effect | |

### Category Tag Icons (ItemPopup)

| Category | Current | Status |
|----------|---------|--------|
| Plastic | ♻️ emoji | ❌ Needs custom icon |
| Metal | 🔩 emoji | ❌ Needs custom icon |
| Glass | 🧪 emoji | ❌ Needs custom icon |
| Paper | 📃 emoji | ❌ Needs custom icon |
| Organic | 🌿 emoji | ❌ Needs custom icon |
| Other | 📦 emoji | ❌ Needs custom icon |

---

## 5. Hand Gesture Assets

Per GAME_FLOW.md: hand-drawn outline style, 3-4px black stroke. No faces/avatars.

### Static Hand Icons

| # | Gesture | Used Where | Status | Notes |
|---|---------|-----------|--------|-------|
| 1 | Pointing hand | Buttons, directions, map hints | ❌ Missing | |
| 2 | Tapping hand | "Tap to inspect" hint on items | ❌ Missing | |
| 3 | Magnifying glass hand | Exploration/search hint | ❌ Missing | |
| 4 | Thumbs up | Success feedback | ❌ Missing | Currently 👍 emoji |
| 5 | Waving hand | Incorrect feedback | ❌ Missing | Currently 👋 emoji |
| 6 | Clapping hands | Celebration / area complete | ❌ Missing | |

### Animated Hand Sequences

| # | Animation | Frames | Used Where | Status |
|---|-----------|--------|-----------|--------|
| 1 | Tap animation | 3 frames | Item tap hint | ❌ Missing |
| 2 | Search/scan sweep | 5 frames | Scene exploration hint | ❌ Missing |
| 3 | Thumbs up animation | 4 frames | Correct feedback | ❌ Missing |
| 4 | Wave no animation | 6 frames | Incorrect feedback | ❌ Missing |
| 5 | Clap animation | 8 frames | Area complete celebration | ❌ Missing |
| 6 | Salute animation | 6-8 frames | Results 90-100% | ❌ Missing |
| 7 | Double thumbs up | 5 frames | Results 70-89% | ❌ Missing |
| 8 | Fist pump animation | 4 frames | Results 50-69% | ❌ Missing |
| 9 | Pat on back | 5 frames | Results <50% | ❌ Missing |

---

## 6. Branding Assets

| Asset | Status | Notes |
|-------|--------|-------|
| Coca-Cola logo (outlined style) | ❌ Missing | Start Screen — currently ♻️ emoji in a circle |
| Game title graphic | ❌ Missing | "Recycling Challenge" — currently plain text |
| Favicon | ✅ `src/lib/assets/favicon.svg` | Used in layout |
| Professor character | ❌ Missing | Map overview — speech bubble hint |
| Background pattern (white with red/green) | ❌ Missing | Start Screen background |

---

## 7. Sound Effects

**Current state: Zero audio files exist. Zero sounds are played.** The `soundEnabled` boolean exists in state but is never used.

### Required Sound Effects

| # | Sound | Trigger | Status |
|---|-------|---------|--------|
| 1 | Positive chime | Correct identification | ❌ Missing |
| 2 | Gentle negative tone | Incorrect identification | ❌ Missing |
| 3 | Special celebration tone | Perfect streak (5 in a row) | ❌ Missing |
| 4 | Area complete jingle | All items in an area found | ❌ Missing |
| 5 | Button tap sound | Any button press | ❌ Missing |
| 6 | Item tap sound | Tapping an item in scene | ❌ Missing |
| 7 | Popup open sound | Item popup opening | ❌ Missing |
| 8 | Zoom transition sound | Entering/exiting an area | ❌ Missing |
| 9 | Game over sound | Lives reach 0 | ❌ Missing |
| 10 | Victory fanfare | Game complete with good score | ❌ Missing |
| 11 | Background music (optional) | During gameplay | ❌ Missing |

---

## 8. Screen-by-Screen Feature Checklist

### 8A. Start Screen (`/` → `+page.svelte`)

| Feature | Status | Notes |
|---------|--------|-------|
| Coca-Cola logo (outlined) | ❌ | Currently ♻️ emoji |
| Game title "Recycling Challenge" | ✅ | Plain text |
| Hand icon pointing to START | ❌ | Uses 👆 emoji, not hand asset |
| Pulsing START button animation | ✅ | CSS pulse works |
| Background white with red/green pattern | ❌ | Plain gradient only |
| "TAP TO START" text | ✅ | |
| Navigate to games hub | ✅ | Goes to `/games` |
| Brand color scheme (#ED1C24, #00A651) | ✅ | Hardcoded in CSS |

### 8B. Tutorial Screen (`/tutorial`)

| Feature | Status | Notes |
|---------|--------|-------|
| Step 1: Map overview visual | ❌ | 🗺️ emoji only |
| Step 2: Hand tapping area visual | ❌ | No illustrated tap gesture |
| Step 3: Items scattered in scene visual | ❌ | 🔍 emoji only |
| Step 4: Item popup with name/image/desc | ⚠️ | Shows emoji-based example popup |
| Step 5: Recyclable / Not choice buttons | ⚠️ | Shown in example popup |
| Step 6: Feedback checkmark/X | ❌ | 🎮 emoji only |
| Swipe left/right navigation | ✅ | Touch + keyboard |
| Progress dots | ✅ | |
| "GOT IT!" / "START GAME!" button | ✅ | |
| Skip tutorial option | ✅ | |

### 8C. Games Hub (`/games`)

| Feature | Status | Notes |
|---------|--------|-------|
| "Choose Your Challenge" title | ✅ | |
| 3 game cards with stagger animation | ✅ | CSS slide-up |
| Game 1 card (Explore & Sort) | ✅ | Navigates to `/tutorial` |
| Game 2 card (Plastic Scanner) | ✅ | Card exists, route `/game/scanner` implemented (~1043 lines) |
| Game 3 card (Home Lab) | ✅ | Card exists, route `/game/lab` implemented (~1385 lines) |
| Card illustrations / thumbnails | ❌ | All emoji icons |
| Difficulty stars + duration badges | ✅ | Emoji-based |
| Back button to `/` | ✅ | |

### 8D. Map Overview (component: `MapOverview.svelte`)

| Feature | Status | Notes |
|---------|--------|-------|
| Map background image | ✅ | Uses `map.png` |
| 4 clickable area pins | ✅ | Living Room, Bathroom, Kitchen, Bedroom |
| Area pin illustrations | ❌ | Emoji icons (🛋️🚿🍳🛏️) |
| Area name labels | ✅ | |
| Progress counter per area (e.g., "3/8") | ✅ | |
| Completed area checkmark | ✅ | ✅ emoji overlay |
| Pin drop animation (staggered) | ✅ | |
| Glow/pulse on hover | ✅ | CSS glow |
| Professor character with speech bubble | ❌ | Not implemented |
| Disabled/locked areas (progressive unlock) | ❌ | Not implemented (optional per spec) |

### 8E. Area Scene (component: `AreaScene.svelte`)

| Feature | Status | Notes |
|---------|--------|-------|
| Rich illustrated background | ✅ | **Done** — blurred full-bleed bg (blur 12px, brightness 0.7) + centered sharp copy at 70% with rounded corners + gradient overlay at 15% opacity |
| Items scattered naturally in scene | ✅ | Positioned via `item.position`, enlarged to ~100px base |
| Item SVG images | ✅ | 20 items, 11 real art / 9 placeholder |
| Item glow/sparkle hint (undiscovered) | ✅ | CSS `glowPulse` animation |
| Item floating/bobbing animation | ✅ | CSS `itemBob` |
| ✅/❌ badge on identified items | ✅ | |
| Greyed out identified items | ✅ | Opacity 0.5 |
| Back to map button | ✅ | Uses `back_button.svg` |
| Area name + icon header | ✅ | |
| Progress bar | ✅ | |
| Remaining items counter | ✅ | |
| Pinch to zoom (optional) | ❌ | Not implemented |
| Pan/scroll for extended scenes | ❌ | Not implemented |

### 8F. Item Popup (component: `ItemPopup.svelte`)

| Feature | Status | Notes |
|---------|--------|-------|
| Modal overlay with dark backdrop | ✅ | |
| Close button (✕) top-right | ✅ | Text character, not SVG |
| Item image (close-up) | ⚠️ | Same SVG as scene (no close-up version) |
| Item name (bold) | ✅ | |
| Description text | ✅ | |
| Category tag with icon | ✅ | Emoji-based categories |
| ♻️ RECYCLABLE green button | ✅ | Uses `green_button.svg` |
| 🚫 NOT RECYCLABLE red button | ✅ | Uses `red_button.svg` |
| Entry animation (scale + fade) | ✅ | Spring curve |
| Backdrop click does NOT close | ✅ | Must use ✕ or answer |
| Fun fact display | ❌ | `funFact` exists in data but not shown in popup |

### 8G. Feedback Animation (component: `FeedbackAnimation.svelte`)

| Feature | Status | Notes |
|---------|--------|-------|
| **Correct:** green checkmark overlay | ✅ | CSS circle + text ✓ |
| **Correct:** "+10" floating text | ✅ | CSS float-up animation |
| **Correct:** thumbs up | ⚠️ | 👍 emoji, not hand asset |
| **Correct:** sound (positive chime) | ❌ | No audio |
| **Correct:** auto-close after 1s | ⚠️ | Closes after 1.8s (spec says 1s) |
| **Incorrect:** red X overlay | ✅ | CSS circle + text ✗ |
| **Incorrect:** correct answer revealed | ✅ | Shows description text |
| **Incorrect:** -1 life indicator | ✅ | Lives decrement in store |
| **Incorrect:** wave hand | ⚠️ | 👋 emoji, not hand asset |
| **Incorrect:** sound (gentle tone) | ❌ | No audio |
| **Incorrect:** auto-close after 2s | ⚠️ | Closes after 1.8s (spec says 2s) |
| **Streak 5:** star burst animation | ⚠️ | Golden banner text, no particle burst |
| **Streak 5:** "+50 bonus" text | ✅ | Shown in banner |
| **Streak 5:** special celebration sound | ❌ | No audio |
| Haptic vibration | ✅ | `navigator.vibrate()` implemented |
| Professor character reactions | ❌ | Not implemented |

### 8H. Results Screen (`/results`)

| Feature | Status | Notes |
|---------|--------|-------|
| Title ("Great Job!" / "Keep Learning!") | ✅ | Dynamic based on score |
| Score display (animated count-up) | ✅ | Ease-out cubic ~1.5s |
| Accuracy percentage (animated) | ✅ | |
| Items sorted breakdown | ✅ | correct/total |
| Areas completed count | ✅ | |
| Star rating (0-3) | ✅ | ⭐/☆ emoji |
| Fun fact about recycling | ✅ | Hardcoded array |
| Hand gesture animation per score range | ❌ | No hand animations |
| Confetti effect | ⚠️ | Basic CSS rectangles (not real particles) |
| "PLAY AGAIN" button | ✅ | Works |
| "GAME MENU" button | ✅ | Goes to `/games` |
| Auto-return countdown (5s) | ✅ | |
| Victory/defeat illustrations | ❌ | None |
| Data sync to Azure | ❌ | Backend not connected |

### 8I. Pause Menu (in `game/+page.svelte`)

| Feature | Status | Notes |
|---------|--------|-------|
| Pause overlay | ✅ | |
| Current stats display | ✅ | Score, lives, streak, items, accuracy |
| Resume button | ✅ | ▶️ emoji + CSS |
| Quit button | ✅ | 🏠 emoji + CSS |
| Pause button icon | ⚠️ | ⏸️ emoji (not SVG) |

---

## 9. Game Mechanics Checklist

### Core Mechanics

| Mechanic | Status | Notes |
|----------|--------|-------|
| Map → area → popup → feedback → map loop | ✅ | Fully wired game phases |
| 4 areas with unique item sets | ✅ | 20 items across 4 areas (Kitchen:7, Living Room:6, Bedroom:4, Bathroom:3) |
| Recyclable / Not Recyclable binary choice | ✅ | |
| +10 points per correct | ✅ | |
| -1 life per incorrect (3 lives max) | ✅ | |
| Perfect streak at 5: +50 bonus | ✅ | |
| Area completion bonus: +20 per area | ❌ | **Not implemented** — spec says +20 per cleared area |
| Time bonus: +5 per 30s remaining | ❌ | **Not implemented** — spec says time bonus at end |
| Game over at 0 lives | ✅ | |
| Game over when all areas complete | ✅ | |
| Timer (countdown or elapsed) | ✅ | Elapsed time, not countdown |
| Zoom-in transition to area | ✅ | With animation |
| Zoom-out transition back to map | ⚠️ | Instant (no reverse zoom animation) |

### Item Visibility / Difficulty

| Feature | Status | Notes |
|---------|--------|-------|
| Easy areas: items clearly visible, glow | ✅ | All items glow equally |
| Medium areas: some items partially hidden | ❌ | No item hiding logic |
| Hard areas: items well-camouflaged | ❌ | No camouflage logic |
| Difficulty-based hint intensity | ❌ | Not implemented |

### Missing Spec Features

| Feature | Spec Reference | Status |
|---------|---------------|--------|
| Area completion bonus (+20 pts) | Scoring System | ❌ Not implemented |
| Time bonus at game end | Scoring System | ❌ Not implemented |
| Timer countdown mode option | Game Over Conditions | ❌ Timer is elapsed-only |
| Progressive area unlock | Map Overview | ❌ All areas open from start |
| Item count per area matches spec | Map Areas table | ⚠️ Spec: 50 total, Actual: 20 total (7+6+4+3 across 4 areas) |

---

## 10. Data & Backend Checklist

### i18n / Localization

| Feature | Status | Notes |
|---------|--------|-------|
| Paraglide i18n infrastructure | ✅ | Configured, `en.json` + `zh-hk.json` exist |
| Game components use translated strings | ❌ | **All text is hardcoded English** |
| Item names/descriptions translated | ⚠️ | `nameZhHK` and `descriptionZhHK` exist in `items.json` but components don't use them |
| Language toggle visible to user | ❌ | Locale switcher is `display: none` |

### Azure Backend

| Feature | Status | Notes |
|---------|--------|-------|
| User login/selection | ❌ | Deferred |
| Game session API | ❌ | Not connected |
| Save item results during play | ❌ | Client-only |
| Session completion API | ❌ | Client-only |
| Dashboard data fetch | ❌ | No dashboard route |
| Screenshot upload | ❌ | Not implemented |
| Offline mode / IndexedDB cache | ❌ | Not implemented |

### Dashboard Screen

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard route (`/dashboard`) | ❌ | Route doesn't exist |
| Overall stats cards | ❌ | |
| Recent sessions list | ❌ | |
| Learning progress by item type | ❌ | |
| Achievement badges | ❌ | |

---

## 11. Deployment & Infrastructure Checklist

| Feature | Status | Notes |
|---------|--------|-------|
| SvelteKit adapter-static | ✅ | Outputs to `build/`, SPA fallback `index.html` |
| Prerender + SSR off | ✅ | `src/routes/+layout.ts` exports `prerender = true`, `ssr = false` |
| Azure Static Web Apps (Free tier) | ✅ | Live at `*.azurestaticapps.net` |
| GitHub Actions CI/CD | ✅ | `.github/workflows/azure-static-web-apps-wonderful-water-0acc84300.yml` |
| pnpm 10 + Node 22 in pipeline | ✅ | Installed via GitHub Actions |
| SWA routing config | ✅ | `staticwebapp.config.json` with SPA fallback |
| Custom domain | ❌ | Not configured yet |
| Environment variables / secrets | ✅ | `AZURE_STATIC_WEB_APPS_API_TOKEN_WONDERFUL_WATER_0ACC84300` in repo |

---

## 12. Summary: What's Blocking a Playable Game

### The game IS playable right now with:
- ✅ Full game loop (map → area → popup → feedback → results)
- ✅ 20 items with data (names, descriptions, recyclable status, fun facts)
- ✅ 4 areas with unique illustrated backgrounds (blurred + centered sharp image)
- ✅ Scoring, lives, streaks
- ✅ 11 real illustrated item SVGs + 9 placeholder SVGs
- ✅ Map background image
- ✅ 3 button SVGs (back, green, red)
- ✅ Responsive iPad layout (100dvh, no scroll, centered)
- ✅ Touch controls + haptic feedback
- ✅ Game 2 (Plastic Scanner) and Game 3 (Home Lab) routes implemented
- ✅ Azure Static Web Apps deployment (live temp URL)

### Critical Missing (Blocks polished release)

| Priority | Category | Count | Details |
|----------|----------|-------|---------|
| 🔴 HIGH | Placeholder item SVGs | **9** | plastic-container, magazine, food-waste, styrofoam, light-bulb, pizza-box-greasy, chip-bag, disposable-cup, plastic-straw |
| 🔴 HIGH | Sound effects | **10+** | Zero audio in the entire game |
| 🟡 MED | Hand gesture assets (static) | **6** | No hand illustrations at all |
| 🟡 MED | Hand gesture animations | **9** | No animated hand sequences |
| 🟡 MED | i18n integration | **All screens** | Paraglide exists but no component uses translations |
| 🟡 MED | UI icons replacing emoji | **~20** | Hearts, timer, fire, stars, categories, etc. |
| 🟡 MED | Area pin illustrations | **4** | Map pins are emoji |
| 🟡 MED | Branding (logo, title graphic) | **2** | No Coca-Cola logo or styled title |
| 🟡 MED | Area completion bonus (+20) | **1** | Scoring not matching spec |
| 🟡 MED | Item count gap vs spec | **30 items** | Spec calls for ~50 items, only 20 exist |
| 🟢 LOW | Popup close-up images | **20** | Separate detailed item views |
| 🟢 LOW | Professor character | **1** | Map hint character |
| 🟢 LOW | Confetti / particle effects | **1** | Results screen |
| 🟢 LOW | Feedback timing (1s/2s) | **1** | Currently 1.8s for both |
| 🟢 LOW | Reverse zoom-out animation | **1** | Returning to map is instant |
| 🟢 LOW | Azure backend | **All** | Login, sessions, dashboard, sync |
| 🟢 LOW | Custom domain | **1** | Using default azurestaticapps.net URL |

### Asset Counts Summary

| Asset Type | Exists | Needed | Gap |
|------------|--------|--------|-----|
| Item scene SVGs (real art) | 11 | 20 | **9** |
| Item popup close-ups | 0 | 20 (optional) | **20** |
| Area backgrounds | **4** | 4 | **0** ✅ |
| Area pin icons | 0 | 4 | **4** |
| Map image | 1 | 1 | **0** |
| Button SVGs | 3 used | 3+ needed | **~3** |
| Hand gestures (static) | 0 | 6 | **6** |
| Hand animations | 0 | 9 | **9** |
| UI icons (HUD, feedback, etc.) | 0 | ~20 | **~20** |
| Branding assets | 1 (favicon) | 3 | **2** |
| Sound effects | 0 | 10+ | **10+** |
| **TOTAL ASSETS** | **~20** | **~120+** | **~100+** |

### Unmapped Icon Assets Available (not yet used)

These exist in `src/lib/assets/icons/` but are not assigned to any game item:

| File | Description | Could Be |
|------|-------------|----------|
| `books.svg` | Stack of 3 colorful books | Bedroom area item |
| `clock.svg` | Vintage alarm clock | Bedroom area item |
| `computer_monitor.svg` | Desktop monitor | Living Room/e-waste item |
| `cotton_buds.svg` | Two cotton swabs | Bathroom/hygiene item |
| `fish_bone.svg` | Fish skeleton | Kitchen/food waste item |
| `old_shirt.svg` | Worn shirt | Bedroom/textile recycling item |

### Recent Wins (completed this session)
- ✅ Area backgrounds: Added 4 illustrated PNGs with blurred + centered sharp rendering
- ✅ Item icons enlarged to ~100px base size
- ✅ All screens fixed to 100dvh / no-scroll / centered
- ✅ Viewport width constrained (max-width: 100vw, overflow-x: hidden)
- ✅ Azure Static Web Apps deployment with GitHub Actions CI/CD

---

*This document should be updated as assets are created and features are implemented.*
