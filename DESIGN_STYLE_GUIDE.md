# Coca-Cola Recycling Game — Design Style Guide

**Project:** Coca-Cola Academy Recycling Game  
**Art Direction Reference:** Professor character animation (see attached reference frame)  
**Last Updated:** February 24, 2026

---

## 🎨 Art Style Classification

### Primary Style Terms
| Term | Description |
|------|-------------|
| **Textured Illustration** | All fills use a visible grain/noise texture resembling crayon, colored pencil, or chalk on rough paper — never flat digital color |
| **Bold Contour / Thick Outline** | Every element is bordered by a heavy dark outline (3–5px), hand-drawn with slight irregularity — not perfectly smooth vector lines |
| **Storybook Illustration** | The overall feel mirrors children's picture book art — warm, inviting, slightly whimsical, educational in tone |
| **Maximalist Composition** | Backgrounds are densely packed with layered props and details, creating a rich, immersive "world" feel |
| **Flat Layered Perspective** | No vanishing-point perspective; objects are stacked/overlapped in layers to suggest depth, similar to paper cut-out collage |
| **Chibi / Super-Deformed Character Proportions** | Characters have oversized heads (~40% of body height), small bodies, and exaggerated features (giant glasses, big hair) |

### Secondary / Supporting Terms
- **Grain Texture Overlay** — a paper-grain or noise filter applied across all colored surfaces
- **Crayon Rendering** — color application mimics wax crayon or oil pastel on textured paper
- **Retro Educational Aesthetic** — evokes vintage science posters and classroom illustration from the 1960s–70s
- **Warm Palette Dominance** — earthy reds, terracottas, warm browns, and muted greens ground the visual tone
- **Hand-Lettered Feel** — text and UI elements should feel hand-made rather than rigidly typeset

---

## 🖌️ Illustration Rules

### Outlines
- **Weight:** 3–5px dark outlines on all elements (characters, props, UI components)
- **Color:** Near-black (`#1A1A1A` to `#2D2D2D`), never pure `#000000` — subtle warmth
- **Quality:** Slightly wobbly/organic, NOT perfectly smooth Bézier curves. Simulate hand-drawn imperfection
- **Consistency:** Every single element (characters, items, bins, buttons, icons) must have this outline treatment — nothing exists without a contour
- **Overlap:** When objects overlap, outlines remain visible, creating a stacked sticker/paper-cutout look

### Color Fills
- **NEVER use flat digital color.** All fills must have visible texture
- **Texture type:** Crayon / colored pencil grain — as if coloring on rough watercolor paper
- **Saturation:** Medium to low — colors are warm and slightly muted, not neon or hyper-saturated
- **Blending:** Slight color variation within a single shape is encouraged (crayon doesn't fill evenly)
- **Highlight/shadow:** Minimal — depth comes from outlines and layering, not from shading/gradients

### Texture Implementation (CSS/SVG)
For digital reproduction, apply grain via one of these methods:
```css
/* Method 1: SVG noise filter */
.textured {
  filter: url(#grain-filter);
}

/* Method 2: CSS noise overlay */
.textured::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/assets/textures/paper-grain.png');
  mix-blend-mode: multiply;
  opacity: 0.15;
  pointer-events: none;
}
```

```svg
<!-- SVG Grain Filter -->
<filter id="grain-filter">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
  <feColorMatrix type="saturate" values="0" />
  <feBlendIn2="SourceGraphic" mode="multiply" />
</filter>
```

---

## 🎨 Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Red | `#F40009` | Error states, alerts, strong accents |
| Coca-Cola Red | `#DF1725` | Primary branding, buttons, key UI elements |
| Dark Green | `#3C5142` | Recyclable bin, dark backgrounds, environment depth |
| Georgia Green | `#A4CDA8` | Positive feedback, light green accents, professor's shirt |
| White | `#FFFFFF` | Lab coat, clean surfaces, text on dark backgrounds |
| Black | `#000000` | Outlines, text, borders |

### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Grey | `#DF1725` | Muted UI elements, disabled states, subtle backgrounds |
| Green | `#74AC4B` | Recyclable highlights, success indicators, nature elements |
| Yellow | `#F8C226` | Vehicles, attention elements, streak bonuses, stars |
| Light Yellow / Cream | `#FCE9CC` | Paper, labels, warm light surfaces, tutorial backgrounds |

### Color Usage Guide
| Context | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| Recyclable bin | `#3C5142` (body) | `#74AC4B` (label/glow) | `#A4CDA8` (hover) |
| Non-recyclable bin | `#DF1725` (body) | `#F40009` (label/glow) | — |
| Correct feedback | `#74AC4B` | `#A4CDA8` | `#F8C226` (stars) |
| Incorrect feedback | `#F40009` | `#DF1725` | — |
| Buttons (primary) | `#DF1725` | `#FFFFFF` (text) | — |
| Buttons (secondary) | `#3C5142` | `#FFFFFF` (text) | — |
| Score/streak | `#F8C226` | `#FCE9CC` | — |
| Professor character | `#FFFFFF` (coat) | `#A4CDA8` (shirt) | `#000000` (outline) |
| Backgrounds | `#3C5142` | `#FCE9CC` | `#A4CDA8` |

### Color Rules
1. **Use the brand palette strictly** — no off-brand colors
2. **High contrast for interactive elements** — Coca-Cola Red or Dark Green against White/Cream
3. **Background colors are darker/more muted** than foreground elements to create visual hierarchy
4. **Character colors are brighter/lighter** than environment to pop out
5. **Yellow is reserved for rewards** — stars, streaks, bonus points, celebratory moments
6. **Light Yellow/Cream for warm, neutral surfaces** — paper, tutorial panels, explanation bubbles

---

## 👤 Character Design

### Professor Character (Main Guide)
- **Role:** The professor guides players through the recycling game — appears in tutorial, feedback, and results
- **Proportions:** Chibi-style — head is ~40% of total height, body is compact
- **Head:** Oversized with wild white curly/afro hair (textured, not smooth)
- **Eyes:** Extra-large round glasses with purple/blue tinted lenses — eyes visible through lenses with simple dot/oval style
- **Face:** Simple features — small nose (implied), wide smile with visible teeth, bushy white mustache
- **Outfit:** White lab coat over green shirt/vest, small pocket with pen/paper
- **Hands:** Simplified mitten-style hands (3–4 fingers), expressive gestures
- **Expressions:** Conveyed primarily through hand gestures and body pose, not complex facial changes

### Character Animation Poses Needed
| Pose | Usage | Description |
|------|-------|-------------|
| Welcome / Wave | Start screen, tutorial | One hand raised waving, friendly pose |
| Pointing | Directing attention to items/bins | One hand extended pointing |
| Thumbs Up | Correct answer | Both arms up, one thumb up |
| Celebration | Streak bonus, high score | Both arms raised, excited pose (as in reference image) |
| Encouraging | Wrong answer | Gentle gesture, supportive body language |
| Salute | Results screen (high score) | Hand to forehead salute |
| Thinking | Hint/explanation | Hand on chin, looking thoughtful |

---

## 🏗️ Environment & Background Design

### Style Rules
- **Density:** Backgrounds should be rich and detailed — fill the space with contextual props (lab equipment, books, machines, pipes, vehicles)
- **Layering:** Stack elements at different "depths" without true perspective — closer = lower on screen, further = higher
- **Industrial/Lab theme:** The setting is a recycling science lab — mix of workshop, laboratory, and factory elements
- **Warm atmosphere:** Everything should feel cozy and inviting despite being a "factory" setting
- **Details:** Include small charming details — steam puffs, blinking lights, scattered tools, books

### Background Elements Library
- Pipes and tubes (with steam/smoke puffs)
- Bookshelves with colorful books
- Machines with dials, screens, buttons
- Vehicles (trucks, cars — for recycling transport context)
- Factory/building silhouettes
- Clouds of steam/smoke (white puffy shapes)
- Brick/stone wall textures
- Containers, jars, beakers

---

## 📐 Layout & Composition

### Screen Zones
```
┌─────────────────────────────────────────────┐
│  TOP BAR: Score, Timer, Lives               │  <- Clean, readable, outlined UI
├─────────────────────────────────────────────┤
│                                             │
│  MAIN AREA: Character / Items / Action      │  <- Rich textured background
│  (Dense illustrated background)             │
│                                             │
├─────────────────────────────────────────────┤
│  BOTTOM: Bins / Buttons / Navigation        │  <- Clear interactive elements
└─────────────────────────────────────────────┘
```

### Hierarchy Rules
1. **Interactive elements** (items, bins, buttons) must have the **thickest outlines** (4–5px) and **brightest fills**
2. **Character** sits in the mid-ground with medium-bright colors
3. **Background** uses the most muted/dark colors and thinner outlines (2–3px)
4. **UI elements** (score, timer) use clean outlined boxes — still textured but high-contrast for readability

---

## 🔤 Typography

### Style
- **Primary font:** Rounded, friendly sans-serif (e.g., **Nunito Bold**, **Baloo 2**, or **Fredoka One**)
- **Fallback:** System rounded fonts
- **Chinese font:** **Noto Sans TC** (Traditional Chinese) or **cwTeXYen** for a more hand-drawn feel
- **Treatment:** All text should have slight outline or shadow to maintain the illustrated feel
- **Weight:** Prefer Bold and ExtraBold weights — thin text doesn't match the heavy-outline art style

### Text Sizes (iPad-optimized)
| Element | Size | Weight |
|---------|------|--------|
| Game Title | 48–64px | ExtraBold |
| Screen Headers | 36–42px | Bold |
| Button Labels | 24–32px | Bold |
| Score/Timer | 28–36px | Bold |
| Body/Instructions | 18–22px | Medium |
| Captions/Labels | 14–16px | Medium |

### Bilingual Layout
- Chinese text appears **above** or **alongside** English
- Chinese text may be **slightly larger** (2–4px) due to character complexity
- Both languages share the same outline/texture treatment

---

## 🎮 Game Item Design

### Recyclable Items
All items follow the same illustration rules as the rest of the game:

| Property | Specification |
|----------|--------------|
| Canvas Size | 300×300px (with padding) |
| Outline | 4px warm black, hand-drawn quality |
| Fill | Textured crayon/pencil — never flat |
| Detail Level | Recognizable at a glance, not photorealistic |
| Label | Optional small text label below item |
| Shadow | None (or very subtle drop shadow for "floating" items) |

### Items should feel like they were drawn by a skilled children's book illustrator — charming, slightly imperfect, warm.

---

## ✨ Animation Principles

### Motion Style
- **Bouncy and playful** — use ease-in-out with slight overshoot
- **Frame-by-frame feel** — even CSS animations should feel like drawn frames, not smooth tweens
- **Timing:** Slightly slower than typical UI — give the illustrations time to "breathe"
- **Squash and stretch:** Subtle — items squash slightly on landing, stretch slightly when picked up

### Key Animations
| Animation | Duration | Easing | Notes |
|-----------|----------|--------|-------|
| Item appear | 0.4s | ease-out + bounce | Scale from 0 → 1 with slight overshoot |
| Item drag | real-time | linear | Follow finger/cursor |
| Bin hover glow | 0.3s | ease-in-out | Outline brightens, slight scale-up |
| Correct feedback | 1.5s | ease-out | Checkmark + professor thumbs up |
| Incorrect feedback | 2.0s | ease-out | X mark + professor encouraging |
| Score count-up | 0.8s | ease-out | Numbers tick up one by one |
| Screen transition | 0.5s | ease-in-out | Slide or fade with slight bounce |

### Steam/Smoke Puffs (Background)
- Looping gentle float animation (rise and fade)
- 3–5 second cycle
- Subtle opacity change (0.6 → 0.2 → 0.6)

---

## 🖼️ Asset Export Specifications

### Formats
| Asset Type | Format | Notes |
|------------|--------|-------|
| Characters | SVG (preferred) or PNG @2x | SVG for scalability; PNG if texture is baked |
| Items | SVG or PNG @2x (600×600px) | Must include texture in export |
| Backgrounds | PNG @2x | Full-screen, pre-textured |
| Icons/UI | SVG | Outlined, with embedded texture filter |
| Textures | PNG (tileable) | Paper grain, noise overlay |

### Naming Convention
```
assets/
├── characters/
│   ├── professor-welcome.svg
│   ├── professor-thumbsup.svg
│   ├── professor-celebration.svg
│   ├── professor-encouraging.svg
│   ├── professor-pointing.svg
│   ├── professor-salute.svg
│   └── professor-thinking.svg
├── items/
│   ├── recyclable/
│   │   ├── plastic-bottle.svg
│   │   ├── aluminum-can.svg
│   │   └── ...
│   └── non-recyclable/
│       ├── food-waste.svg
│       ├── battery.svg
│       └── ...
├── environment/
│   ├── bg-game-screen.png
│   ├── bg-start-screen.png
│   ├── bg-results-screen.png
│   └── bg-dashboard.png
├── ui/
│   ├── bin-green.svg
│   ├── bin-red.svg
│   ├── btn-primary.svg
│   ├── btn-secondary.svg
│   ├── icon-heart.svg
│   ├── icon-star.svg
│   ├── icon-timer.svg
│   └── icon-score.svg
└── textures/
    ├── paper-grain.png
    ├── crayon-overlay.png
    └── noise-subtle.png
```

---

## 📋 Style Checklist (For Every Asset)

Before any asset is approved, verify:

- [ ] Has **hand-drawn thick outline** (3–5px, warm black, slightly wobbly)
- [ ] Fill uses **visible crayon/pencil texture** — never flat digital color
- [ ] Colors match the **warm, muted palette** defined above
- [ ] No pure white or pure black used
- [ ] **No 3D effects**, no gradients, no drop shadows (except subtle float shadow on items)
- [ ] **No photorealistic elements** — everything is illustrated
- [ ] Character proportions are **chibi/super-deformed** (big head, small body)
- [ ] Interactive elements are **clearly distinguishable** from background
- [ ] Minimum touch target of **44×44pt** on interactive elements
- [ ] Works on both **light and warm-toned backgrounds**
- [ ] Looks cohesive when placed alongside other game assets

---

## 🔑 Style Summary (One-Liner)

> **Textured storybook illustration with bold crayon outlines, warm muted palette, chibi characters, and maximalist hand-drawn backgrounds — like a children's science book brought to life as an interactive game.**

---

*Reference: Professor character frame from Coca-Cola Academy animation*  
*Last Updated: February 24, 2026*
