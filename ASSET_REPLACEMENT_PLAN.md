# Asset Replacement Plan — Icons & Buttons

**Date:** February 26, 2026  
**Scope:** Replace all emoji placeholders with actual SVG icons/buttons, add asset manifest, implement drop shadow + hover effects

---

## 📋 Current State Analysis

### What exists today
- **17 icon SVGs** in `src/lib/assets/icons/` — hand-drawn illustrated style with noise textures, thick outlines, warm palette (matches Design Style Guide)
- **8 button SVGs** in `src/lib/assets/buttons/` — 4 simple gradient + 4 hand-drawn illustrated
- **0 of 26 assets are used** — only `favicon.svg` is imported anywhere
- **Game uses emoji fallbacks** everywhere: `📦` for items, `♻️` / `🚫` for buttons, `❤️` for lives, `🔥` for streaks
- `items.json` references `/assets/items/*.svg` paths but **no files exist** at those paths
- Filename typo: `newsapaper.svg` (missing 'p')

### What needs to happen
1. Create an **asset manifest** (JSON) mapping each file to a human-readable name + description for easy renaming
2. **Rename & reorganize** SVGs to match the items defined in `items.json`
3. **Wire SVG icons** into game components, replacing emoji placeholders
4. **Wire SVG buttons** into UI components (back, redo, undo, settings, decision buttons)
5. Add **CSS drop shadow + hover effects** to all clickable SVG icons

---

## 📁 Task 1 — Asset Manifest File

Create `src/lib/assets/asset-manifest.json` with name, description, and current filename for every icon and button.

```jsonc
// src/lib/assets/asset-manifest.json
{
  "icons": [
    {
      "file": "battery.svg",
      "name": "Battery",
      "description": "AA-style battery with lightning bolt icon. Dark body with blue/green accents.",
      "mapsToItemId": "battery",
      "category": "other"
    },
    {
      "file": "books.svg",
      "name": "Stack of Books",
      "description": "Three stacked books with colorful covers. Green, gold, and teal.",
      "mapsToItemId": null,
      "category": "paper"
    },
    {
      "file": "cardboard_box.svg",
      "name": "Cardboard Box",
      "description": "3D-ish open cardboard box. Gold/brown faces with dark interior.",
      "mapsToItemId": "cardboard-box",
      "category": "paper"
    },
    {
      "file": "clock.svg",
      "name": "Alarm Clock",
      "description": "Vintage alarm clock with two bells on top. Complex overlapping shapes.",
      "mapsToItemId": null,
      "category": "other"
    },
    {
      "file": "computer_monitor.svg",
      "name": "Computer Monitor",
      "description": "Desktop monitor with stand. Dark body, gray screen, white bezel.",
      "mapsToItemId": null,
      "category": "other"
    },
    {
      "file": "cotton_buds.svg",
      "name": "Cotton Buds",
      "description": "Two cotton swabs crossed in X-shape. Silver sticks with white ends.",
      "mapsToItemId": null,
      "category": "other"
    },
    {
      "file": "fish_bone.svg",
      "name": "Fish Bone",
      "description": "Complete fish skeleton. White bones on transparent background.",
      "mapsToItemId": null,
      "category": "organic"
    },
    {
      "file": "fish_can.svg",
      "name": "Fish Can / Sardine Tin",
      "description": "Tall sardine can with dark body and white stripe label.",
      "mapsToItemId": "steel-can",
      "category": "metal"
    },
    {
      "file": "glass_bottle.svg",
      "name": "Glass Bottle",
      "description": "Dark glass bottle with gold cap. Classic bottle silhouette.",
      "mapsToItemId": "glass-bottle",
      "category": "glass"
    },
    {
      "file": "gold_can.svg",
      "name": "Gold / Aluminum Can",
      "description": "Ornate can with gold and green decorative bands. Soda-can style.",
      "mapsToItemId": "aluminum-can",
      "category": "metal"
    },
    {
      "file": "milk_carton.svg",
      "name": "Milk Carton",
      "description": "Milk carton with folded top. Silver body with red accent stripe.",
      "mapsToItemId": "milk-carton",
      "category": "paper"
    },
    {
      "file": "newsapaper.svg",
      "name": "Newspaper",
      "description": "Folded newspaper pages with teal headline bar. (Note: filename has typo — missing 'p')",
      "mapsToItemId": "newspaper",
      "category": "paper"
    },
    {
      "file": "old_shirt.svg",
      "name": "Old Shirt",
      "description": "Worn/used shirt. Dark fabric with golden/olive collar.",
      "mapsToItemId": null,
      "category": "other"
    },
    {
      "file": "plastic_bag.svg",
      "name": "Plastic Bag",
      "description": "Crumpled plastic bag with debris. Orange/yellow with brown accents.",
      "mapsToItemId": "plastic-bag",
      "category": "plastic"
    },
    {
      "file": "trash_paper.svg",
      "name": "Crumpled Paper / Trash Paper",
      "description": "Ball of crumpled paper. Dark outlines with light gray fill.",
      "mapsToItemId": "tissue",
      "category": "paper"
    },
    {
      "file": "white_bottle.svg",
      "name": "White Bottle (Detergent)",
      "description": "Cleaning/detergent bottle. White body with gold/green label.",
      "mapsToItemId": "plastic-bottle",
      "category": "plastic"
    },
    {
      "file": "yellow_bottle.svg",
      "name": "Yellow Bottle (Cleaning)",
      "description": "Cleaning product bottle. White body with green/gold accents.",
      "mapsToItemId": "water-bottle",
      "category": "plastic"
    }
  ],
  "buttons": [
    {
      "file": "back_button.svg",
      "name": "Back / Return",
      "description": "Red illustrated button with left-pointing arrow. Hand-drawn wobbly border.",
      "usage": "Navigation — return to previous screen / map"
    },
    {
      "file": "redo_button.svg",
      "name": "Redo / Forward",
      "description": "Red illustrated button with forward arrows. Hand-drawn wobbly border.",
      "usage": "Redo last action"
    },
    {
      "file": "undo_button.svg",
      "name": "Undo / Backward",
      "description": "Red illustrated button with backward arrows. Hand-drawn wobbly border.",
      "usage": "Undo last action"
    },
    {
      "file": "setting_button.svg",
      "name": "Settings / Gear",
      "description": "Red illustrated button with gear/cog icon. Hand-drawn wobbly border.",
      "usage": "Open settings menu"
    },
    {
      "file": "blue_button.svg",
      "name": "Blue Action Button",
      "description": "Rounded rectangle, blue gradient (#019AF1→#007CC2), glossy highlights, noise texture.",
      "usage": "Secondary / informational actions"
    },
    {
      "file": "green_button.svg",
      "name": "Green Action Button",
      "description": "Rounded rectangle, green gradient (#09CE7C→#2D9A6D), glossy highlights, noise texture.",
      "usage": "Recyclable choice / positive confirmation"
    },
    {
      "file": "red_button.svg",
      "name": "Red Action Button",
      "description": "Rounded rectangle, red gradient (#EB474C→#D25A5D), glossy highlights, noise texture.",
      "usage": "Not-recyclable choice / negative / cancel"
    },
    {
      "file": "orange_button.svg",
      "name": "Orange Action Button",
      "description": "Rounded rectangle, orange gradient (#FF6B00→#D96916), glossy highlights, noise texture.",
      "usage": "Warning / attention actions"
    }
  ]
}
```

---

## 📁 Task 2 — Rename & Copy SVGs to Static Assets

The game loads item images from `/assets/items/` (the `static/` folder). We need to either:

**Option A (Recommended):** Copy and rename the SVGs from `src/lib/assets/icons/` → `static/assets/items/` to match `items.json` paths.

| Source (`src/lib/assets/icons/`) | Destination (`static/assets/items/`) | Item ID |
|---|---|---|
| `white_bottle.svg` | `plastic-bottle.svg` | `plastic-bottle` |
| `gold_can.svg` | `aluminum-can.svg` | `aluminum-can` |
| `glass_bottle.svg` | `glass-bottle.svg` | `glass-bottle` |
| `cardboard_box.svg` | `cardboard-box.svg` | `cardboard-box` |
| `newsapaper.svg` | `newspaper.svg` | `newspaper` |
| `fish_can.svg` | `steel-can.svg` | `steel-can` |
| `milk_carton.svg` | `milk-carton.svg` | `milk-carton` |
| `yellow_bottle.svg` | `water-bottle.svg` | `water-bottle` |
| `plastic_bag.svg` | `plastic-bag.svg` | `plastic-bag` |
| `battery.svg` | `battery.svg` | `battery` |
| `trash_paper.svg` | `tissue.svg` | `tissue` |

**Items WITHOUT matching icons (11 items need new SVGs or temporary placeholders):**

| Item ID | Name | Status |
|---|---|---|
| `plastic-container` | Plastic Container | ❌ No matching icon |
| `magazine` | Magazine | ❌ Could use `books.svg` as placeholder |
| `food-waste` | Food Waste | ❌ Could use `fish_bone.svg` as placeholder |
| `styrofoam` | Styrofoam | ❌ No matching icon |
| `light-bulb` | Light Bulb | ❌ No matching icon |
| `pizza-box-greasy` | Greasy Pizza Box | ❌ Could use `cardboard_box.svg` variant |
| `chip-bag` | Chip Bag | ❌ No matching icon |
| `disposable-cup` | Disposable Coffee Cup | ❌ No matching icon |
| `plastic-straw` | Plastic Straw | ❌ Could use `cotton_buds.svg` as placeholder |

**Extra icons with no item mapping (could be added as new items later):**

| Icon File | Name | Suggestion |
|---|---|---|
| `books.svg` | Stack of Books | Could be new "school" area item |
| `clock.svg` | Alarm Clock | Could be new "home" area item |
| `computer_monitor.svg` | Computer Monitor | Could be new e-waste item |
| `cotton_buds.svg` | Cotton Buds | Could be new hygiene item |
| `fish_bone.svg` | Fish Bone | Could represent food-waste |
| `old_shirt.svg` | Old Shirt | Could be new textile item |

**Option B (Alternative):** Update `items.json` image paths to point directly to `$lib/assets/icons/` and import them via Vite. This keeps everything in `src/` but requires changing the import pattern in components.

---

## 📁 Task 3 — Wire Icons into Game Components

### 3a. `AreaScene.svelte` — Replace emoji item markers with actual SVG images

**Current (line ~52):**
```svelte
<span class="item-emoji">{item.image.includes('.svg') ? '📦' : item.image}</span>
```

**New:**
```svelte
<img src={item.image} alt={item.name} class="item-icon" />
```

### 3b. `ItemPopup.svelte` — Replace category emoji with actual item image

**Current (line ~48):**
```svelte
<span class="item-image-emoji">{getCategoryEmoji(item.category)}</span>
```

**New:**
```svelte
<img src={item.image} alt={item.name} class="item-popup-image" />
```

### 3c. `AreaScene.svelte` — Replace text back button with SVG

**Current (line ~31):**
```svelte
<button class="back-button" onclick={onBack}>← Map</button>
```

**New:**
```svelte
<button class="back-button" onclick={onBack}>
  <img src="/assets/buttons/back_button.svg" alt="Back to map" />
</button>
```

### 3d. `ItemPopup.svelte` — Replace decision button emojis with SVG buttons

**Current (line ~63–72):**
```svelte
<button class="btn-recyclable">
  <span class="btn-icon">♻️</span>
  <span class="btn-text">Recyclable</span>
</button>
<button class="btn-not-recyclable">
  <span class="btn-icon">🚫</span>
  <span class="btn-text">Not Recyclable</span>
</button>
```

**New:** Use `green_button.svg` as background for recyclable, `red_button.svg` for not-recyclable.

### 3e. `TopBar.svelte` — Replace emoji hearts/badges with styled icons

Replace `❤️` / `🖤` / `🔥` / `🗺️` with SVG or styled HTML icons.

---

## 📁 Task 4 — CSS Drop Shadow & Hover Effects

Add a shared CSS class (or Svelte component wrapper) for all clickable SVG icons:

```css
/* Shared interactive icon styles */
.interactive-icon {
  /* Drop shadow — always visible */
  filter: drop-shadow(3px 4px 6px rgba(0, 0, 0, 0.35));
  
  /* Smooth transition for hover */
  transition: filter 0.25s ease, transform 0.25s ease;
  cursor: pointer;
}

.interactive-icon:hover {
  /* Enhanced glow + lift on hover */
  filter: 
    drop-shadow(0px 0px 8px rgba(164, 205, 168, 0.6))   /* green glow */
    drop-shadow(3px 6px 10px rgba(0, 0, 0, 0.45));       /* deeper shadow */
  transform: scale(1.08) translateY(-2px);
}

.interactive-icon:active {
  /* Press-down feel */
  filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.3));
  transform: scale(0.95);
}

/* Identified/disabled items — dim and no hover */
.interactive-icon.identified {
  filter: drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.15)) grayscale(0.5);
  opacity: 0.6;
  pointer-events: none;
}

/* Pulsing glow for undiscovered items — draws attention */
@keyframes item-pulse {
  0%, 100% { filter: drop-shadow(3px 4px 6px rgba(0, 0, 0, 0.35)); }
  50% { filter: drop-shadow(0px 0px 12px rgba(248, 194, 38, 0.5)) drop-shadow(3px 4px 6px rgba(0, 0, 0, 0.35)); }
}

.interactive-icon.undiscovered {
  animation: item-pulse 2s ease-in-out infinite;
}
```

### Button-specific hover effects:

```css
.interactive-button {
  filter: drop-shadow(2px 3px 5px rgba(0, 0, 0, 0.3));
  transition: filter 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.interactive-button:hover {
  filter: drop-shadow(0px 0px 10px rgba(223, 23, 37, 0.4))
          drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.4));
  transform: scale(1.05);
}

.interactive-button:active {
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
  transform: scale(0.96);
}
```

---

## 📁 Task 5 — Copy Button SVGs to Static Folder

Copy button SVGs to `static/assets/buttons/` so they're accessible at runtime:

| Source (`src/lib/assets/buttons/`) | Destination (`static/assets/buttons/`) |
|---|---|
| `back_button.svg` | `back_button.svg` |
| `redo_button.svg` | `redo_button.svg` |
| `undo_button.svg` | `undo_button.svg` |
| `setting_button.svg` | `setting_button.svg` |
| `blue_button.svg` | `blue_button.svg` |
| `green_button.svg` | `green_button.svg` |
| `red_button.svg` | `red_button.svg` |
| `orange_button.svg` | `orange_button.svg` |

---

## 🔢 Execution Order

| Step | Task | Files Modified | Estimated Effort |
|---|---|---|---|
| 1 | Create `asset-manifest.json` | 1 new file | Small |
| 2 | Copy & rename icon SVGs to `static/assets/items/` | 11 file copies | Small |
| 3 | Copy button SVGs to `static/assets/buttons/` | 8 file copies | Small |
| 4 | Create placeholder SVGs for 9 missing items | 9 new SVG files | Medium |
| 5 | Update `AreaScene.svelte` — icons + back button + hover/shadow CSS | 1 file | Medium |
| 6 | Update `ItemPopup.svelte` — item image + decision buttons | 1 file | Medium |
| 7 | Update `TopBar.svelte` — replace emoji indicators | 1 file | Small |
| 8 | Add shared `.interactive-icon` / `.interactive-button` CSS | 1 shared file or per-component | Small |
| 9 | Fix filename typo (`newsapaper.svg` → `newspaper.svg`) | 1 rename | Trivial |
| 10 | Test build (`pnpm build`) and verify no broken paths | — | Small |

---

## ⚠️ Open Questions for You

1. **Missing items:** 9 out of 20 game items have no matching SVG icon. Should I:
   - **(a)** Create simple colored-shape placeholder SVGs so the game doesn't break?
   - **(b)** Map the closest existing icon as a temporary stand-in (e.g., `books.svg` → magazine)?
   - **(c)** Remove those items from `items.json` until proper art is created?

2. **Import strategy:** Should icons be loaded from:
   - **(a)** `static/assets/items/` via absolute URL paths (current `items.json` pattern) — simpler, no build step
   - **(b)** `src/lib/assets/icons/` via Vite `$lib` imports — enables tree-shaking & bundling but requires component changes

3. **Hover glow color:** The plan uses Georgia Green (`#A4CDA8`) for the hover glow. Would you prefer Coca-Cola Red (`#DF1725`) or Yellow (`#F8C226`) instead?

---

*Ready to implement on your go-ahead.*
