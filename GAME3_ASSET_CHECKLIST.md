# Game 3: Home Lab — Complete Asset & Feature Checklist

> **Last Updated:** February 27, 2026
> **Game Route:** `/game/lab` (~1385 lines)
> **Difficulty:** ⭐⭐⭐ (Hard)
> **Duration:** 4–6 min
> **Deployment:** Azure Static Web Apps (SWA) — auto-deploys on push to `main`
> **Status Legend:** ✅ Done | ⚠️ Partial / Placeholder | ❌ Missing

---

## Table of Contents

1. [Plastic Sample Assets (6 samples)](#1-plastic-sample-assets-6-samples)
2. [Lab Test Assets (5 tests)](#2-lab-test-assets-5-tests)
3. [Interaction / Action Assets](#3-interaction--action-assets)
4. [Experiment Scene Assets](#4-experiment-scene-assets)
5. [UI Icon Assets](#5-ui-icon-assets)
6. [Button Assets](#6-button-assets)
7. [Sound Effects](#7-sound-effects)
8. [Screen-by-Screen Feature Checklist](#8-screen-by-screen-feature-checklist)
9. [Game Mechanics Checklist](#9-game-mechanics-checklist)
10. [Animations Checklist](#10-animations-checklist)
11. [Data & i18n Checklist](#11-data--i18n-checklist)
12. [Summary: Asset Gap Analysis](#12-summary-asset-gap-analysis)

---

## 1. Plastic Sample Assets (6 samples)

Each sample is currently only represented by an **emoji** on the sample card. No SVG or PNG illustrations exist.

| # | Sample ID | Name | Emoji | Actual Type | Has SVG | Key Traits |
|---|-----------|------|-------|-------------|---------|------------|
| 1 | `sample-pet-clear` | Clear Container Piece | 🧊 | PET | ❌ | Sinks, rigid, very clear, curls when heated |
| 2 | `sample-hdpe-white` | White Jug Fragment | 🥛 | HDPE | ❌ | Floats, bends easily, opaque, softens/floppy |
| 3 | `sample-pvc-rigid` | Stiff Pipe Section | 🔧 | PVC | ❌ | Sinks, very rigid, snaps, chemical smell when heated |
| 4 | `sample-pp-flex` | Flexible Container Lid | 🫙 | PP | ❌ | Floats, springs back, semi-translucent |
| 5 | `sample-ps-brittle` | Brittle White Piece | 💔 | PS | ❌ | Sinks/barely, very brittle, crumbles, chips |
| 6 | `sample-ldpe-soft` | Soft Film Piece | 🛍️ | LDPE | ❌ | Floats easily, extremely flexible, translucent frosted |

### Sample Asset Summary

| Metric | Count |
|--------|-------|
| Total plastic samples | **6** |
| Samples with illustrated SVGs | **0** |
| Samples with emoji only | **6** |
| Plastic types covered | **6** (PET, HDPE, PVC, PP, PS, LDPE) |

---

## 2. Lab Test Assets (5 tests)

Each test has 3 steps with Cooking Mama-style interactions. Test icons are currently **emoji only**.

| # | Test ID | Name | Icon | Steps | Measures | Has Illustration |
|---|---------|------|------|-------|----------|-----------------|
| 1 | `float` | Water Float Test | 🫧 | Hold → Swipe-down → Tap | Density (float/sink) | ❌ |
| 2 | `bend` | Flexibility Test | 🔄 | Tap → Swipe-right → Tap | Rigidity/flexibility | ❌ |
| 3 | `scratch` | Scratch Test | 💅 | Tap → Swipe-right → Tap | Surface hardness | ❌ |
| 4 | `transparency` | Light Test | 💡 | Tap → Hold → Tap | Transparency | ❌ |
| 5 | `heat` | Heat Response | 🔥 | Hold → Swipe-down → Tap | Thermal response | ❌ |

### Test Step Details

#### Float Test (🫧)

| Step | Action | Icon | Instruction | Scene Animation | Status |
|------|--------|------|-------------|-----------------|--------|
| 1 | Hold (1500ms) | 🚰 | "Hold to fill water!" | `waterFill` — 💧🫧💧 growing | ⚠️ Emoji animation |
| 2 | Swipe-down | 👇 | "Swipe down to drop the sample!" | `splash` — 💦 animating | ⚠️ Emoji animation |
| 3 | Tap | 👀 | "Tap to observe the result!" | `floatBob` — observing | ⚠️ Emoji animation |

#### Flexibility Test (🔄)

| Step | Action | Icon | Instruction | Scene Animation | Status |
|------|--------|------|-------------|-----------------|--------|
| 1 | Tap | ✊ | "Tap to grab the sample!" | `grabPulse` | ⚠️ Emoji animation |
| 2 | Swipe-right | ↪️ | "Swipe to bend the sample!" | `bendWiggle` | ⚠️ Emoji animation |
| 3 | Tap | 🔍 | "Tap to observe the result!" | `observeLook` | ⚠️ Emoji animation |

#### Scratch Test (💅)

| Step | Action | Icon | Instruction | Scene Animation | Status |
|------|--------|------|-------------|-----------------|--------|
| 1 | Tap | 👆 | "Tap to position the nail!" | `grabPulse` | ⚠️ Emoji animation |
| 2 | Swipe-right | → | "Swipe to scratch the surface!" | `scratchMove` | ⚠️ Emoji animation |
| 3 | Tap | 📝 | "Tap to check the mark!" | `observeLook` | ⚠️ Emoji animation |

#### Light Test (💡)

| Step | Action | Icon | Instruction | Scene Animation | Status |
|------|--------|------|-------------|-----------------|--------|
| 1 | Tap | 👆 | "Tap to pick up the sample!" | `grabPulse` | ⚠️ Emoji animation |
| 2 | Hold (2000ms) | ☀️ | "Hold sample up to the light!" | `shineGlow` | ⚠️ Emoji animation |
| 3 | Tap | ✊ | "Tap to note the result!" | `sparkle` | ⚠️ Emoji animation |

#### Heat Test (🔥)

| Step | Action | Icon | Instruction | Scene Animation | Status |
|------|--------|------|-------------|-----------------|--------|
| 1 | Hold (2000ms) | 🫖 | "Hold to heat the water!" | `heatSteam` — 🫖♨️ | ⚠️ Emoji animation |
| 2 | Swipe-down | ♨️ | "Swipe down to dip the sample!" | `dipDown` | ⚠️ Emoji animation |
| 3 | Tap | 👀 | "Tap to observe the result!" | `observeLook` | ⚠️ Emoji animation |

### Test Illustration Assets Needed

| Asset | Description | Status |
|-------|-------------|--------|
| Water bowl/basin | For float test | ❌ Missing |
| Hands bending plastic | For flexibility test | ❌ Missing |
| Fingernail/tool scratching surface | For scratch test | ❌ Missing |
| Light source (lamp/flashlight) | For transparency test | ❌ Missing |
| Hot water pot/kettle | For heat test | ❌ Missing |
| Lab bench background | Workstation scene | ❌ Missing |

---

## 3. Interaction / Action Assets

Cooking Mama-style controls — currently all emoji/CSS.

### Tap Button

| Asset | Current | Status | Notes |
|-------|---------|--------|-------|
| Tap button circle (100×100px) | CSS circle + emoji (👆) | ❌ **Needs illustration** | Pulsing target |
| Ripple effect | CSS `rippleExpand` animation | ⚠️ Functional | Expanding circle on tap |
| TAP label | Plain text | ⚠️ | |

### Hold Button

| Asset | Current | Status | Notes |
|-------|---------|--------|-------|
| Hold button circle (100×100px) | CSS circle + emoji (✊) | ❌ **Needs illustration** | Press-and-hold target |
| Progress ring | Inline SVG `<circle>` with `stroke-dasharray` | ⚠️ Functional | Fills as user holds |
| Ring color fill | Green stroke on grey track | ⚠️ | |
| HOLD label | Plain text | ⚠️ | |

### Swipe Area

| Asset | Current | Status | Notes |
|-------|---------|--------|-------|
| Swipe zone (180×120px) | Dashed CSS border box | ❌ **Needs illustration** | Swipe target area |
| Swipe arrow (down) | ⬇️ emoji + CSS `swipeHintDown` bounce | ⚠️ Emoji animation | |
| Swipe arrow (right) | ➡️ emoji + CSS `swipeHint` bounce | ⚠️ Emoji animation | |
| Swipe trail effect | CSS trail behind finger | ⚠️ Functional | |
| SWIPE label | Plain text direction | ⚠️ | |

---

## 4. Experiment Scene Assets

The experiment scene is a 70px-tall colored zone with animated emoji. No real illustrations.

| Asset | Current | Status | Notes |
|-------|---------|--------|-------|
| Water filling animation | 💧🫧💧 emoji scaling | ❌ **Needs illustrated scene** | Water bowl filling up |
| Sample splashing into water | 💦 emoji fading | ❌ **Needs illustrated scene** | Drop + splash effect |
| Sample floating/sinking | Emoji bobbing | ❌ **Needs illustrated scene** | Clear visual of density result |
| Sample being bent | Emoji wiggling | ❌ **Needs illustrated scene** | Hands bending plastic |
| Scratch on surface | Emoji sliding | ❌ **Needs illustrated scene** | Fingernail scratch mark |
| Light shining through sample | ☀️✨ emoji glow | ❌ **Needs illustrated scene** | Transparency result |
| Hot water and steam | 🫖♨️ emoji | ❌ **Needs illustrated scene** | Heating + dipping |
| Sample in hot water | Emoji dipping | ❌ **Needs illustrated scene** | Thermal response |
| Generic observation | 🔍 emoji | ❌ **Needs illustrated scene** | Result viewing |

### Experiment Result Illustrations (per test × per sample = 30 combinations)

Each plastic sample gives a unique outcome per test. Currently these are **text descriptions only** in the observations notebook.

| Test | PET Result | HDPE Result | PVC Result | PP Result | PS Result | LDPE Result |
|------|-----------|-------------|-----------|-----------|-----------|-------------|
| Float | Sinks | Floats | Sinks quickly | Floats | Sinks/barely | Floats easily |
| Bend | Rigid, cracks | Bends easily, waxy | Very rigid, snaps | Bends, springs back | Very brittle, crumbles | Extremely flexible |
| Scratch | Hard, no mark | Soft, white mark | Moderate | Moderate | Hard, chips | Very soft |
| Transparency | Very clear | Opaque milky | Opaque grey | Semi-translucent | Clear or white | Translucent frosted |
| Heat | Softens, curls | Softens, floppy | Stays rigid, smell | Softens higher temp | Softens, crumbles | Softens, sticky |

> **Note:** Illustrating all 30 outcome variations would be ideal but is LOW priority. A simpler set of ~10 generic result illustrations (float, sink, bend, snap, scratch-hard, scratch-soft, clear, opaque, soften, crumble) could cover most cases.

---

## 5. UI Icon Assets

### Status Bar Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Score icon | 🏆 emoji | ❌ Needs custom SVG | Green-themed status bar |
| Lives / Hearts | ❤️ emoji | ❌ Needs custom SVG | Filled/empty states |
| Back button | "← Back" text | ⚠️ | Could use `back_button.svg` |
| Sample counter | Plain text "Sample X/Y" | ⚠️ | |

### Test Progress Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Test type icons (×5) | Emoji (🫧🔄💅💡🔥) | ❌ Needs custom SVGs | Color-coded test dots |
| Active test indicator | CSS scale(1.15) + color | ⚠️ Functional | |
| Completed test checkmark | ✅ within circle | ⚠️ | |

### Step Progress Pips

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Step numbers (1/2/3) | CSS numbered circles | ⚠️ Functional | Active = scaled + colored |
| Step completed check | ✓ text in circle | ⚠️ | |

### Observations Notebook

| Asset | Current | Status | Notes |
|-------|---------|--------|-------|
| Notebook header | 📓 emoji + "Observations" text | ❌ Needs illustration | Yellow notebook card |
| Notebook lines/ruled paper | CSS background | ⚠️ | Could use paper texture |
| Result bubble | Green CSS bubble + `bubblePop` animation | ⚠️ Functional | |

### Identify Screen Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Large sample display | Emoji (2.8rem) | ❌ Needs illustration | Center of identify screen |
| Plastic type buttons (×6) | Plain text (PET, HDPE…) | ❌ Needs custom icons | White buttons, black border |

### Feedback & Results Icons

| Icon | Current | Status | Notes |
|------|---------|--------|-------|
| Correct checkmark | ✅ emoji | ❌ Needs illustrated SVG | |
| Incorrect X | ❌ emoji | ❌ Needs illustrated SVG | |
| Trophy icon | 🏆 emoji | ❌ Needs custom SVG | Results |
| Thumbs up | 👍 emoji | ❌ Needs hand SVG | |
| Strong arm | 💪 emoji | ❌ Needs illustrated SVG | |

---

## 6. Button Assets

### Existing Shared Buttons Used

| File | Used For | Status |
|------|----------|--------|
| `/assets/box/msg_box.png` | Tutorial card + feedback card border (nine-patch) | ✅ In use |
| Nine-patch button classes | "Let's Start!", "Next Sample", "Play Again" etc. | ✅ CSS nine-patch |

### Missing Buttons

| Button Needed | Where Used | Current | Status |
|---------------|------------|---------|--------|
| Tap action button art | Testing phase — tap interactions | CSS circle + 👆 emoji | ❌ Needs custom art |
| Hold action button art | Testing phase — hold interactions | CSS circle + ✊ emoji | ❌ Needs custom art |
| Swipe action area art | Testing phase — swipe interactions | CSS dashed box + arrow emoji | ❌ Needs custom art |
| Identify buttons (×6) | Identify phase | Plain text white buttons | ❌ Needs custom art |
| Next Sample button | Feedback phase | Nine-patch CSS | ⚠️ Functional |
| See Results button | Last feedback | Nine-patch CSS | ⚠️ Functional |
| Play Again button | Results screen | Nine-patch CSS | ⚠️ Functional |
| Game Menu button | Results screen | Nine-patch CSS | ⚠️ Functional |

---

## 7. Sound Effects

**Current state: Zero audio files exist. Zero sounds are played.**

### Required Sound Effects

| # | Sound | Trigger | Status |
|---|-------|---------|--------|
| 1 | Water pouring | Float test — fill step | ❌ Missing |
| 2 | Splash | Float test — drop sample | ❌ Missing |
| 3 | Bending/creaking | Bend test — swipe step | ❌ Missing |
| 4 | Scratch sound | Scratch test — swipe step | ❌ Missing |
| 5 | Light switch / shine | Transparency test — hold step | ❌ Missing |
| 6 | Water boiling / steam | Heat test — heat step | ❌ Missing |
| 7 | Sizzle / dip | Heat test — dip step | ❌ Missing |
| 8 | Tap confirmation | Any tap action completed | ❌ Missing |
| 9 | Hold complete chime | Hold action reaches 100% | ❌ Missing |
| 10 | Swipe whoosh | Swipe action detected | ❌ Missing |
| 11 | Observation noted | Result recorded in notebook | ❌ Missing |
| 12 | Correct identification | Correct guess | ❌ Missing |
| 13 | Incorrect buzz | Wrong guess | ❌ Missing |
| 14 | Game over sound | Lives = 0 | ❌ Missing |
| 15 | Victory fanfare | Good results score | ❌ Missing |
| 16 | Background music (optional) | Lab ambience during gameplay | ❌ Missing |

---

## 8. Screen-by-Screen Feature Checklist

### 8A. Tutorial Overlay

| Feature | Status | Notes |
|---------|--------|-------|
| Nine-patch card border | ✅ | Uses `/assets/box/msg_box.png` |
| 3 action type tags (👆 Tap, 👇 Swipe, ✊ Hold) | ✅ | CSS color-coded tags |
| "3 tests per sample" explanation | ✅ | Hardcoded English |
| "Let's Start! 🔬" button | ✅ | Nine-patch red button |
| Animated tutorial demo | ❌ | No visual walkthrough |
| Cooking Mama-style instruction visual | ❌ | Text-only explanation |

### 8B. Status Bar

| Feature | Status | Notes |
|---------|--------|-------|
| Back button | ✅ | "← Back" text to `/games` |
| Score display | ✅ | 🏆 emoji + number |
| Lives (hearts) | ✅ | ❤️ × 3, dimmed on loss |
| Sample counter | ✅ | "Sample X/Y" text |
| Green theme | ✅ | `rgba(60,81,66,0.9)` background |

### 8C. Sample Card

| Feature | Status | Notes |
|---------|--------|-------|
| White card with black border | ✅ | 3px border |
| Sample emoji icon (2.8rem) | ✅ | Emoji only, no illustration |
| Sample name | ✅ | e.g., "Clear Container Piece" |
| "Mystery Plastic Sample" subtitle | ✅ | |
| Sample illustration | ❌ | Needs real artwork |

### 8D. Testing Phase

| Feature | Status | Notes |
|---------|--------|-------|
| Test progress dots (3 of 5) | ✅ | Color-coded per test type |
| Active test scale indicator | ✅ | 1.15× scale |
| Test card with color theme | ✅ | Per-test accent + background |
| Test name + icon header | ✅ | Emoji icon + text |
| Test description | ✅ | |
| Experiment scene (70px) | ⚠️ | Animated emoji only |
| Step progress pips (1/2/3) | ✅ | Numbered circles |
| Step instruction with icon | ✅ | Emoji icon + text in colored box |
| Observations notebook | ✅ | Yellow card, accumulates results |
| Result bubble (green) | ✅ | `bubblePop` animation |
| Tap interaction zone | ✅ | 100×100px circle + ripple |
| Hold interaction zone | ✅ | SVG progress ring (100×100px) |
| Swipe interaction zone | ✅ | 180×120px dashed box + arrow |

### 8E. Identify Phase

| Feature | Status | Notes |
|---------|--------|-------|
| Large sample emoji display | ✅ | Centered, enlarged |
| Observations notebook review | ✅ | All collected test results |
| 6 plastic type buttons (3×2 grid) | ✅ | White buttons, black border, max-width 340px |
| "What type of plastic is this?" prompt | ✅ | |
| Sample illustration | ❌ | Emoji only |

### 8F. Feedback Phase

| Feature | Status | Notes |
|---------|--------|-------|
| Nine-patch feedback card | ✅ | Uses `/assets/box/msg_box.png` |
| ✅/❌ result indicator | ✅ | Emoji |
| Correct type revealed | ✅ | |
| Key clues list | ✅ | Per-sample clue text |
| `feedbackPop` animation | ✅ | Scale 0.8 → 1.0 |
| "Next Sample →" button | ✅ | |
| "See Results" (on last sample) | ✅ | |
| Sound effect | ❌ | No audio |

### 8G. Results Screen

| Feature | Status | Notes |
|---------|--------|-------|
| Title ("Lab Expert!" / "Keep Experimenting!") | ✅ | Dynamic based on accuracy |
| Score stat card | ✅ | White card, black border |
| Accuracy percentage | ✅ | |
| Correct count (X/6) | ✅ | |
| Per-sample result rows | ✅ | ✅/❌ + sample name + guess vs correct |
| "PLAY AGAIN" button | ✅ | Nine-patch |
| "GAME MENU" button | ✅ | Nine-patch |
| Auto-return countdown (5s) | ✅ | Returns to `/games` |
| Confetti / celebration | ❌ | None |
| Sound effects | ❌ | None |

---

## 9. Game Mechanics Checklist

### Core Mechanics

| Mechanic | Status | Notes |
|----------|--------|-------|
| Sample → 3 tests → identify → feedback loop | ✅ | Fully wired |
| 6 plastic samples, 6 types | ✅ | Shuffled randomly each game |
| 5 test types, 3 randomly selected per sample | ✅ | Float, bend, scratch, transparency, heat |
| 3 steps per test (prepare → perform → observe) | ✅ | Cooking Mama-style interactions |
| Tap / Hold / Swipe interactions | ✅ | Touch-based controls |
| Observations notebook — accumulates clues | ✅ | Text-based results |
| 6 plastic type identification buttons | ✅ | PET, HDPE, PVC, PP, PS, LDPE |
| Scoring: 20 points per correct | ✅ | No streak/bonus system |
| -1 life per incorrect (3 max) | ✅ | |
| **No timer** | ✅ | Unlike Game 2, no time pressure |
| Game over: lives = 0 OR all 6 done | ✅ | |
| Hold progress tracking (0–100%) | ✅ | SVG ring fill |
| Swipe detection (threshold-based) | ✅ | Direction-aware (down/right) |

### Missing Mechanics

| Feature | Status | Notes |
|---------|--------|-------|
| Streak bonus | ❌ | No consecutive-correct bonus |
| Partial scoring (per-test) | ❌ | Only full identification scored |
| Hint system | ❌ | No hint for struggling players |
| Difficulty scaling | ❌ | All samples equal difficulty |

---

## 10. Animations Checklist

### Custom Keyframe Animations (15+)

| Animation | CSS Name | Used For | Status |
|-----------|----------|----------|--------|
| `waterFill` | `.anim-water-fill` | Float test: filling water | ✅ Emoji-based |
| `splash` | `.anim-splash` | Float test: dropping sample | ✅ Emoji-based |
| `floatBob` | `.anim-float` | Float test: observing result | ✅ Emoji-based |
| `grabPulse` | `.anim-grab`, `.anim-position` | Bend/scratch: grabbing sample | ✅ Emoji-based |
| `bendWiggle` | `.anim-bend` | Bend test: bending sample | ✅ Emoji-based |
| `observeLook` | `.anim-observe` | Generic observation step | ✅ Emoji-based |
| `scratchMove` | `.anim-scratch` | Scratch test: scratching | ✅ Emoji-based |
| `shineGlow` | `.anim-shine` | Light test: holding to light | ✅ Emoji-based |
| `sparkle` | `.anim-glow` | Light test: observing glow | ✅ Emoji-based |
| `heatSteam` | `.anim-heat-water` | Heat test: heating water | ✅ Emoji-based |
| `dipDown` | `.anim-dip` | Heat test: dipping sample | ✅ Emoji-based |
| `swipeHint` | `.swipe-arrow` | Swipe right arrow loop | ✅ CSS |
| `swipeHintDown` | `.swipe-arrow.down` | Swipe down arrow loop | ✅ CSS |
| `bubblePop` | `.step-result-bubble` | Result text pop-in | ✅ CSS |
| `feedbackPop` | `.feedback-card` | Feedback card scale-in | ✅ CSS |
| `rippleExpand` | `.tap-ripple` | Tap button ripple | ✅ CSS |

> **Note:** All experiment scene animations use emoji characters. Replacing with illustrated sprites would significantly improve visual quality.

---

## 11. Data & i18n Checklist

### Data Files

| File | Content | Status | Notes |
|------|---------|--------|-------|
| `src/lib/data/lab-tests.json` | 5 tests + 6 samples | ✅ | Complete with steps, results, outcomes |
| `src/stores/labStore.ts` | Game state + actions | ✅ | Full state management |
| `src/types/lab.ts` | All types | ✅ | LabPhase, TestType, LabStep, etc. |

### i18n / Localization

| Feature | Status | Notes |
|---------|--------|-------|
| Paraglide i18n infrastructure | ✅ | Configured project-wide |
| Sample names: `nameZhHK` in data | ✅ | Available but **not used in components** |
| Test names: `nameZhHK` in data | ✅ | Available but **not used in components** |
| Tutorial text translated | ❌ | Hardcoded English |
| Step instructions translated | ❌ | Hardcoded English |
| Test result text translated | ❌ | Hardcoded English |
| Feedback text translated | ❌ | Hardcoded English |
| UI controls translated | ❌ | Hardcoded English |

### Known CSS Issues

| Issue | Location | Status |
|-------|----------|--------|
| Malformed CSS around `.interaction-zone` | ~Lines 900–930 | ⚠️ Orphaned properties after closing brace |
| Missing closing brace / orphaned styles | `.experiment-scene` area | ⚠️ May cause rendering issues |

---

## 12. Summary: Asset Gap Analysis

### The game IS functional right now with:
- ✅ Full game loop (sample → 3 tests → identify → feedback → results)
- ✅ 6 plastic samples with complete test outcome data
- ✅ 5 test types with 3-step Cooking Mama-style interactions
- ✅ Tap / Hold / Swipe controls working
- ✅ SVG progress ring for hold interactions
- ✅ Observations notebook accumulating clues
- ✅ 15+ CSS keyframe animations for experiments
- ✅ Nine-patch card borders from shared assets
- ✅ Results screen with per-sample breakdown
- ✅ No timer — relaxed, educational pace

### Critical Missing (Blocks polished release)

| Priority | Category | Count | Details |
|----------|----------|-------|---------|
| 🔴 HIGH | Plastic sample illustrations | **6** | All 6 samples are emoji-only (🧊🥛🔧🫙💔🛍️) |
| 🔴 HIGH | Experiment scene illustrations | **~10** | All test animations use emoji; need water bowl, bending hands, scratch tool, light, hot water, etc. |
| 🔴 HIGH | Sound effects | **16** | Zero audio — water, scratch, sizzle, chimes, etc. |
| 🟡 MED | Action button artwork | **3** | Tap circle, hold circle, swipe area — all CSS/emoji |
| 🟡 MED | Lab bench background | **1** | No workstation illustration |
| 🟡 MED | Test type icons (×5) | **5** | 🫧🔄💅💡🔥 emoji → custom SVGs |
| 🟡 MED | Plastic type identify buttons | **6** | Plain text buttons need icons |
| 🟡 MED | i18n integration | **All screens** | Paraglide exists but not used; ZhHK data available but unused |
| 🟡 MED | UI icons (HUD, notebook, feedback) | **~8** | Score, hearts, notebook, checkmark, X, trophy |
| 🟡 MED | CSS bug fix | **1** | Malformed styles around `.interaction-zone` |
| 🟢 LOW | Result illustrations (per test×sample) | **~10–30** | Generic outcome visuals (float, sink, bend, snap, etc.) |
| 🟢 LOW | Confetti / celebration | **1** | Results screen |
| 🟢 LOW | Tutorial walkthrough animation | **1** | Visual demo of Cooking Mama controls |
| 🟢 LOW | Notebook paper texture | **1** | Currently plain CSS |

### Asset Counts Summary

| Asset Type | Exists | Needed | Gap |
|------------|--------|--------|-----|
| Plastic sample SVGs | 0 | 6 | **6** |
| Lab bench background | 0 | 1 | **1** |
| Experiment scene illustrations | 0 | ~10 | **~10** |
| Test result illustrations | 0 | ~10 (generic) | **~10** |
| Action button artwork (tap/hold/swipe) | 0 | 3 | **3** |
| Test type icons | 0 | 5 | **5** |
| Plastic type identify icons | 0 | 6 | **6** |
| UI icons (HUD, notebook, feedback) | 0 | ~8 | **~8** |
| Notebook texture | 0 | 1 | **1** |
| Tutorial illustration | 0 | 1 | **1** |
| Sound effects | 0 | 16 | **16** |
| **TOTAL ASSETS** | **~0** | **~67** | **~67** |

> **Note:** Game 3 shares the nine-patch message box (`/assets/box/msg_box.png`) and global button SVGs with Games 1 & 2. No lab-specific image assets exist anywhere in the project. The warm gradient background (`#fdf6e3→#fce9cc→#f5deb3`) is CSS-only.

---

*This document should be updated as assets are created and features are implemented.*
