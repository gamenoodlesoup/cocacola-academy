# Stage 3: Frontend Core Gameplay - Detailed Implementation Plan

**Focus:** Build interactive game mechanics and UI without backend integration  
**Duration:** 2-3 weeks  
**Status:** 🟢 Ready to Start  
**Last Updated:** February 3, 2026

---

## 📋 Overview

This document details the implementation of Stage 3 (Frontend Core Gameplay) with step-by-step tasks, code examples, and testing checkpoints. We'll build the game independently of the backend, using mock data for now.

**Why Start with Frontend First?**
- Faster iteration on game mechanics
- Immediate visual feedback
- Test gameplay without backend dependencies
- Mock data allows full feature testing

---

## 🎯 Stage 3 Sub-Phases

```
Phase 3.1: Asset Preparation (2-3 days)
    ↓
Phase 3.2: Game Data Model & State Management (2 days)
    ↓
Phase 3.3: Start & Tutorial Screens (2-3 days)
    ↓
Phase 3.4: Main Game Screen (4-5 days)
    ↓
Phase 3.5: Feedback System (2-3 days)
    ↓
Phase 3.6: Results Screen (2 days)
```

---

## 📦 Phase 3.1: Asset Preparation
**Duration:** 2-3 days  
**Goal:** Create and organize all visual assets

### Day 1: Hand Gesture SVGs

**Tasks:**
- [ ] Create hand gesture base template (stroke outline style)
- [ ] Design 8 core hand gestures
- [ ] Export as optimized SVGs
- [ ] Test SVGs in browser

**Hand Gestures Needed:**

1. **pointing.svg** - Index finger pointing (for buttons)
   ```svg
   <!-- Simple outline style, 3-4px stroke -->
   <svg width="200" height="200" viewBox="0 0 200 200">
     <g stroke="#000000" stroke-width="4" fill="none">
       <!-- Hand outline path -->
     </g>
   </svg>
   ```

2. **grabbing-open.svg** - Open hand ready to grab
3. **grabbing-closed.svg** - Closed hand holding item
4. **thumbs-up.svg** - Thumbs up gesture (success)
5. **wave-no.svg** - Hand waving "no" (incorrect)
6. **clapping.svg** - Two hands clapping (celebration)
7. **salute.svg** - Hand in salute position (results)
8. **fist-pump.svg** - Motivational fist gesture (results)

**File Locations:**
```
static/assets/hands/
├── pointing.svg
├── grabbing-open.svg
├── grabbing-closed.svg
├── thumbs-up.svg
├── wave-no.svg
├── clapping.svg
├── salute.svg
└── fist-pump.svg
```

**Design Specifications:**
- Canvas: 200x200px
- Stroke: 4px black (#000000)
- Fill: None or white
- Hand color: #FFF or simple outline
- Export: Optimized SVG, remove metadata

**Testing:**
- [ ] All SVGs load in browser
- [ ] SVGs scale properly (test at 50px, 100px, 200px)
- [ ] No rendering issues in Safari (iPad browser)

---

### Day 2: Item SVGs (Recyclable)

**Tasks:**
- [ ] Design 12 recyclable item SVGs
- [ ] Maintain consistent stroke style
- [ ] Add subtle details for clarity
- [ ] Export and optimize

**Recyclable Items (12):**

| Item | Filename | Difficulty | Notes |
|------|----------|------------|-------|
| Plastic Bottle (PET #1) | plastic-bottle.svg | Easy | Clear bottle shape |
| Aluminum Can | aluminum-can.svg | Easy | Coca-Cola can |
| Glass Bottle | glass-bottle.svg | Easy | Clear glass |
| Cardboard Box | cardboard-box.svg | Easy | Brown box |
| Newspaper | newspaper.svg | Easy | Folded paper |
| Paper | paper.svg | Easy | Single sheet |
| Steel Can | steel-can.svg | Medium | Tin can |
| Milk Carton | milk-carton.svg | Medium | Tetrapak |
| Magazine | magazine.svg | Medium | Glossy pages |
| Pizza Box (Clean) | pizza-box-clean.svg | Hard | Clean cardboard |
| Plastic Bag (LDPE #4) | plastic-bag-recyclable.svg | Hard | Specific type |
| Plastic Container | plastic-container.svg | Medium | Clean container |

**File Locations:**
```
static/assets/items/recyclable/
├── plastic-bottle.svg
├── aluminum-can.svg
├── glass-bottle.svg
└── ... (12 items total)
```

---

### Day 3: Item SVGs (Non-Recyclable)

**Tasks:**
- [ ] Design 12 non-recyclable item SVGs
- [ ] Use same stroke style as recyclable items
- [ ] Export and optimize

**Non-Recyclable Items (12):**

| Item | Filename | Difficulty | Notes |
|------|----------|------------|-------|
| Food Waste | food-waste.svg | Easy | Apple core/banana peel |
| Plastic Bag | plastic-bag.svg | Easy | Generic shopping bag |
| Styrofoam | styrofoam.svg | Easy | Packing material |
| Battery | battery.svg | Medium | AA battery |
| Light Bulb | light-bulb.svg | Medium | Incandescent bulb |
| Broken Glass | broken-glass.svg | Hard | Shattered pieces |
| Pizza Box (Greasy) | pizza-box-greasy.svg | Hard | Stained cardboard |
| Straw | plastic-straw.svg | Medium | Single-use straw |
| Chip Bag | chip-bag.svg | Hard | Mixed material |
| Coffee Cup | disposable-cup.svg | Hard | Wax-coated paper |
| Tissue Paper | tissue.svg | Easy | Used tissue |
| Ceramics | ceramic-mug.svg | Medium | Broken ceramics |

**File Locations:**
```
static/assets/items/non-recyclable/
├── food-waste.svg
├── plastic-bag.svg
├── styrofoam.svg
└── ... (12 items total)
```

---

### Day 3 (cont.): UI Components & Bins

**Tasks:**
- [ ] Design green recycling bin
- [ ] Design red non-recyclable bin
- [ ] Create UI icons (checkmark, X, star)
- [ ] Design buttons and cards

**Bin Specifications:**
```
Bins:
- Size: 400x500px (tall bins)
- Green bin: #00A651 fill, black stroke
- Red bin: #ED1C24 fill, black stroke
- Recycling symbol on green bin
- X symbol on red bin
- Hover state: Add glow effect
```

**File Locations:**
```
static/assets/bins/
├── green-bin.svg
└── red-bin.svg

static/assets/ui/
├── checkmark.svg
├── x-mark.svg
├── star.svg
├── star-filled.svg
└── heart.svg
```

**Asset Checklist:**
- [ ] ✅ 8 hand gesture SVGs
- [ ] ✅ 12 recyclable item SVGs
- [ ] ✅ 12 non-recyclable item SVGs
- [ ] ✅ 2 bin SVGs
- [ ] ✅ 5 UI icon SVGs
- [ ] ✅ All assets optimized and tested

---

## 🎮 Phase 3.2: Game Data Model & State Management
**Duration:** 2 days  
**Goal:** Set up data structures and state management

### Day 4: Create Item Database

**Tasks:**
- [ ] Create `src/lib/data/items.json`
- [ ] Define item type interfaces
- [ ] Add all 24 items with metadata
- [ ] Create utility functions for item selection

**File:** `src/lib/data/items.json`
```json
[
  {
    "id": "plastic-bottle",
    "name": "Plastic Bottle",
    "nameZhHK": "塑膠樽",
    "category": "plastic",
    "isRecyclable": true,
    "difficulty": "easy",
    "image": "/assets/items/recyclable/plastic-bottle.svg",
    "description": "PET #1 plastic bottles are recyclable",
    "descriptionZhHK": "PET #1塑膠樽可回收",
    "funFact": "A plastic bottle can be recycled into a fleece jacket!"
  },
  {
    "id": "food-waste",
    "name": "Food Waste",
    "nameZhHK": "廚餘",
    "category": "organic",
    "isRecyclable": false,
    "difficulty": "easy",
    "image": "/assets/items/non-recyclable/food-waste.svg",
    "description": "Food waste belongs in compost, not recycling",
    "descriptionZhHK": "廚餘應該放在堆肥中，而不是回收箱",
    "funFact": "Food waste can become nutrient-rich compost for gardens"
  }
  // ... Add all 24 items
]
```

**File:** `src/lib/types/index.ts`
```typescript
export type ItemCategory = 'plastic' | 'metal' | 'glass' | 'paper' | 'organic' | 'other';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Item {
  id: string;
  name: string;
  nameZhHK: string;
  category: ItemCategory;
  isRecyclable: boolean;
  difficulty: Difficulty;
  image: string;
  description: string;
  descriptionZhHK: string;
  funFact: string;
}

export interface GameState {
  // User info (mock for now)
  userId: number | null;
  sessionId: number | null;
  
  // Game progress
  score: number;
  lives: number;
  maxLives: number;
  currentStreak: number;
  longestStreak: number;
  
  // Items
  itemsSorted: number;
  totalItems: number;
  currentItem: Item | null;
  remainingItems: Item[];
  sortedItems: SortedItem[];
  
  // State
  isPlaying: boolean;
  isPaused: boolean;
  gameStartTime: Date | null;
  gameEndTime: Date | null;
  
  // Settings
  soundEnabled: boolean;
  language: 'en' | 'zh-HK';
}

export interface SortedItem {
  item: Item;
  playerChoice: 'green' | 'red';
  isCorrect: boolean;
  timeToDecide: number; // seconds
  timestamp: Date;
}
```

**File:** `src/lib/utils/itemSelector.ts`
```typescript
import itemsData from '$lib/data/items.json';
import type { Item, Difficulty } from '$lib/types';

export function getAllItems(): Item[] {
  return itemsData as Item[];
}

export function getItemsByDifficulty(difficulty: Difficulty): Item[] {
  return itemsData.filter(item => item.difficulty === difficulty) as Item[];
}

export function getRandomItems(count: number): Item[] {
  const allItems = getAllItems();
  const shuffled = allItems.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getBalancedItems(count: number): Item[] {
  // Ensure 50/50 split of recyclable/non-recyclable
  const recyclable = itemsData.filter(item => item.isRecyclable);
  const nonRecyclable = itemsData.filter(item => !item.isRecyclable);
  
  const halfCount = Math.floor(count / 2);
  const shuffledRecyclable = recyclable.sort(() => Math.random() - 0.5);
  const shuffledNonRecyclable = nonRecyclable.sort(() => Math.random() - 0.5);
  
  const selected = [
    ...shuffledRecyclable.slice(0, halfCount),
    ...shuffledNonRecyclable.slice(0, count - halfCount)
  ];
  
  return selected.sort(() => Math.random() - 0.5) as Item[];
}

export function getProgressiveItems(count: number): Item[] {
  // Start easy, get progressively harder
  const easy = getItemsByDifficulty('easy');
  const medium = getItemsByDifficulty('medium');
  const hard = getItemsByDifficulty('hard');
  
  const easyCount = Math.floor(count * 0.4);
  const mediumCount = Math.floor(count * 0.4);
  const hardCount = count - easyCount - mediumCount;
  
  return [
    ...easy.slice(0, easyCount),
    ...medium.slice(0, mediumCount),
    ...hard.slice(0, hardCount)
  ];
}
```

**Checklist:**
- [ ] ✅ items.json created with 24 items
- [ ] ✅ TypeScript interfaces defined
- [ ] ✅ Item selector utilities created
- [ ] ✅ All items have English and Chinese translations

---

### Day 5: Set Up State Management

**Tasks:**
- [ ] Create Svelte stores for game state
- [ ] Create actions for state updates
- [ ] Add localStorage persistence
- [ ] Test state updates

**File:** `src/lib/stores/gameStore.ts`
```typescript
import { writable, derived } from 'svelte/store';
import type { GameState, Item, SortedItem } from '$lib/types';
import { getBalancedItems } from '$lib/utils/itemSelector';

const INITIAL_STATE: GameState = {
  userId: null,
  sessionId: null,
  score: 0,
  lives: 3,
  maxLives: 3,
  currentStreak: 0,
  longestStreak: 0,
  itemsSorted: 0,
  totalItems: 20,
  currentItem: null,
  remainingItems: [],
  sortedItems: [],
  isPlaying: false,
  isPaused: false,
  gameStartTime: null,
  gameEndTime: null,
  soundEnabled: true,
  language: 'en'
};

function createGameStore() {
  const { subscribe, set, update } = writable<GameState>(INITIAL_STATE);

  return {
    subscribe,
    
    // Initialize new game
    startGame: (itemCount: number = 20) => {
      const items = getBalancedItems(itemCount);
      update(state => ({
        ...state,
        remainingItems: items,
        currentItem: items[0] || null,
        isPlaying: true,
        gameStartTime: new Date(),
        score: 0,
        lives: 3,
        itemsSorted: 0,
        currentStreak: 0,
        sortedItems: [],
        totalItems: itemCount
      }));
    },
    
    // Sort item (player drops in bin)
    sortItem: (binType: 'green' | 'red', timeToDecide: number) => {
      update(state => {
        if (!state.currentItem) return state;
        
        const isCorrect = 
          (binType === 'green' && state.currentItem.isRecyclable) ||
          (binType === 'red' && !state.currentItem.isRecyclable);
        
        const newStreak = isCorrect ? state.currentStreak + 1 : 0;
        const streakBonus = newStreak === 5 ? 50 : 0;
        const pointsEarned = isCorrect ? 10 + streakBonus : 0;
        const newLives = isCorrect ? state.lives : state.lives - 1;
        
        const sortedItem: SortedItem = {
          item: state.currentItem,
          playerChoice: binType,
          isCorrect,
          timeToDecide,
          timestamp: new Date()
        };
        
        const newRemainingItems = state.remainingItems.slice(1);
        const newCurrentItem = newRemainingItems[0] || null;
        
        return {
          ...state,
          score: state.score + pointsEarned,
          lives: newLives,
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          itemsSorted: state.itemsSorted + 1,
          currentItem: newCurrentItem,
          remainingItems: newRemainingItems,
          sortedItems: [...state.sortedItems, sortedItem],
          isPlaying: newLives > 0 && newCurrentItem !== null
        };
      });
    },
    
    // End game
    endGame: () => {
      update(state => ({
        ...state,
        isPlaying: false,
        gameEndTime: new Date()
      }));
    },
    
    // Reset game
    reset: () => set(INITIAL_STATE),
    
    // Toggle pause
    togglePause: () => {
      update(state => ({
        ...state,
        isPaused: !state.isPaused
      }));
    },
    
    // Update settings
    updateSettings: (settings: Partial<Pick<GameState, 'soundEnabled' | 'language'>>) => {
      update(state => ({
        ...state,
        ...settings
      }));
    }
  };
}

export const gameStore = createGameStore();

// Derived stores
export const accuracy = derived(gameStore, $game => {
  if ($game.itemsSorted === 0) return 0;
  const correctCount = $game.sortedItems.filter(item => item.isCorrect).length;
  return Math.round((correctCount / $game.itemsSorted) * 100);
});

export const isGameOver = derived(gameStore, $game => {
  return !$game.isPlaying && $game.itemsSorted > 0;
});

export const timeElapsed = derived(gameStore, $game => {
  if (!$game.gameStartTime) return 0;
  const endTime = $game.gameEndTime || new Date();
  return Math.floor((endTime.getTime() - $game.gameStartTime.getTime()) / 1000);
});
```

**File:** `src/lib/stores/persistence.ts`
```typescript
import { gameStore } from './gameStore';
import type { GameState } from '$lib/types';

const STORAGE_KEY = 'cocacola-game-state';

export function saveGameState(state: GameState) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function clearGameState() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Auto-save on state changes
if (typeof window !== 'undefined') {
  gameStore.subscribe(state => {
    if (state.isPlaying) {
      saveGameState(state);
    }
  });
}
```

**Checklist:**
- [ ] ✅ Game store created with actions
- [ ] ✅ Derived stores for computed values
- [ ] ✅ localStorage persistence working
- [ ] ✅ State updates tested in browser console

---

## 🎨 Phase 3.3: Start & Tutorial Screens
**Duration:** 2-3 days  
**Goal:** Create welcoming and instructional screens

### Day 6: Build Start Screen

**Tasks:**
- [ ] Create layout and styling
- [ ] Add logo and title
- [ ] Add animated "Tap to Start" button
- [ ] Add pointing hand animation
- [ ] Link to tutorial screen

**File:** `src/routes/+page.svelte`
```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { fade, scale } from 'svelte/transition';
  
  let isLoaded = false;
  
  onMount(() => {
    isLoaded = true;
  });
  
  function startGame() {
    goto('/tutorial');
  }
</script>

<div class="start-screen" class:loaded={isLoaded}>
  <div class="logo-container" in:fade={{ duration: 800 }}>
    <img src="/assets/logo-cocacola.svg" alt="Coca-Cola" class="logo" />
  </div>
  
  <h1 class="title" in:scale={{ duration: 600, delay: 400 }}>
    Recycling Challenge
  </h1>
  
  <button 
    class="start-button" 
    on:click={startGame}
    in:scale={{ duration: 500, delay: 800 }}
  >
    <span>TAP TO START</span>
    <img 
      src="/assets/hands/pointing.svg" 
      alt="Tap" 
      class="hand-icon pulse"
    />
  </button>
  
  <div class="decorative-pattern"></div>
</div>

<style>
  .start-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }
  
  .logo-container {
    margin-bottom: 2rem;
  }
  
  .logo {
    width: 200px;
    height: auto;
  }
  
  .title {
    font-size: 3.5rem;
    font-weight: bold;
    color: #ED1C24;
    text-align: center;
    margin-bottom: 3rem;
    text-shadow: 4px 4px 0 #000;
    -webkit-text-stroke: 2px black;
    paint-order: stroke fill;
  }
  
  .start-button {
    position: relative;
    background: #ED1C24;
    color: white;
    border: 4px solid black;
    font-size: 2rem;
    font-weight: bold;
    padding: 1.5rem 3rem;
    cursor: pointer;
    box-shadow: 6px 6px 0 black;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .start-button:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0 black;
  }
  
  .start-button:active {
    transform: translate(6px, 6px);
    box-shadow: 0 0 0 black;
  }
  
  .hand-icon {
    width: 60px;
    height: 60px;
  }
  
  .pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  
  .decorative-pattern {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: repeating-linear-gradient(
      45deg,
      #00A651,
      #00A651 20px,
      #ED1C24 20px,
      #ED1C24 40px
    );
    opacity: 0.1;
  }
  
  /* iPad Portrait */
  @media (max-width: 1024px) and (orientation: portrait) {
    .title {
      font-size: 3rem;
    }
    
    .start-button {
      font-size: 1.8rem;
    }
  }
  
  /* iPad Landscape */
  @media (max-height: 800px) and (orientation: landscape) {
    .title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
    
    .logo {
      width: 150px;
    }
  }
</style>
```

**Checklist:**
- [ ] ✅ Start screen renders correctly
- [ ] ✅ Animations play smoothly (60fps)
- [ ] ✅ Button responds to tap
- [ ] ✅ Responsive on iPad portrait/landscape
- [ ] ✅ Touch target meets 44pt minimum

---

### Day 7-8: Build Tutorial Screen

**Tasks:**
- [ ] Create multi-step tutorial
- [ ] Add swipe navigation
- [ ] Show example items
- [ ] Explain game mechanics
- [ ] Add "Got It" button to start game

**File:** `src/routes/tutorial/+page.svelte`
```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { fly, fade } from 'svelte/transition';
  import { gameStore } from '$lib/stores/gameStore';
  
  let currentStep = 0;
  const totalSteps = 4;
  
  const steps = [
    {
      title: "Welcome!",
      description: "Learn to sort items into the correct bins",
      image: "/assets/hands/pointing.svg"
    },
    {
      title: "Grab Items",
      description: "Tap and drag items with your finger",
      image: "/assets/hands/grabbing-open.svg"
    },
    {
      title: "Sort Correctly",
      description: "Green for recyclable, Red for non-recyclable",
      image: "/assets/bins/green-bin.svg"
    },
    {
      title: "Ready?",
      description: "Earn points and learn about recycling!",
      image: "/assets/hands/thumbs-up.svg"
    }
  ];
  
  function nextStep() {
    if (currentStep < totalSteps - 1) {
      currentStep++;
    }
  }
  
  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }
  
  function startGame() {
    gameStore.startGame(20);
    goto('/game');
  }
  
  let touchStartX = 0;
  
  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
  }
  
  function handleTouchEnd(e: TouchEvent) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextStep();
      } else {
        prevStep();
      }
    }
  }
</script>

<div 
  class="tutorial-screen"
  on:touchstart={handleTouchStart}
  on:touchend={handleTouchEnd}
>
  <div class="progress-bar">
    {#each Array(totalSteps) as _, i}
      <div class="progress-dot" class:active={i === currentStep}></div>
    {/each}
  </div>
  
  <div class="tutorial-content">
    {#key currentStep}
      <div 
        class="step-content" 
        in:fly={{ x: 200, duration: 300 }}
        out:fly={{ x: -200, duration: 300 }}
      >
        <div class="step-image">
          <img src={steps[currentStep].image} alt={steps[currentStep].title} />
        </div>
        
        <h2 class="step-title">{steps[currentStep].title}</h2>
        <p class="step-description">{steps[currentStep].description}</p>
        
        {#if currentStep === 2}
          <div class="bins-example">
            <div class="bin-info">
              <img src="/assets/bins/green-bin.svg" alt="Green bin" class="bin-small" />
              <p>Recyclable Items</p>
              <div class="example-items">
                <img src="/assets/items/recyclable/plastic-bottle.svg" alt="Bottle" class="item-small" />
                <img src="/assets/items/recyclable/aluminum-can.svg" alt="Can" class="item-small" />
                <img src="/assets/items/recyclable/cardboard-box.svg" alt="Box" class="item-small" />
              </div>
            </div>
            
            <div class="bin-info">
              <img src="/assets/bins/red-bin.svg" alt="Red bin" class="bin-small" />
              <p>Non-Recyclable Items</p>
              <div class="example-items">
                <img src="/assets/items/non-recyclable/food-waste.svg" alt="Food" class="item-small" />
                <img src="/assets/items/non-recyclable/plastic-bag.svg" alt="Bag" class="item-small" />
                <img src="/assets/items/non-recyclable/battery.svg" alt="Battery" class="item-small" />
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/key}
  </div>
  
  <div class="tutorial-navigation">
    {#if currentStep > 0}
      <button class="nav-button secondary" on:click={prevStep}>
        ← Back
      </button>
    {:else}
      <div></div>
    {/if}
    
    {#if currentStep < totalSteps - 1}
      <button class="nav-button primary" on:click={nextStep}>
        Next →
      </button>
    {:else}
      <button class="nav-button primary start" on:click={startGame}>
        GOT IT! LET'S PLAY
        <img src="/assets/hands/pointing.svg" alt="Start" class="hand-mini" />
      </button>
    {/if}
  </div>
  
  <button class="skip-button" on:click={startGame}>
    Skip Tutorial
  </button>
</div>

<style>
  .tutorial-screen {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: white;
    padding: 2rem;
  }
  
  .progress-bar {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .progress-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ddd;
    border: 2px solid black;
    transition: all 0.3s;
  }
  
  .progress-dot.active {
    background: #ED1C24;
    transform: scale(1.5);
  }
  
  .tutorial-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }
  
  .step-content {
    text-align: center;
    width: 100%;
  }
  
  .step-image {
    margin-bottom: 2rem;
  }
  
  .step-image img {
    width: 200px;
    height: 200px;
  }
  
  .step-title {
    font-size: 2.5rem;
    color: #ED1C24;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  .step-description {
    font-size: 1.5rem;
    color: #333;
    line-height: 1.6;
  }
  
  .bins-example {
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    justify-content: center;
  }
  
  .bin-info {
    text-align: center;
  }
  
  .bin-small {
    width: 120px;
    height: auto;
    margin-bottom: 1rem;
  }
  
  .example-items {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .item-small {
    width: 60px;
    height: 60px;
    border: 2px solid black;
    padding: 0.5rem;
    background: white;
  }
  
  .tutorial-navigation {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .nav-button {
    padding: 1rem 2rem;
    font-size: 1.3rem;
    font-weight: bold;
    border: 4px solid black;
    cursor: pointer;
    box-shadow: 4px 4px 0 black;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .nav-button.primary {
    background: #00A651;
    color: white;
  }
  
  .nav-button.secondary {
    background: white;
    color: black;
  }
  
  .nav-button.start {
    background: #ED1C24;
    font-size: 1.5rem;
    padding: 1.5rem 2.5rem;
  }
  
  .nav-button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 black;
  }
  
  .hand-mini {
    width: 40px;
    height: 40px;
  }
  
  .skip-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: #999;
    text-decoration: underline;
    cursor: pointer;
    font-size: 1rem;
  }
</style>
```

**Checklist:**
- [ ] ✅ Tutorial shows 4 steps
- [ ] ✅ Swipe navigation works (left/right)
- [ ] ✅ Button navigation works
- [ ] ✅ Example items shown
- [ ] ✅ Skip option available
- [ ] ✅ Smooth transitions between steps

---

## 🎮 Phase 3.4: Main Game Screen
**Duration:** 4-5 days  
**Goal:** Build core gameplay mechanics

### Day 9-10: Game Layout & UI

**Tasks:**
- [ ] Create main game layout (landscape optimized)
- [ ] Add top bar (timer, score, lives)
- [ ] Add bins at bottom
- [ ] Position item in center
- [ ] Add pause menu

**File:** `src/routes/game/+page.svelte` (Part 1 - Layout)
```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { gameStore, accuracy } from '$lib/stores/gameStore';
  import type { Item } from '$lib/types';
  
  import TopBar from '$lib/components/game/TopBar.svelte';
  import GameItem from '$lib/components/game/GameItem.svelte';
  import Bin from '$lib/components/game/Bin.svelte';
  import FeedbackAnimation from '$lib/components/game/FeedbackAnimation.svelte';
  
  let showFeedback = false;
  let lastSortCorrect = false;
  let itemStartTime = Date.now();
  
  onMount(() => {
    // Game should already be started from tutorial
    if (!$gameStore.isPlaying) {
      gameStore.startGame(20);
    }
    itemStartTime = Date.now();
  });
  
  $: if (!$gameStore.isPlaying && $gameStore.itemsSorted > 0) {
    // Game over - navigate to results
    setTimeout(() => goto('/results'), 2000);
  }
  
  function handleItemDropped(event: CustomEvent<{ binType: 'green' | 'red' }>) {
    const timeToDecide = (Date.now() - itemStartTime) / 1000;
    const { binType } = event.detail;
    
    // Check if correct
    const isCorrect = 
      (binType === 'green' && $gameStore.currentItem?.isRecyclable) ||
      (binType === 'red' && !$gameStore.currentItem?.isRecyclable);
    
    lastSortCorrect = isCorrect;
    showFeedback = true;
    
    // Update game state
    gameStore.sortItem(binType, timeToDecide);
    
    // Hide feedback and show next item
    setTimeout(() => {
      showFeedback = false;
      itemStartTime = Date.now();
    }, 1500);
  }
</script>

<div class="game-screen">
  <TopBar 
    score={$gameStore.score}
    lives={$gameStore.lives}
    maxLives={$gameStore.maxLives}
    itemsSorted={$gameStore.itemsSorted}
    totalItems={$gameStore.totalItems}
  />
  
  <div class="game-area">
    {#if $gameStore.currentItem && !showFeedback}
      <GameItem 
        item={$gameStore.currentItem}
        on:dropped={handleItemDropped}
      />
    {/if}
    
    {#if showFeedback}
      <FeedbackAnimation 
        isCorrect={lastSortCorrect}
        item={$gameStore.sortedItems[$gameStore.sortedItems.length - 1]?.item}
        streak={$gameStore.currentStreak}
      />
    {/if}
  </div>
  
  <div class="bins-area">
    <Bin type="green" label="RECYCLABLE" />
    <Bin type="red" label="NON-RECYCLABLE" />
  </div>
</div>

<style>
  .game-screen {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%);
  }
  
  .game-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2rem;
  }
  
  .bins-area {
    display: flex;
    justify-content: space-around;
    padding: 2rem;
    gap: 2rem;
  }
  
  @media (orientation: landscape) {
    .bins-area {
      padding: 1rem 4rem;
    }
  }
</style>
```

**Checklist:**
- [ ] ✅ Layout works in portrait and landscape
- [ ] ✅ Top bar displays correctly
- [ ] ✅ Bins positioned at bottom
- [ ] ✅ Center area for items

---

### Day 11: Drag-and-Drop Implementation

**Tasks:**
- [ ] Implement touch drag mechanics
- [ ] Handle mouse drag (for desktop testing)
- [ ] Add visual feedback during drag
- [ ] Detect bin collision
- [ ] Add magnetic snap effect

**File:** `src/lib/components/game/GameItem.svelte`
```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Item } from '$lib/types';
  
  export let item: Item;
  
  const dispatch = createEventDispatcher();
  
  let isDragging = false;
  let itemX = 0;
  let itemY = 0;
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;
  
  let itemElement: HTMLElement;
  
  function handleStart(clientX: number, clientY: number) {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    
    const rect = itemElement.getBoundingClientRect();
    offsetX = clientX - rect.left - rect.width / 2;
    offsetY = clientY - rect.top - rect.height / 2;
  }
  
  function handleMove(clientX: number, clientY: number) {
    if (!isDragging) return;
    
    itemX = clientX - offsetX;
    itemY = clientY - offsetY;
  }
  
  function handleEnd(clientX: number, clientY: number) {
    if (!isDragging) return;
    isDragging = false;
    
    // Check which bin the item is over
    const binType = detectBinCollision(clientX, clientY);
    
    if (binType) {
      dispatch('dropped', { binType });
    } else {
      // Snap back to center
      itemX = 0;
      itemY = 0;
    }
  }
  
  function detectBinCollision(x: number, y: number): 'green' | 'red' | null {
    const greenBin = document.querySelector('.bin.green');
    const redBin = document.querySelector('.bin.red');
    
    if (greenBin) {
      const rect = greenBin.getBoundingClientRect();
      if (
        x >= rect.left && x <= rect.right &&
        y >= rect.top && y <= rect.bottom
      ) {
        return 'green';
      }
    }
    
    if (redBin) {
      const rect = redBin.getBoundingClientRect();
      if (
        x >= rect.left && x <= rect.right &&
        y >= rect.top && y <= rect.bottom
      ) {
        return 'red';
      }
    }
    
    return null;
  }
  
  // Touch handlers
  function handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }
  
  function handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }
  
  function handleTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX, touch.clientY);
  }
  
  // Mouse handlers (for testing)
  function handleMouseDown(e: MouseEvent) {
    handleStart(e.clientX, e.clientY);
  }
  
  function handleMouseMove(e: MouseEvent) {
    handleMove(e.clientX, e.clientY);
  }
  
  function handleMouseUp(e: MouseEvent) {
    handleEnd(e.clientX, e.clientY);
  }
</script>

<svelte:window
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
/>

<div 
  bind:this={itemElement}
  class="game-item"
  class:dragging={isDragging}
  style="transform: translate({itemX}px, {itemY}px)"
  on:mousedown={handleMouseDown}
  on:touchstart={handleTouchStart}
>
  <img src={item.image} alt={item.name} class="item-image" />
  
  {#if !isDragging}
    <div class="drag-hint">
      <img src="/assets/hands/pointing.svg" alt="Drag" class="hand-hint" />
      <span>Drag to sort</span>
    </div>
  {/if}
</div>

<style>
  .game-item {
    position: relative;
    cursor: grab;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }
  
  .game-item.dragging {
    cursor: grabbing;
    transition: none;
    z-index: 100;
  }
  
  .item-image {
    width: 300px;
    height: 300px;
    filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.3));
  }
  
  .game-item.dragging .item-image {
    transform: scale(1.1) rotate(5deg);
  }
  
  .drag-hint {
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    animation: bounce 2s infinite;
  }
  
  .hand-hint {
    width: 50px;
    height: 50px;
  }
  
  .drag-hint span {
    font-size: 1.2rem;
    color: #666;
    font-weight: bold;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(-10px);
    }
  }
  
  /* iPad optimizations */
  @media (max-width: 1024px) {
    .item-image {
      width: 250px;
      height: 250px;
    }
  }
</style>
```

**File:** `src/lib/components/game/Bin.svelte`
```svelte
<script lang="ts">
  export let type: 'green' | 'red';
  export let label: string;
  
  let isHovered = false;
  
  // Add data attribute for collision detection
  $: binClass = `bin ${type}`;
</script>

<div class={binClass} class:hovered={isHovered} data-bin-type={type}>
  <div class="bin-icon">
    <img src="/assets/bins/{type}-bin.svg" alt="{label} bin" />
  </div>
  <div class="bin-label">{label}</div>
</div>

<style>
  .bin {
    width: 300px;
    padding: 2rem;
    border: 4px solid black;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s;
    position: relative;
  }
  
  .bin.green {
    background: #00A651;
  }
  
  .bin.red {
    background: #ED1C24;
  }
  
  .bin.hovered {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
  }
  
  .bin-icon img {
    width: 200px;
    height: auto;
  }
  
  .bin-label {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-align: center;
    text-shadow: 2px 2px 0 black;
  }
  
  @media (max-width: 1024px) {
    .bin {
      width: 250px;
    }
    
    .bin-icon img {
      width: 150px;
    }
    
    .bin-label {
      font-size: 1.2rem;
    }
  }
</style>
```

**Checklist:**
- [ ] ✅ Touch drag works smoothly
- [ ] ✅ Mouse drag works (for testing)
- [ ] ✅ Item scales when dragging
- [ ] ✅ Bin detection works accurately
- [ ] ✅ Item snaps back if dropped outside bins
- [ ] ✅ No lag or jitter during drag

---

### Day 12: UI Components

**Tasks:**
- [ ] Build TopBar component
- [ ] Add score animations
- [ ] Add life indicators with hearts
- [ ] Create progress indicator

**File:** `src/lib/components/game/TopBar.svelte`
```svelte
<script lang="ts">
  import { fly, scale } from 'svelte/transition';
  
  export let score: number;
  export let lives: number;
  export let maxLives: number;
  export let itemsSorted: number;
  export let totalItems: number;
  
  $: progress = (itemsSorted / totalItems) * 100;
</script>

<div class="top-bar">
  <div class="score-display">
    <span class="label">SCORE</span>
    <span class="value">{score}</span>
  </div>
  
  <div class="progress-display">
    <div class="progress-label">{itemsSorted} / {totalItems}</div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: {progress}%"></div>
    </div>
  </div>
  
  <div class="lives-display">
    {#each Array(maxLives) as _, i}
      {#if i < lives}
        <img 
          src="/assets/ui/heart.svg" 
          alt="Life" 
          class="heart active"
          in:scale={{ duration: 300 }}
        />
      {:else}
        <img 
          src="/assets/ui/heart.svg" 
          alt="Life lost" 
          class="heart inactive"
        />
      {/if}
    {/each}
  </div>
</div>

<style>
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: white;
    border-bottom: 4px solid black;
    gap: 2rem;
  }
  
  .score-display {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #666;
  }
  
  .value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ED1C24;
    font-family: 'Courier New', monospace;
  }
  
  .progress-display {
    flex: 1;
    max-width: 400px;
  }
  
  .progress-label {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  .progress-bar {
    height: 30px;
    background: #eee;
    border: 3px solid black;
    border-radius: 20px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00A651 0%, #ED1C24 100%);
    transition: width 0.5s ease;
  }
  
  .lives-display {
    display: flex;
    gap: 0.5rem;
  }
  
  .heart {
    width: 40px;
    height: 40px;
    transition: all 0.3s;
  }
  
  .heart.active {
    filter: drop-shadow(0 0 5px rgba(237, 28, 36, 0.5));
  }
  
  .heart.inactive {
    opacity: 0.3;
    filter: grayscale(100%);
  }
</style>
```

**Checklist:**
- [ ] ✅ TopBar displays all info
- [ ] ✅ Score updates animate
- [ ] ✅ Progress bar fills correctly
- [ ] ✅ Hearts disappear when life lost

---

## ✨ Phase 3.5: Feedback System
**Duration:** 2-3 days  
**Goal:** Create engaging feedback animations

### Day 13: Feedback Animations

**Tasks:**
- [ ] Create FeedbackAnimation component
- [ ] Add correct/incorrect animations
- [ ] Show point gains
- [ ] Display item explanations
- [ ] Add streak bonus effects

**File:** `src/lib/components/game/FeedbackAnimation.svelte`
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { scale, fly, fade } from 'svelte/transition';
  import type { Item } from '$lib/types';
  
  export let isCorrect: boolean;
  export let item: Item;
  export let streak: number = 0;
  
  let showStreakBonus = streak === 5;
  
  onMount(() => {
    if (isCorrect && 'vibrate' in navigator) {
      navigator.vibrate(50);
    } else if (!isCorrect && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  });
</script>

<div class="feedback-container">
  {#if isCorrect}
    <div class="feedback correct" in:scale={{ duration: 500 }}>
      <img 
        src="/assets/ui/checkmark.svg" 
        alt="Correct" 
        class="feedback-icon"
        in:scale={{ duration: 400, delay: 100 }}
      />
      
      <img 
        src="/assets/hands/thumbs-up.svg" 
        alt="Great!" 
        class="hand-animation"
        in:fly={{ y: 50, duration: 500, delay: 200 }}
      />
      
      <div class="points" in:fly={{ y: -30, duration: 600, delay: 300 }}>
        +10
      </div>
      
      {#if showStreakBonus}
        <div class="streak-bonus" in:scale={{ duration: 600, delay: 400 }}>
          <div class="streak-text">PERFECT STREAK!</div>
          <div class="bonus-points">+50 BONUS</div>
          <img src="/assets/hands/clapping.svg" alt="Amazing!" class="clap-hands" />
        </div>
      {/if}
    </div>
  {:else}
    <div class="feedback incorrect" in:scale={{ duration: 500 }}>
      <img 
        src="/assets/ui/x-mark.svg" 
        alt="Incorrect" 
        class="feedback-icon shake"
        in:scale={{ duration: 400, delay: 100 }}
      />
      
      <img 
        src="/assets/hands/wave-no.svg" 
        alt="Not quite" 
        class="hand-animation wave"
        in:fly={{ x: -50, duration: 500, delay: 200 }}
      />
      
      <div class="explanation" in:fade={{ duration: 400, delay: 400 }}>
        <p class="explanation-text">
          {item.isRecyclable ? '✓ This is recyclable!' : '✗ Not recyclable'}
        </p>
        <p class="explanation-detail">{item.description}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .feedback-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .feedback {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .feedback-icon {
    width: 150px;
    height: 150px;
    filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.3));
  }
  
  .hand-animation {
    width: 200px;
    height: 200px;
  }
  
  .shake {
    animation: shake 0.5s;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px) rotate(-5deg); }
    75% { transform: translateX(10px) rotate(5deg); }
  }
  
  .wave {
    animation: wave 0.6s ease-in-out 2;
  }
  
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-15deg); }
    75% { transform: rotate(15deg); }
  }
  
  .points {
    font-size: 4rem;
    font-weight: bold;
    color: #00A651;
    text-shadow: 3px 3px 0 black;
    animation: float-up 0.8s ease-out;
  }
  
  @keyframes float-up {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-50px) scale(1.5);
    }
  }
  
  .streak-bonus {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #FFD700, #FFA500);
    padding: 2rem 3rem;
    border: 5px solid black;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
    animation: pulse-glow 1s infinite;
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
    }
    50% {
      box-shadow: 0 0 60px rgba(255, 215, 0, 1);
    }
  }
  
  .streak-text {
    font-size: 2rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 0.5rem;
  }
  
  .bonus-points {
    font-size: 3rem;
    font-weight: bold;
    color: #ED1C24;
    text-shadow: 2px 2px 0 white;
  }
  
  .clap-hands {
    width: 100px;
    height: 100px;
    margin-top: 1rem;
    animation: clap 0.3s ease-in-out infinite;
  }
  
  @keyframes clap {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  .explanation {
    background: white;
    border: 4px solid black;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    max-width: 500px;
    text-align: center;
  }
  
  .explanation-text {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .explanation-detail {
    font-size: 1.2rem;
    color: #666;
    line-height: 1.4;
  }
</style>
```

**Checklist:**
- [ ] ✅ Correct feedback shows thumbs up
- [ ] ✅ Incorrect feedback shows wave + explanation
- [ ] ✅ Streak bonus appears at 5 correct
- [ ] ✅ Haptic feedback works on iPad
- [ ] ✅ Animations are smooth (60fps)

---

### Day 14: Sound Effects

**Tasks:**
- [ ] Add sound files to project
- [ ] Create sound utility
- [ ] Integrate sounds with feedback
- [ ] Add sound toggle setting

**File:** `src/lib/utils/sounds.ts`
```typescript
class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadSounds();
    }
  }

  private loadSounds() {
    const soundFiles = {
      correct: '/sounds/correct.mp3',
      incorrect: '/sounds/incorrect.mp3',
      streak: '/sounds/streak.mp3',
      lifeL ost: '/sounds/life-lost.mp3',
      gameOver: '/sounds/game-over.mp3'
    };

    for (const [name, path] of Object.entries(soundFiles)) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(name, audio);
    }
  }

  play(soundName: string) {
    if (!this.enabled) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.warn('Sound play failed:', err));
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
```

**Sound File Locations:**
```
static/sounds/
├── correct.mp3 (positive chime)
├── incorrect.mp3 (gentle negative tone)
├── streak.mp3 (celebration)
├── life-lost.mp3 (sad tone)
└── game-over.mp3 (end tune)
```

**Integrate in FeedbackAnimation:**
```typescript
import { soundManager } from '$lib/utils/sounds';

onMount(() => {
  if (isCorrect) {
    if (streak === 5) {
      soundManager.play('streak');
    } else {
      soundManager.play('correct');
    }
  } else {
    soundManager.play('incorrect');
  }
});
```

**Checklist:**
- [ ] ✅ Sound files added to project
- [ ] ✅ Sounds play on correct/incorrect
- [ ] ✅ Streak sound plays on bonus
- [ ] ✅ Sound can be toggled off
- [ ] ✅ No audio errors in console

---

## 🏆 Phase 3.6: Results Screen
**Duration:** 2 days  
**Goal:** Display game summary with animations

### Day 15-16: Build Results Screen

**Tasks:**
- [ ] Create results layout
- [ ] Add score count-up animation
- [ ] Show accuracy percentage
- [ ] Display performance-based hand animation
- [ ] Add fun recycling fact
- [ ] Add navigation buttons

**File:** `src/routes/results/+page.svelte`
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { gameStore, accuracy } from '$lib/stores/gameStore';
  import { fade, scale, fly } from 'svelte/transition';
  
  let displayScore = 0;
  let showContent = false;
  
  $: performanceLevel = getPerformanceLevel($accuracy);
  
  function getPerformanceLevel(acc: number) {
    if (acc >= 90) return {
      stars: 3,
      title: 'Recycling Champion!',
      animation: 'salute',
      color: '#FFD700'
    };
    if (acc >= 70) return {
      stars: 2,
      title: 'Great Work!',
      animation: 'salute',
      color: '#00A651'
    };
    if (acc >= 50) return {
      stars: 1,
      title: 'Keep Learning!',
      animation: 'salute',
      color: '#FFA500'
    };
    return {
      stars: 0,
      title: 'Practice Makes Perfect!',
      animation: 'fist-pump',
      color: '#ED1C24'
    };
  }
  
  const funFacts = [
    "Recycling one aluminum can saves enough energy to run a TV for 3 hours!",
    "Glass can be recycled endlessly without losing quality.",
    "Recycling one ton of paper saves 17 trees!",
    "It takes 450 years for a plastic bottle to decompose.",
    "Recycled plastic bottles can become fleece jackets!"
  ];
  
  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
  
  onMount(() => {
    // Animate score count-up
    const duration = 800;
    const start = Date.now();
    const target = $gameStore.score;
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      displayScore = Math.floor(progress * target);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        showContent = true;
      }
    };
    
    animate();
  });
  
  function playAgain() {
    gameStore.reset();
    goto('/');
  }
  
  function viewDashboard() {
    goto('/dashboard');
  }
</script>

<div class="results-screen">
  <div class="results-content">
    <h1 class="title" in:scale={{ duration: 600 }}>
      {performanceLevel.title}
    </h1>
    
    <div class="stars" in:scale={{ duration: 500, delay: 400 }}>
      {#each Array(3) as _, i}
        {#if i < performanceLevel.stars}
          <img 
            src="/assets/ui/star-filled.svg" 
            alt="Star" 
            class="star"
            in:scale={{ duration: 300, delay: 600 + i * 100 }}
          />
        {:else}
          <img 
            src="/assets/ui/star.svg" 
            alt="Star" 
            class="star empty"
          />
        {/if}
      {/each}
    </div>
    
    <div class="score-display" in:scale={{ duration: 500, delay: 400 }}>
      <div class="score-label">FINAL SCORE</div>
      <div class="score-value" style="color: {performanceLevel.color}">
        {displayScore}
      </div>
    </div>
    
    {#if showContent}
      <div class="stats-grid" in:fade={{ duration: 400 }}>
        <div class="stat-card">
          <div class="stat-value">{$accuracy}%</div>
          <div class="stat-label">Accuracy</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{$gameStore.sortedItems.filter(i => i.isCorrect).length}</div>
          <div class="stat-label">Correct</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{$gameStore.longestStreak}</div>
          <div class="stat-label">Best Streak</div>
        </div>
      </div>
      
      <div class="hand-animation-container" in:scale={{ duration: 600, delay: 200 }}>
        <img 
          src="/assets/hands/{performanceLevel.animation}.svg" 
          alt={performanceLevel.title}
          class="hand-result"
        />
      </div>
      
      <div class="fun-fact" in:fly={{ y: 50, duration: 500, delay: 500 }}>
        <div class="fact-icon">💡</div>
        <div class="fact-text">{randomFact}</div>
      </div>
      
      <div class="action-buttons" in:fade={{ duration: 400, delay: 800 }}>
        <button class="btn primary" on:click={playAgain}>
          PLAY AGAIN
          <img src="/assets/hands/pointing.svg" alt="" class="btn-icon" />
        </button>
        
        <button class="btn secondary" on:click={viewDashboard}>
          VIEW DASHBOARD
          <img src="/assets/hands/pointing.svg" alt="" class="btn-icon" />
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .results-screen {
    min-height: 100vh;
    background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .results-content {
    max-width: 800px;
    width: 100%;
    text-align: center;
  }
  
  .title {
    font-size: 3.5rem;
    font-weight: bold;
    color: #ED1C24;
    margin-bottom: 1.5rem;
    text-shadow: 4px 4px 0 black;
  }
  
  .stars {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .star {
    width: 80px;
    height: 80px;
  }
  
  .star.empty {
    opacity: 0.3;
  }
  
  .score-display {
    margin-bottom: 2rem;
  }
  
  .score-label {
    font-size: 1.5rem;
    font-weight: bold;
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .score-value {
    font-size: 6rem;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    text-shadow: 3px 3px 0 black;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    border: 4px solid black;
    border-radius: 12px;
    padding: 1.5rem;
  }
  
  .stat-value {
    font-size: 3rem;
    font-weight: bold;
    color: #00A651;
  }
  
  .stat-label {
    font-size: 1.2rem;
    color: #666;
    margin-top: 0.5rem;
  }
  
  .hand-animation-container {
    margin: 2rem 0;
  }
  
  .hand-result {
    width: 250px;
    height: 250px;
    animation: salute 1.5s ease-in-out 2;
  }
  
  @keyframes salute {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  .fun-fact {
    background: #FFF9C4;
    border: 4px solid black;
    border-radius: 12px;
    padding: 1.5rem 2rem;
    margin: 2rem auto;
    max-width: 600px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .fact-icon {
    font-size: 3rem;
  }
  
  .fact-text {
    font-size: 1.2rem;
    line-height: 1.6;
    text-align: left;
  }
  
  .action-buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 2.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    border: 4px solid black;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 4px 4px 0 black;
    transition: all 0.2s;
  }
  
  .btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 black;
  }
  
  .btn.primary {
    background: #00A651;
    color: white;
  }
  
  .btn.secondary {
    background: #ED1C24;
    color: white;
  }
  
  .btn-icon {
    width: 40px;
    height: 40px;
  }
</style>
```

**Checklist:**
- [ ] ✅ Score counts up smoothly
- [ ] ✅ Stars appear based on performance
- [ ] ✅ Hand animation plays correctly
- [ ] ✅ Fun fact displays randomly
- [ ] ✅ Navigation buttons work
- [ ] ✅ All animations are smooth

---

## ✅ Testing & Verification

### Final Testing Checklist

**Functionality Tests:**
- [ ] ✅ Game starts correctly from tutorial
- [ ] ✅ All 20 items appear in sequence
- [ ] ✅ Drag and drop works on touch and mouse
- [ ] ✅ Score calculates correctly
- [ ] ✅ Lives decrease on wrong answers
- [ ] ✅ Streak bonus triggers at 5 correct
- [ ] ✅ Game ends when all items sorted or lives = 0
- [ ] ✅ Results screen shows accurate data
- [ ] ✅ Can play multiple games in a row

**Visual Tests:**
- [ ] ✅ All assets load properly
- [ ] ✅ Layout works in portrait orientation
- [ ] ✅ Layout works in landscape orientation
- [ ] ✅ No visual glitches or overlaps
- [ ] ✅ Animations are smooth (no lag)
- [ ] ✅ Text is readable on all screens

**Performance Tests:**
- [ ] ✅ Page loads in < 3 seconds
- [ ] ✅ Game runs at 60fps
- [ ] ✅ No memory leaks (check DevTools)
- [ ] ✅ Touch response < 100ms

**Device Tests:**
- [ ] ✅ Test on iPad Air
- [ ] ✅ Test on iPad Pro
- [ ] ✅ Test on iPad Mini
- [ ] ✅ Test in Safari (primary browser)
- [ ] ✅ Test in Chrome (secondary)

---

## 📝 Stage 3 Completion Criteria

**All tasks completed when:**
- [ ] All assets (40+ items, 8+ hands, bins, UI) created
- [ ] Game data model implemented
- [ ] Start and tutorial screens fully functional
- [ ] Main game with drag-drop working perfectly
- [ ] Feedback system with animations and sounds
- [ ] Results screen with all features
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance targets met
- [ ] Responsive on iPad (both orientations)

---

## 🚀 Next Steps After Stage 3

Once Stage 3 is complete, you can:

1. **Continue playing with mock data** - Game is fully playable without backend
2. **Start Stage 1** - Set up Azure infrastructure
3. **Start Stage 2** - Build Azure Functions API
4. **Start Stage 4** - Add user system and dashboard
5. **Test and iterate** - Gather feedback on gameplay

---

## 📊 Progress Tracking

Use this checklist to track your progress:

- [ ] Phase 3.1: Asset Preparation (3 days)
- [ ] Phase 3.2: Game Data Model (2 days)
- [ ] Phase 3.3: Start & Tutorial Screens (3 days)
- [ ] Phase 3.4: Main Game Screen (5 days)
- [ ] Phase 3.5: Feedback System (3 days)
- [ ] Phase 3.6: Results Screen (2 days)

**Total Estimated Time:** 18 days (≈ 3 weeks)

---

*Last Updated: February 3, 2026*  
*Status: Ready to begin Phase 3.1*
