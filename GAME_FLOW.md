# Coca-Cola Recycling Game - Game Flow & Design

## 🎮 Game Overview
An interactive recycling education game where players learn to identify recyclable and non-recyclable items by sorting them into the correct bins.

**Target Platform:** iPad (Tablet-optimized)  
**Visual Style:** Red & Green color scheme with hand-drawn stroke outlines  
**Interaction:** Hand gesture visuals (no avatars, faces, or 3D elements)

---

## 🎨 Design Specifications

### Color Palette
- **Primary Red:** `#ED1C24` (Coca-Cola Red)
- **Primary Green:** `#00A651` (Recycling Green)
- **Background:** `#FFFFFF` (White)
- **Outline Strokes:** `#000000` (Black, 3-4px width)
- **Error/Warning:** `#FF6B6B`
- **Success:** `#51CF66`

### Visual Style Guidelines
- ✅ Hand-drawn stroke outlines (3-4px black borders)
- ✅ Flat 2D graphics with outline style
- ✅ Hand shapes for interactions (pointing, grabbing, swiping)
- ❌ No human faces or avatars
- ❌ No 3D or 2.5D elements
- ❌ No photorealistic images

### iPad Optimization
- **Resolution:** 2048 x 2732 (Portrait) / 2732 x 2048 (Landscape)
- **Touch Targets:** Minimum 44x44pt (88x88px @2x)
- **Orientation:** Both portrait and landscape supported
- **Gestures:** Tap, drag, swipe

---

## 📋 Game Flow Diagram

```
[User Login/Selection]
      ↓
[Start Screen]
      ↓
[Tutorial/Instructions]
      ↓
[Map Overview] ←─────────────────────┐
      ↓                              │
[Player taps/hovers an area]         │
      ↓                              │
[Zoom-in animation + fade]           │
      ↓                              │
[Area Scene (items scattered)]       │
      ↓                              │
[Player taps an item]                │
      ↓                              │
[Item Popup: name, image, desc]      │
      ↓                              │
[Player chooses: Recyclable / Not]   │
      ↓                              │
[Feedback Animation + Score]         │
      ↓                              │
[Close popup → continue exploring]   │
      ↓                              │
[All items found OR leave area]──────┘
      ↓
[All areas complete / Game Over]
      ↓
[Results Screen]
      ↓
[Dashboard] (View History & Stats)
```

---

## 🎯 Screen Breakdown

### 0. User Login/Selection Screen
> ⚠️ **DEFERRED** — Login is NOT implemented yet. Players are anonymous for now. This screen will be built when the Azure backend is ready.

**Purpose:** Identify player and load their profile

**Elements:**
- Title: "Welcome to Recycling Challenge"
- User selection dropdown or grid of user avatars
- "New Player" button with hand pointing icon
- "Guest Mode" option (data not saved)
- Coca-Cola logo in background

**New Player Creation:**
- Simple name input (text field with stroke outline)
- Optional: Select hand icon color/style as avatar
- "CREATE PROFILE" button
- Automatically creates user in Azure SQL Database

**Interactions:**
- Tap user to select and login
- Tap "New Player" to create account
- Tap "Guest Mode" to play without saving

**Data Flow:**
- Fetch user list from Azure SQL Database on load
- On selection: Load user stats from database
- Create new user: POST to Azure Function API
- Store userId in session for game tracking

---

### 1. Start Screen
**Purpose:** Welcome players and set the theme

**Elements:**
- Large Coca-Cola logo (outlined style)
- Game title: "Recycling Challenge"
- Hand icon pointing to "START" button (pulsing animation)
- Background: White with subtle red/green pattern
- "TAP TO START" text with hand tap icon

**Interactions:**
- Tap anywhere or tap START button to begin

---

### 2. Tutorial Screen
**Purpose:** Teach players the game mechanics

**Elements:**
- Title: "How to Play"
- Step 1: Show the map overview — "Explore different areas of the city!"
- Step 2: Show a hand tapping on a map area — "Tap an area to zoom in"
- Step 3: Show items scattered in a scene — "Find hidden trash and items!"
- Step 4: Show item popup with name/image/description — "Tap an item to inspect it"
- Step 5: Show Recyclable / Not Recyclable choice buttons — "Decide: is it recyclable?"
- Step 6: Show feedback (checkmark / X) — "Get instant feedback and learn!"
- "GOT IT!" button at bottom

**Interactions:**
- Swipe left/right to view tutorial steps
- Tap "GOT IT!" to proceed to map

---

### 3A. Map Overview Screen
**Purpose:** Central hub — player explores different areas of the city/environment

**Layout (Landscape):**
```
┌─────────────────────────────────────────────────────┐
│ ⏱️ Timer: 05:00    🎯 Score: 0/40    ❤️ Lives: ★★★ │
├─────────────────────────────────────────────────────┤
│                                                      │
│          ┌──────┐    ┌──────┐    ┌──────┐           │
│          │ Park │    │Beach │    │Street│           │
│          │  🌳  │    │  🏖️  │    │  🏙️  │           │
│          │ 0/8  │    │ 0/10 │    │ 0/8  │           │
│          └──────┘    └──────┘    └──────┘           │
│                                                      │
│          ┌──────┐    ┌──────┐    ┌──────┐           │
│          │School│    │Market│    │ Home │           │
│          │  🏫  │    │  🛒  │    │  🏠  │           │
│          │ 0/7  │    │ 0/9  │    │ 0/8  │           │
│          └──────┘    └──────┘    └──────┘           │
│                                                      │
│         [Professor character: "Pick an area!"]      │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- **Top Bar:**
  - Timer (countdown or elapsed time)
  - Total score counter (correct/total across all areas)
  - Lives indicator (3 hearts/stars — shared across all areas)

- **Map Area (center):**
  - Illustrated top-down or isometric map of a neighborhood/city
  - Multiple clickable zones/areas (e.g., Park, Beach, Street, School, Market, Home)
  - Each area shows a progress indicator (e.g., "3/8 items found")
  - Completed areas get a checkmark overlay
  - Areas glow/pulse subtly on hover to indicate interactivity

- **Professor Character:**
  - Small professor figure on the map providing hints
  - Speech bubble: "Tap an area to explore!"

**Map Areas (6 zones, ~40 total items):**

| Area | Theme | Items | Difficulty |
|------|-------|-------|------------|
| Park | Outdoor picnic waste | 8 | Easy |
| Beach | Coastal pollution | 10 | Medium |
| Street | Urban litter | 8 | Medium |
| School | Classroom/canteen waste | 7 | Easy |
| Market | Packaging & food waste | 9 | Hard |
| Home | Household recycling | 8 | Mixed |

**Interactions:**
- Tap or hover over an area → area highlights with glow effect
- Tap to enter → **zoom-in animation** with **fade transition** into the area scene
- Cannot enter a locked area (if progressive unlock is enabled)
- Tap "Back" button to return from an area to the map

**Zoom-In Transition:**
- Camera smoothly zooms toward the tapped area (~0.6s)
- Background fades/blurs as the area scene fades in
- Easing: ease-in-out with slight deceleration
- Area scene slides up or scales in from the zoomed point

---

### 3B. Area Scene Screen
**Purpose:** Exploration area where items are scattered for the player to find and inspect

**Layout (Landscape):**
```
┌─────────────────────────────────────────────────────┐
│ [← Map]   🏖️ Beach    🎯 3/10    ❤️ Lives: ★★★    │
├─────────────────────────────────────────────────────┤
│                                                      │
│   🥤          📦    🍌                               │
│        🧴                   🥡                       │
│                    🔋                                │
│  🧃        💡           🛍️        📰                │
│                                                      │
│       [Rich illustrated background scene]           │
│       [Items scattered naturally in scene]           │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- **Top Bar:**
  - Back button (← Map) to return to map overview
  - Area name and icon
  - Area progress counter (e.g., "3/10 items identified")
  - Lives indicator (shared with map)

- **Scene Area (full screen):**
  - Rich illustrated background matching the area theme (beach, park, etc.)
  - Items placed naturally within the scene (not in a grid)
  - Items have a subtle glow/sparkle to hint they are interactive
  - Some items are partially hidden (behind objects, in corners)
  - Items that have been identified get a small ✅ or ❌ badge overlay

**Interactions:**
- Tap on any item in the scene → **Item Popup** appears
- Pinch to zoom the scene (optional)
- Pan/scroll to see more of the scene if it extends beyond viewport
- Tap "← Map" to zoom back out to the map overview

---

### 3C. Item Inspection Popup
**Purpose:** Show item details and let the player decide if it's recyclable

**Layout:**
```
┌───────────────────────────────────────┐
│                                   [✕] │
│                                       │
│        ┌─────────────────┐           │
│        │                 │           │
│        │   [Close-up     │           │
│        │    Item Image]  │           │
│        │                 │           │
│        └─────────────────┘           │
│                                       │
│        Aluminum Can                   │
│                                       │
│   "A lightweight metal container      │
│    commonly used for beverages.       │
│    Made from aluminum which can       │
│    be recycled indefinitely."         │
│                                       │
│  ┌─────────────┐ ┌─────────────────┐ │
│  │ ♻️ RECYCLABLE│ │ 🚫 NOT RECYCLABLE│ │
│  │   (Green)   │ │     (Red)       │ │
│  └─────────────┘ └─────────────────┘ │
└───────────────────────────────────────┘
```

**Elements:**
- **Close button (✕):** Top-right corner — closes popup without answering
- **Item Image:** Large close-up illustration of the item (centered, ~200×200px)
- **Item Name:** Bold text below the image
- **Description:** Educational text explaining what the item is and recycling facts
- **Choice Buttons (bottom):**
  - ♻️ **RECYCLABLE** (Green button, `#3C5142` / `#74AC4B`)
  - 🚫 **NOT RECYCLABLE** (Red button, `#DF1725` / `#F40009`)

**Popup Behavior:**
- Appears as a centered modal overlay with semi-transparent dark backdrop
- Entry animation: scale from 0.8 → 1.0 + fade in (~0.3s)
- Exit animation: scale to 0.9 + fade out (~0.2s)
- Backdrop click does NOT close (must use ✕ button or choose an answer)
- After choosing, the popup shows feedback briefly then closes

**After Player Chooses:**
- **Correct:** Popup flashes green, checkmark appears over the image, "+10" floats up, popup closes after 1s
- **Incorrect:** Popup flashes red, X appears, correct answer is revealed ("This IS recyclable because..."), -1 life, popup closes after 2s
- Item in the scene gets a badge: ✅ (correct) or ❌ (incorrect)
- Item becomes non-interactive (greyed out slightly)
- Score and progress counter update

---

### 4. Feedback Animations
**Purpose:** Immediate feedback on player actions within the item popup and scene

**Correct Identification (inside popup):**
- ✅ Green checkmark overlays the item image
- Popup border flashes green
- "+10 points" floating text rises from the popup
- Professor thumbs-up appears briefly in corner
- Sound: Positive chime
- Duration: 1.0 second, then popup auto-closes
- Item in scene gets a small ✅ badge

**Incorrect Identification (inside popup):**
- ❌ Red X overlays the item image
- Popup border flashes red
- Correct answer is revealed below: "Actually, this IS/ISN'T recyclable because..."
- "-1 life" indicator pulses
- Professor encouraging gesture appears briefly
- Sound: Gentle negative tone
- Duration: 2 seconds (so player can read explanation), then popup auto-closes
- Item in scene gets a small ❌ badge

**Perfect Streak (5 in a row):**
- ⭐ Star burst animation across the scene
- "+50 bonus" text
- Professor clapping animation
- Sound: Special celebration tone

**Area Complete:**
- All items in the area identified
- Professor celebration animation
- Area score summary shown briefly
- Auto-zoom-out back to map (or manual "← Map" tap)
- Area on map gets a ✅ checkmark overlay

---

### 5. Results Screen
**Purpose:** Show game summary and encourage replay

**Elements:**
- Title: "Great Job!" or "Keep Learning!"
- Final score display (large numbers)
- Accuracy percentage
- Items sorted correctly breakdown
- Animated hand gesture based on performance (see animations below)
- Fun fact about recycling
- Three buttons:
  - "PLAY AGAIN" (green, with pointing hand)
  - "VIEW DASHBOARD" (blue, with pointing hand)
  - "LOGOUT" (gray, with pointing hand)

**Data Sync:**
- Session results automatically saved to Azure SQL Database via API
- Game session media (screenshots) saved to Azure Blob Storage
- Upload happens in background after "Great Job!" title appears

**Score Ranges & Animations:**
- 🌟🌟🌟 **Expert (90-100%):** "Recycling Champion!"
  - **Animation:** Hand saluting (6-8 frames)
  - Hand rises to forehead in salute position
  - Confetti/stars burst in background
  - Duration: 2 seconds, loops 2x
  
- 🌟🌟 **Good (70-89%):** "Great Work!"
  - **Animation:** Hand saluting (6-8 frames)
  - Hand rises to forehead in salute position
  - Stars/sparkles in background
  - Duration: 1.5 seconds, loops once
  
- 🌟 **Keep Trying (50-69%):** "Keep Learning!"
  - **Animation:** Hand saluting (6-8 frames)
  - Hand rises to forehead in salute position
  - Subtle glow effect
  - Duration: 1.5 seconds, loops once
  
- **Below 50%:** "Practice Makes Perfect!"
  - **Animation:** Encouraging fist pump (4 frames)
  - Hand makes motivational fist gesture
  - Upward motion
  - Duration: 1.2 seconds

**Entry Animations:**
- Score numbers count up from 0 (0.8 seconds)
- Stars appear one by one with pop effect
- Hand animation plays after score settles
- Fun fact slides in from bottom (0.5 second delay)

---

### 6. Dashboard Screen
**Purpose:** Display player's performance history and statistics

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  [← Back]           DASHBOARD          [Logout]     │
├─────────────────────────────────────────────────────┤
│  👤 Player: John Doe                                 │
├─────────────────────────────────────────────────────┤
│  📊 OVERALL STATS                                    │
│  ┌─────────────┬─────────────┬─────────────┐       │
│  │ Total Games │ High Score  │ Best Streak │       │
│  │     25      │    200      │     12      │       │
│  └─────────────┴─────────────┴─────────────┘       │
│                                                      │
│  ┌─────────────┬─────────────┬─────────────┐       │
│  │  Accuracy   │ Total Items │ Learning    │       │
│  │    87%      │    500      │   ★★★★☆     │       │
│  └─────────────┴─────────────┴─────────────┘       │
├─────────────────────────────────────────────────────┤
│  📈 RECENT SESSIONS (Last 10 Games)                  │
│  ┌──────────────────────────────────────────┐       │
│  │ Feb 3, 2026 - 10:30 AM | Score: 180 | 90%│       │
│  │ Feb 2, 2026 - 03:15 PM | Score: 150 | 75%│       │
│  │ Feb 2, 2026 - 02:30 PM | Score: 200 | 100%│      │
│  │ ... (scrollable list)                     │       │
│  └──────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────┤
│  🎯 LEARNING PROGRESS (By Item Category)             │
│  Plastic Bottles:  ████████░░  85% Correct (20/24)  │
│  Aluminum Cans:    ██████████  100% Correct (15/15) │
│  Food Waste:       ███████░░░  70% Correct (14/20)  │
│  ... (show all item types)                          │
├─────────────────────────────────────────────────────┤
│             [PLAY AGAIN Button]                      │
└─────────────────────────────────────────────────────┘
```

**Data Sections:**

1. **Overall Stats (Top Cards)**
   - Total games played
   - Highest score achieved
   - Longest correct streak
   - Overall accuracy percentage
   - Total items sorted
   - Learning level (1-5 stars)

2. **Recent Sessions (Scrollable List)**
   - Date and time of game
   - Final score
   - Accuracy percentage
   - Tap to view detailed session breakdown
   - Color-coded: Green (>80%), Yellow (60-80%), Red (<60%)

3. **Learning Progress (By Item Type)**
   - Progress bar for each recyclable item category
   - Attempts vs. correct ratio
   - Visual progress bars with stroke outlines
   - Weak areas highlighted in red

4. **Achievement Badges (Optional)**
   - "Perfect Game" badge (100% accuracy)
   - "Speed Demon" badge (fastest completion)
   - "Learning Champion" (10+ games played)
   - Badges displayed as hand gesture icons

**Interactions:**
- Tap "Back" to return to Start Screen
- Tap "Logout" to return to User Login
- Tap session entry to view detailed breakdown
- Scroll through recent sessions
- Tap "Play Again" to start new game

**Data Source:**
- All data fetched from Azure SQL Database via API
- Real-time statistics calculated on page load
- Session images loaded from Azure Blob Storage

---

## 🎮 Game Mechanics

### Area Difficulty
Difficulty is area-based rather than per-item:

| Difficulty | Areas | Characteristics |
|------------|-------|------------------|
| **Easy** | Park, School | Common items, obvious recyclables, more visual hints |
| **Medium** | Beach, Street | Mix of common and tricky items, some look-alikes |
| **Hard** | Market | Tricky items (greasy pizza boxes, mixed materials), fewer hints |
| **Mixed** | Home | Range of easy to hard household items |

### Item Visibility in Scenes
- **Easy areas:** Items clearly visible, slight glow/sparkle
- **Medium areas:** Some items partially hidden behind objects
- **Hard areas:** Items well-camouflaged, require careful looking

### Scoring System
- Correct identification: +10 points
- Incorrect identification: -1 life (3 lives total)
- Perfect streak (5 correct in a row): +50 bonus
- Area completion bonus: +20 points per area fully cleared
- Time bonus: +5 points per 30 seconds remaining at end

### Game Over Conditions
1. All areas explored and all items identified
2. All 3 lives lost (game ends immediately, return to results)
3. Timer runs out (if timer mode enabled)

---

## 🤚 Hand Gesture Visual Assets Needed

### Static Hand Icons
1. **Pointing Hand** - for buttons, directions, and map area hints
2. **Tapping Hand** - indicating "tap to inspect" on items
3. **Magnifying Glass Hand** - for exploration/search hint
4. **Thumbs Up** - success feedback
5. **Waving Hand** - incorrect feedback
6. **Clapping Hands** - celebration

### Animated Hand Sequences

**Gameplay Animations:**
1. **Tap Animation** - hand tapping down on item (3 frames)
2. **Search/Scan Animation** - hand sweeping across scene (5 frames)
3. **Thumbs Up Animation** - thumb rising (4 frames)
4. **Wave No Animation** - hand waving side to side (6 frames)
5. **Clap Animation** - hands clapping together (8 frames)

**Results Screen Animations:**
6. **Salute Animation** - hand rising to forehead in salute (6-8 frames)
   - Used for 90-100% scores
   - Military-style salute gesture
   - Confident, proud pose
7. **Double Thumbs Up** - both hands with thumbs up (5 frames)
   - Used for 70-89% scores
   - Bouncing motion
8. **Fist Pump Animation** - encouraging fist gesture (4 frames)
   - Used for 50-69% scores
   - Upward motivational motion
9. **Pat on Back** - gentle supportive gesture (5 frames)
   - Used for below 50% scores
   - Warm, encouraging, non-negative

All hands should be:
- Drawn in simple outline style (3-4px black stroke)
- Filled with solid color (white or skin tone outline only)
- No realistic details
- Gesture clearly recognizable
- Sized appropriately for iPad (200-400px)

---

## 📱 UI Components Needed

### Buttons
- Primary button (green) with hand pointer
- Secondary button (red) with hand pointer
- Disabled state (gray)
- All with stroke outlines

### Map Areas
- 6 area tiles in outlined drawing style
- Each tile shows theme icon + area name + progress counter
- Glow effect on hover
- Checkmark overlay when area is complete
- Locked state for progressive unlock (optional)

### Area Scene Backgrounds
- 6 full-screen illustrated backgrounds (one per area: Park, Beach, Street, School, Market, Home)
- Rich, detailed, maximalist composition matching art style
- Items positioned naturally within scene

### Item Popup
- Modal card with outlined border (4px stroke)
- Close button (✕) on top-right corner
- Image area (200×200px close-up illustration)
- Text area (item name + description)
- Two choice buttons at bottom (Recyclable / Not Recyclable)

### Items
- 40+ items in outlined drawing style
- Scene version: ~80×80px placed within area backgrounds
- Popup version: ~200×200px close-up detail
- Subtle sparkle/glow hint on undiscovered items
- Badge overlay after identification (✅ or ❌)

### Feedback Elements
- Checkmark (green)
- X mark (red)
- Star burst
- Explanation text (shown in popup on incorrect answer)
- Score counters
- Timer display
- Life indicators (hearts/stars)
- Area progress bars

---

## 🔄 Game State Flow

```javascript
// Pseudocode game states
LOGIN → START → TUTORIAL → MAP_OVERVIEW → AREA_ZOOM → AREA_EXPLORE → ITEM_POPUP → FEEDBACK → AREA_EXPLORE → ... → MAP_OVERVIEW → COMPLETE → RESULTS → DASHBOARD

States:
- LOGIN: User selection/authentication
- START: Initial screen, waiting for input
- TUTORIAL: Showing instructions (updated for map + inspect flow)
- MAP_OVERVIEW: Top-down map with clickable areas
- AREA_ZOOM: Zoom-in transition animation to selected area
- AREA_EXPLORE: Inside an area scene, items scattered around
- ITEM_POPUP: Modal popup showing item name, image, description
- ITEM_CHOICE: Player decides recyclable / not recyclable
- FEEDBACK: Showing correct/incorrect animation inside popup
- AREA_COMPLETE: All items in area found, summary shown
- COMPLETE: All areas explored or game over
- RESULTS: Final screen with score
- DASHBOARD: View stats and history
```

**Session Management:**
```javascript
// Client-side state
const gameState = {
  userId: null,
  sessionId: null,
  sessionToken: null,
  isOnline: true,
  pendingSyncItems: [],
  currentArea: null,         // which map area is active
  areaProgress: {},          // { park: { total: 8, found: 3 }, beach: { total: 10, found: 7 }, ... }
  inspectedItem: null,       // currently open item popup
  completedAreas: [],        // areas fully explored
  currentStreak: 0
};
```

---

## 💾 Azure Backend Architecture

### System Overview

```
[iPad Game Client] 
       ↓ HTTPS
[Azure Functions API] ← Authentication
       ↓
[Azure SQL Database] ← User Data & Sessions
       ↓
[Azure Blob Storage] ← Session Screenshots & Assets
```

---

### Azure SQL Database Schema

#### Table: Users
```sql
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL UNIQUE,
    DisplayName NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    LastLoginAt DATETIME2,
    TotalGamesPlayed INT DEFAULT 0,
    HighScore INT DEFAULT 0,
    BestAccuracy DECIMAL(5,2) DEFAULT 0,
    LongestStreak INT DEFAULT 0,
    TotalItemsSorted INT DEFAULT 0,
    CorrectlySorted INT DEFAULT 0,
    PreferredLanguage NVARCHAR(10) DEFAULT 'en',
    SoundEnabled BIT DEFAULT 1,
    TutorialCompleted BIT DEFAULT 0
);
```

#### Table: GameSessions
```sql
CREATE TABLE GameSessions (
    SessionId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    SessionGuid UNIQUEIDENTIFIER DEFAULT NEWID(),
    GameType NVARCHAR(20) NOT NULL, -- 'explore', 'scanner', 'lab'
    StartTime DATETIME2 NOT NULL,
    EndTime DATETIME2,
    FinalScore INT DEFAULT 0,
    ItemsSorted INT DEFAULT 0,
    CorrectItems INT DEFAULT 0,
    IncorrectItems INT DEFAULT 0,
    Accuracy DECIMAL(5,2) DEFAULT 0,
    LivesRemaining INT DEFAULT 3,
    LongestStreak INT DEFAULT 0,
    CompletionStatus NVARCHAR(20), -- 'completed', 'abandoned', 'failed', 'timeout'
    DifficultyLevel NVARCHAR(20), -- 'easy', 'medium', 'hard'
    TimeTaken INT, -- seconds
    TimeRemaining INT, -- seconds remaining (scanner game)
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IDX_UserSessions ON GameSessions(UserId, StartTime DESC);
```

#### Table: SessionItems
```sql
CREATE TABLE SessionItems (
    ItemId INT PRIMARY KEY IDENTITY(1,1),
    SessionId INT FOREIGN KEY REFERENCES GameSessions(SessionId),
    ItemType NVARCHAR(100) NOT NULL, -- 'plastic-bottle', 'aluminum-can', etc.
    IsRecyclable BIT NULL, -- Game 1 only
    PlayerChoice NVARCHAR(20), -- Game 1: 'green'/'red'; Game 2+3: 'PET','HDPE','PVC','LDPE','PP','PS'
    CorrectAnswer NVARCHAR(20), -- The correct type/choice for this item
    IsCorrect BIT NOT NULL,
    TimeToDecide DECIMAL(5,2), -- seconds
    DialReadings NVARCHAR(200) NULL, -- JSON: Game 2 dial values e.g. {"meltingPoint":75,"density":50,...}
    TestsPerformed NVARCHAR(200) NULL, -- JSON: Game 3 test IDs e.g. ["waterFloat","flexibility","heat"]
    Timestamp DATETIME2 DEFAULT GETDATE(),
    SequenceOrder INT
);

CREATE INDEX IDX_SessionItems ON SessionItems(SessionId, SequenceOrder);
```

#### Table: ItemKnowledge
```sql
CREATE TABLE ItemKnowledge (
    KnowledgeId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    ItemType NVARCHAR(100) NOT NULL,
    TotalAttempts INT DEFAULT 0,
    CorrectAttempts INT DEFAULT 0,
    Accuracy DECIMAL(5,2) DEFAULT 0,
    LastAttempt DATETIME2,
    UNIQUE(UserId, ItemType)
);
```

---

### Azure Blob Storage Structure

```
container: game-session-data/
├── screenshots/
│   ├── user-123/
│   │   ├── session-456-result.png
│   │   ├── session-457-result.png
│   └── user-124/
│       └── session-458-result.png
├── assets/
│   ├── items/
│   │   ├── plastic-bottle.svg
│   │   ├── aluminum-can.svg
│   └── hands/
│       ├── pointing.svg
│       ├── grabbing.svg
└── exports/
    └── user-123-backup-2026-02-03.json
```

**Blob Naming Convention:**
- Screenshots: `user-{userId}/session-{sessionId}-result.png`
- Session exports: `user-{userId}-backup-{date}.json`
- Static assets: `assets/{category}/{filename}`

**Access Control:**
- Screenshots: Private, user-specific SAS tokens
- Assets: Public read access
- Exports: Private, temporary SAS tokens (24h expiry)

---

### Azure Functions API Endpoints

#### Authentication Endpoints
```javascript
// POST /api/users/create
// Create new user profile
Request: { username: string, displayName: string }
Response: { userId: number, username: string, createdAt: string }

// GET /api/users/list
// Get all users for login selection
Response: [{ userId: number, displayName: string, lastLoginAt: string }]

// POST /api/users/login
// Log in existing user
Request: { userId: number }
Response: { userId: number, username: string, sessionToken: string }
```

#### Game Session Endpoints
```javascript
// POST /api/sessions/start
// Create new game session
Request: { userId: number, startTime: string, difficultyLevel: string }
Response: { sessionId: number, sessionGuid: string }

// POST /api/sessions/save-item
// Save individual item result during gameplay
Request: {
  sessionId: number,
  itemType: string,
  isCorrect: boolean,
  timeToDecide: number,
  sequenceOrder: number
}
Response: { success: boolean }

// POST /api/sessions/complete
// Finalize game session
Request: {
  sessionId: number,
  endTime: string,
  finalScore: number,
  accuracy: number,
  completionStatus: string
}
Response: { success: boolean, sessionSummary: object }

// POST /api/sessions/upload-screenshot
// Upload result screen screenshot to Blob
Request: FormData with image file
Response: { blobUrl: string, sasToken: string }
```

#### Dashboard Endpoints
```javascript
// GET /api/users/{userId}/stats
// Get overall user statistics
Response: {
  totalGamesPlayed: number,
  highScore: number,
  bestAccuracy: number,
  longestStreak: number,
  totalItemsSorted: number,
  correctlySorted: number
}

// GET /api/users/{userId}/sessions?limit=10
// Get recent game sessions
Response: [{
  sessionId: number,
  startTime: string,
  finalScore: number,
  accuracy: number,
  completionStatus: string
}]

// GET /api/users/{userId}/learning-progress
// Get item-by-item learning progress
Response: [{
  itemType: string,
  totalAttempts: number,
  correctAttempts: number,
  accuracy: number
}]

// GET /api/sessions/{sessionId}/details
// Get detailed breakdown of a specific session
Response: {
  session: object,
  items: [{ itemType: string, isCorrect: boolean, timeToDecide: number }],
  screenshotUrl: string
}
```

#### Export Endpoints
```javascript
// GET /api/users/{userId}/export
// Export all user data as JSON
Response: Blob download with complete user data

// POST /api/users/{userId}/import
// Import backup data
Request: JSON backup file
Response: { success: boolean, recordsImported: number }
```

---

### Data Flow During Gameplay

**1. User Login:**
```
Client → GET /api/users/list → Display user selection
Client → POST /api/users/login → Receive session token
```

**2. Game Start:**
```
Client → POST /api/sessions/start → Receive sessionId
Store sessionId in client memory
```

**3. During Gameplay (Every Item Sorted):**
```
Client → POST /api/sessions/save-item → Save to SessionItems table
Local cache updated (for offline resilience)
```

**4. Game Complete:**
```
Client → POST /api/sessions/complete → Update GameSessions table
Client → POST /api/sessions/upload-screenshot → Save to Blob Storage
Client → Navigate to Results Screen
```

**5. View Dashboard:**
```
Client → GET /api/users/{userId}/stats → Display overall stats
Client → GET /api/users/{userId}/sessions → Display recent games
Client → GET /api/users/{userId}/learning-progress → Display item progress
```

---

### Offline & Error Handling

**Local Caching Strategy:**
- Use IndexedDB for offline gameplay
- Queue API requests when offline
- Sync queued data when connection restored
- Show "Offline Mode" indicator

**Error Recovery:**
- Retry failed API calls (3 attempts with exponential backoff)
- If session save fails, cache locally and retry later
- Provide "Sync Now" button in dashboard
- Display sync status: ✅ Synced, ⏳ Syncing, ⚠️ Pending

**Data Consistency:**
- Session data saved incrementally (not just at end)
- If client crashes, partial session still recorded
- Abandoned sessions marked and can be resumed

---

### Security & Privacy

**Authentication:**
- Simple username-based login (no password for educational game)
- Session tokens with 24h expiry
- HTTPS only for all API calls
- CORS restricted to game domain

**Data Protection:**
- No personal identifiable information collected
- Only game statistics and usernames stored
- Azure SQL with encryption at rest
- Blob Storage with private containers
- SAS tokens for temporary access (1h expiry)

**Compliance:**
- GDPR: Right to export and delete data
- Provide "Delete My Data" option in settings
- Data retention: 1 year (configurable)

---

### Performance Optimization

**Caching:**
- Cache user stats in client for 5 minutes
- Cache recent sessions for 10 minutes
- CDN for static assets (Azure CDN)

**Database:**
- Indexed queries on UserId and SessionId
- Aggregate stats computed on write (not read)
- Connection pooling in Azure Functions

**Blob Storage:**
- Use Azure CDN for asset delivery
- Compress screenshots before upload
- Lazy load dashboard images

**Estimated Costs (Azure):**
- SQL Database: Basic tier ~$5/month (sufficient for <10k users)
- Blob Storage: ~$0.02/GB/month
- Azure Functions: Consumption plan ~$0.20 per 1M requests
- Total: ~$10-20/month for small deployment

---

## 🎯 Success Metrics

### Educational Goals
- Player can identify 10+ common recyclable items
- Player understands difference between recyclable/non-recyclable
- Player learns 1-2 recycling facts per session

### Engagement Goals
- Average session time: 3-5 minutes
- Replay rate: 40%+
- Completion rate: 80%+

### Technical Requirements
- Load time: < 3 seconds
- Smooth 60fps animations
- Touch response: < 100ms
- Works offline

---

## 📝 Next Steps for Implementation

### Phase 1: Frontend Development
1. ✅ Create asset list and specifications
2. ✅ Design hand gesture illustrations
3. ⬜ Develop item database with metadata
4. ⬜ Implement drag-and-drop mechanics
5. ⬜ Create animation sequences
6. ⬜ Build feedback system
7. ⬜ Add sound effects
8. ⬜ Create User Login screen
9. ⬜ Build Dashboard screen with charts

### Phase 2: Azure Backend Setup
1. ⬜ Create Azure SQL Database
2. ⬜ Run database schema SQL scripts
3. ⬜ Create Azure Blob Storage container
4. ⬜ Set up Azure Functions project
5. ⬜ Implement API endpoints (authentication, sessions, dashboard)
6. ⬜ Configure CORS and security
7. ⬜ Set up SAS token generation
8. ⬜ Deploy Azure Functions

### Phase 3: Integration & Testing
1. ⬜ Connect frontend to Azure API
2. ⬜ Implement offline mode with IndexedDB
3. ⬜ Test multi-user scenarios
4. ⬜ Test data sync and error handling
5. ⬜ Test on multiple iPad models
6. ⬜ Load testing with Azure Load Testing
7. ⬜ Security audit and penetration testing

### Phase 4: Polish & Launch
1. ⬜ Localization (EN, ZH-HK based on your messages folder)
2. ⬜ Performance optimization
3. ⬜ Dashboard analytics and charts
4. ⬜ Export/import data features
5. ⬜ User acceptance testing
6. ⬜ Production deployment

---

*Last Updated: February 3, 2026*

---

## 🎮 Game 2: Plastic Scanner — "Match the Ingredients"

### Overview
A **timed** industrial-themed conveyor belt game (2-minute time limit) where players learn to read plastic properties using a scanner with 4 dials: melting point, density, softening point, and chlorine detection. Items arrive **randomly shuffled** on a conveyor, the player adjusts dials and identifies which of the **6 plastic types** the item belongs to.

### Route: `/game/scanner`

### Plastic Reference Data (from real-world values)

| Plastic | Code | Softening Pt | Melting Pt | Key Features |
|---------|------|-------------|------------|--------------|
| **PET** (Polyethylene Terephthalate) | ♻️ 1 | 70°C | 260°C | Commonly found in bottled beverages. Typically has a small circular dot at the bottom. |
| **HDPE** (High-Density Polyethylene) | ♻️ 2 | 110°C | 142°C | The only plastic with high-strength resistance to chemical corrosion. Used for cleaning products & shampoo packaging. Usually has a horizontal line at the bottom. |
| **PVC** (Polyvinyl Chloride) | ♻️ 3 | 80°C | 260°C | Found in water pipes, fire-resistant materials, and credit cards. Clear PVC may appear faintly blue or green when viewed under light. |
| **LDPE** (Low-Density Polyethylene) | ♻️ 4 | 70°C | 110°C | Has the best flexibility and stretchability among all plastics. Commonly found in plastic bags and soft caps. |
| **PP** (Polypropylene) | ♻️ 5 | 155°C | 164°C | Has the best heat resistance and impact resistance among all plastics. Widely used in food containers, stationery, electrical appliances. |
| **PS** (Polystyrene) | ♻️ 6 | 80°C | 166°C | Not resistant to alcohol and oil, has high hardness and low cost, but is the most brittle plastic. Found in disposable tableware and foam bowl lids. |

### Flow Diagram

```
[Game Selection Hub (/games)]
        ↓
[Scanner Tutorial Overlay (shows 6 plastic types + 2-min timer)]
        ↓
[Conveyor Belt + Scanner View — ⏱️ TIMER COUNTING DOWN]
        ↓
[Items arrive RANDOMLY SHUFFLED in scanner frame]
        ↓
[Scan animation plays]
        ↓
[Hint bar shows: float/sink, melt peak, bend cue, chlorine alert]
        ↓
[Player adjusts 4 dials (melting pt, density, softening pt, chlorine)]
        ↓
[Player identifies: PET / HDPE / PVC / LDPE / PP / PS (6 buttons)]
        ↓
[Feedback: Correct ✅ or Incorrect ❌ + fun fact]
        ↓
[Next item — game over if lives = 0 OR time runs out]
        ↓
[Results Screen: score, accuracy, streak, item breakdown]
```

### Screen Breakdown

#### Scanner Game Screen
**Purpose:** Identify plastics by reading property hints, adjusting dials, and choosing the correct type — under time pressure

**Elements:**
- Status bar: **⏱️ countdown timer (2:00)**, score, lives, item counter
- Conveyor belt with scanner frame holding current item
- Scan line animation (red laser)
- Recycling code badge (♻️ number + type)
- Hint bar with float/sink, melt peak, bend cue, chlorine indicators
- 4 dial controls (each 0–100 with ◀/▶ buttons):
  - 🌡️ Melting Point (熔點)
  - ⚖️ Density (密度)
  - 🔥 Softening Point (軟化點)
  - ☣️ Chlorine (氯氣)
- **6 plastic type buttons** in a 3×2 grid: PET, HDPE, PVC, LDPE, PP, PS (each color-coded)

**Time Limit:**
- 2 minutes (120 seconds) countdown
- Timer turns **red and pulses** when under 30 seconds
- Game ends automatically when timer hits 0:00

**Scoring:**
- Base: 15 points per correct identification
- Streak bonus: +5 per consecutive correct (3+ streak)
- Dial accuracy bonus: up to +10 if dial readings are within ±15 of actual values
- Wrong identification: lose 1 life (max 3 lives)

**Data:** 13 plastic items (PET×3, HDPE×2, PVC×2, LDPE×2, PP×2, PS×2) with real property values, randomly shuffled each game

---

## 🧪 Game 3: Home Lab — "Cooking Mama" Style

### Overview
A step-by-step laboratory game where players perform simple home tests (water float, flexibility, scratch, light, heat) on mystery plastic samples. Uses Cooking-Mama-style mini-interactions (tap, swipe, hold) for each test step. After running tests, the player reviews observations and identifies the plastic type.

### Route: `/game/lab`

### Flow Diagram

```
[Game Selection Hub (/games)]
        ↓
[Lab Tutorial Overlay]
        ↓
[Sample presented (mystery plastic)]
        ↓
[3 random tests selected from pool of 5]
        ↓
[Test 1: Step-by-step mini-actions]
   → Step 1: Prepare (tap/hold)
   → Step 2: Perform (swipe-down/swipe-right)
   → Step 3: Observe (tap → see result text)
        ↓
[Test 2: Same pattern]
        ↓
[Test 3: Same pattern]
        ↓
[Observations notebook filled in]
        ↓
[Identify screen: review notes + choose plastic type]
        ↓
[Feedback: Correct ✅ / Incorrect ❌ + key clues]
        ↓
[Next sample or results if lives = 0]
        ↓
[Results Screen: score, accuracy, sample breakdown]
```

### Screen Breakdown

#### Lab Game Screen
**Purpose:** Perform home tests and identify mystery plastics

**Elements:**
- Status bar: score, lives, sample counter
- Sample card (icon + mystery name)
- Test progress dots (3 test icons, active/completed states)
- Test card with:
  - Test name + icon + description
  - Step progress pips (1→2→3)
  - Current step instruction
  - Interactive zone (Cooking Mama controls):
    - **Tap** → circular green button
    - **Hold** → SVG ring progress indicator
    - **Swipe** → dashed area with arrow animation
  - Observation result bubble (appears after observe steps)
- Observations notebook (yellow, collects results after each test)
- Identify screen: review all notes, choose from 6 plastic types (PET, HDPE, PVC, PP, PS, LDPE)
- Feedback card with correct answer + key clues list

**Scoring:**
- 20 points per correct identification
- Wrong guess: lose 1 life (max 3 lives)

**Data:**
- 5 test procedures: Water Float, Flexibility, Scratch, Light, Heat Response
- 6 plastic samples: PET clear, HDPE white, PVC rigid, PP flex, PS brittle, LDPE soft
- Each sample has real-world observable outcomes per test

### Available Tests

| Test | Icon | Action | What it tests |
|------|------|--------|---------------|
| Water Float | 🫧 | Hold to fill → Swipe down → Tap to observe | Density (float vs sink) |
| Flexibility | 🔄 | Tap to grab → Swipe right to bend → Tap to check | Rigidity vs flexibility |
| Scratch | 💅 | Tap to position → Swipe right → Tap to check | Surface hardness |
| Light | 💡 | Tap to pick up → Hold to light → Tap to note | Transparency/translucency |
| Heat | 🔥 | Hold to heat water → Swipe to dip → Tap to observe | Thermal response |

---

## 🗺️ Game Selection Hub

### Route: `/games`

### Elements:
- Title: "Choose Your Challenge"
- 3 game cards in a scrollable layout:
  1. **Explore & Sort** — Map exploration, classify items into recyclable/not recyclable
  2. **Plastic Scanner** — Industrial conveyor belt scanner with 4 dials
  3. **Home Lab** — Cooking Mama style lab tests
- Each card shows: icon, title, description, difficulty stars (1–3), duration estimate
- Cards animate in with slide-up stagger effect
- Back button returns to start screen (`/`)
