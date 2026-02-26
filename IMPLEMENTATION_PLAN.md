# Coca-Cola Recycling Game - Implementation Plan

**Project:** Multi-User Recycling Education Game with Azure Backend  
**Target Platform:** iPad (Portrait & Landscape)  
**Tech Stack:** SvelteKit + Azure SQL + Blob Storage + Azure Functions  
**Timeline:** 8-10 weeks  
**Last Updated:** February 3, 2026

---

## 📊 Project Stages Overview

```
Stage 1: Project Setup & Infrastructure (Week 1-2)
    ↓
Stage 2: Azure Backend Development (Week 2-3)
    ↓
Stage 3: Frontend Core Gameplay (Week 3-5)
    ↓
Stage 4: User System & Dashboard (Week 5-6)
    ↓
Stage 5: Integration & Testing (Week 7-8)
    ↓
Stage 6: Polish & Deployment (Week 8-10)
```

---

## 🎯 Stage 1: Project Setup & Infrastructure
**Duration:** 1-2 weeks  
**Goal:** Set up development environment and Azure resources

### 1.1 Development Environment Setup

**Tasks:**
- [ ] Install required dependencies
  - Node.js 18+ and pnpm
  - Azure CLI
  - Azure Functions Core Tools
  - SQL Server Management Studio (SSMS) or Azure Data Studio
- [ ] Initialize SvelteKit project (✅ Already done)
- [ ] Configure TypeScript settings
- [ ] Set up ESLint and Prettier
- [ ] Configure environment variables (.env files)

**Files to Create:**
```
.env.local
.env.production
.gitignore (update with Azure secrets)
```

**Environment Variables:**
```bash
# .env.local
AZURE_SQL_CONNECTION_STRING=
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_CONTAINER_NAME=game-session-data
AZURE_FUNCTIONS_URL=http://localhost:7071/api
PUBLIC_API_URL=http://localhost:7071/api
```

---

### 1.2 Azure Resource Provisioning

**Tasks:**
- [ ] Create Azure Resource Group
  ```bash
  az group create --name rg-cocacola-game --location eastus
  ```

- [ ] Create Azure SQL Database
  ```bash
  az sql server create --name sql-cocacola-game --resource-group rg-cocacola-game --admin-user gameadmin --admin-password [SecurePassword]
  az sql db create --resource-group rg-cocacola-game --server sql-cocacola-game --name db-recycling-game --service-objective Basic
  ```

- [ ] Configure firewall rules for SQL
  ```bash
  az sql server firewall-rule create --resource-group rg-cocacola-game --server sql-cocacola-game --name AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
  ```

- [ ] Create Azure Storage Account
  ```bash
  az storage account create --name stcocacolagame --resource-group rg-cocacola-game --location eastus --sku Standard_LRS
  ```

- [ ] Create Blob Storage Container
  ```bash
  az storage container create --name game-session-data --account-name stcocacolagame --public-access off
  ```

- [ ] Create Azure Function App
  ```bash
  az functionapp create --resource-group rg-cocacola-game --consumption-plan-location eastus --runtime node --runtime-version 18 --functions-version 4 --name func-cocacola-game --storage-account stcocacolagame
  ```

**Deliverables:**
- ✅ Azure resources provisioned
- ✅ Connection strings documented
- ✅ Access keys secured in Azure Key Vault (optional but recommended)

---

### 1.3 Database Schema Setup

**Tasks:**
- [ ] Connect to Azure SQL Database via SSMS/Azure Data Studio
- [ ] Run schema creation scripts
- [ ] Create indexes for performance
- [ ] Insert sample test data
- [ ] Test database connectivity from local machine

**SQL Scripts to Execute:**

**File:** `database/01-create-tables.sql`
```sql
-- Users Table
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

-- GameSessions Table
CREATE TABLE GameSessions (
    SessionId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    SessionGuid UNIQUEIDENTIFIER DEFAULT NEWID(),
    StartTime DATETIME2 NOT NULL,
    EndTime DATETIME2,
    FinalScore INT DEFAULT 0,
    ItemsSorted INT DEFAULT 0,
    CorrectItems INT DEFAULT 0,
    IncorrectItems INT DEFAULT 0,
    Accuracy DECIMAL(5,2) DEFAULT 0,
    LivesRemaining INT DEFAULT 3,
    LongestStreak INT DEFAULT 0,
    CompletionStatus NVARCHAR(20),
    DifficultyLevel NVARCHAR(20),
    TimeTaken INT,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- SessionItems Table
CREATE TABLE SessionItems (
    ItemId INT PRIMARY KEY IDENTITY(1,1),
    SessionId INT FOREIGN KEY REFERENCES GameSessions(SessionId),
    ItemType NVARCHAR(100) NOT NULL,
    IsRecyclable BIT NOT NULL,
    PlayerChoice NVARCHAR(20),
    IsCorrect BIT NOT NULL,
    TimeToDecide DECIMAL(5,2),
    Timestamp DATETIME2 DEFAULT GETDATE(),
    SequenceOrder INT
);

-- ItemKnowledge Table
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

**File:** `database/02-create-indexes.sql`
```sql
CREATE INDEX IDX_UserSessions ON GameSessions(UserId, StartTime DESC);
CREATE INDEX IDX_SessionItems ON SessionItems(SessionId, SequenceOrder);
CREATE INDEX IDX_ItemKnowledge ON ItemKnowledge(UserId, ItemType);
```

**File:** `database/03-seed-data.sql`
```sql
-- Insert test users
INSERT INTO Users (Username, DisplayName) VALUES 
('testuser1', 'Test Player 1'),
('testuser2', 'Test Player 2'),
('admin', 'Admin User');
```

**Deliverables:**
- ✅ Database schema deployed
- ✅ Test data inserted
- ✅ Connection verified

---

## 🔧 Stage 2: Azure Backend Development
**Duration:** 1-2 weeks  
**Goal:** Build REST API with Azure Functions

### 2.1 Azure Functions Project Setup

**Tasks:**
- [ ] Initialize Azure Functions project
  ```bash
  cd api
  func init --typescript
  ```
- [ ] Install dependencies
  ```bash
  npm install mssql @azure/storage-blob dotenv
  npm install -D @types/node
  ```
- [ ] Configure `local.settings.json`
- [ ] Set up database connection helper
- [ ] Set up Blob Storage client

**File Structure:**
```
api/
├── src/
│   ├── functions/
│   │   ├── users/
│   │   │   ├── createUser.ts
│   │   │   ├── listUsers.ts
│   │   │   └── loginUser.ts
│   │   ├── sessions/
│   │   │   ├── startSession.ts
│   │   │   ├── saveItem.ts
│   │   │   ├── completeSession.ts
│   │   │   └── uploadScreenshot.ts
│   │   └── dashboard/
│   │       ├── getUserStats.ts
│   │       ├── getRecentSessions.ts
│   │       └── getLearningProgress.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── blobStorage.ts
│   │   └── validation.ts
│   └── types/
│       └── index.ts
├── host.json
├── local.settings.json
├── package.json
└── tsconfig.json
```

---

### 2.2 Implement User Management APIs

**Tasks:**
- [ ] Create `createUser` function (POST /api/users/create)
- [ ] Create `listUsers` function (GET /api/users/list)
- [ ] Create `loginUser` function (POST /api/users/login)
- [ ] Implement input validation
- [ ] Add error handling
- [ ] Write unit tests

**Example Function:** `api/src/functions/users/createUser.ts`
```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import sql from 'mssql';
import { getDatabaseConnection } from '../../utils/database';

interface CreateUserRequest {
    username: string;
    displayName: string;
}

export async function createUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const body: CreateUserRequest = await request.json() as CreateUserRequest;
        
        if (!body.username || !body.displayName) {
            return { status: 400, body: 'Username and displayName are required' };
        }

        const pool = await getDatabaseConnection();
        const result = await pool.request()
            .input('username', sql.NVarChar, body.username)
            .input('displayName', sql.NVarChar, body.displayName)
            .query(`
                INSERT INTO Users (Username, DisplayName, CreatedAt)
                VALUES (@username, @displayName, GETDATE());
                SELECT SCOPE_IDENTITY() AS UserId;
            `);

        const userId = result.recordset[0].UserId;

        return {
            status: 201,
            jsonBody: {
                userId,
                username: body.username,
                displayName: body.displayName,
                createdAt: new Date().toISOString()
            }
        };
    } catch (error) {
        context.error('Error creating user:', error);
        return { status: 500, body: 'Internal server error' };
    }
}

app.http('createUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'users/create',
    handler: createUser
});
```

**Deliverables:**
- ✅ 3 user management endpoints working
- ✅ Local testing with Postman/Thunder Client

---

### 2.3 Implement Game Session APIs

**Tasks:**
- [ ] Create `startSession` function (POST /api/sessions/start)
- [ ] Create `saveItem` function (POST /api/sessions/save-item)
- [ ] Create `completeSession` function (POST /api/sessions/complete)
- [ ] Implement session validation
- [ ] Add transaction support for data consistency
- [ ] Write integration tests

**Key Logic:**
- Generate unique `SessionGuid` on session start
- Save items incrementally during gameplay
- Update user statistics on session completion
- Handle ItemKnowledge updates (upsert logic)

**Deliverables:**
- ✅ 3 session management endpoints working
- ✅ End-to-end session flow tested

---

### 2.4 Implement Dashboard APIs

**Tasks:**
- [ ] Create `getUserStats` function (GET /api/users/{userId}/stats)
- [ ] Create `getRecentSessions` function (GET /api/users/{userId}/sessions)
- [ ] Create `getLearningProgress` function (GET /api/users/{userId}/learning-progress)
- [ ] Implement efficient SQL queries with JOINs
- [ ] Add pagination for sessions list
- [ ] Cache frequently accessed data

**Deliverables:**
- ✅ 3 dashboard endpoints working
- ✅ Response times < 500ms

---

### 2.5 Implement Blob Storage Integration

**Tasks:**
- [ ] Create `uploadScreenshot` function (POST /api/sessions/upload-screenshot)
- [ ] Implement SAS token generation
- [ ] Add image validation (file type, size)
- [ ] Configure CORS for Blob Storage
- [ ] Test upload from browser

**Example:** `api/src/utils/blobStorage.ts`
```typescript
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';

export async function uploadSessionScreenshot(userId: number, sessionId: number, fileBuffer: Buffer, fileName: string): Promise<string> {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
    
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    );

    const containerClient = blobServiceClient.getContainerClient('game-session-data');
    const blobName = `screenshots/user-${userId}/session-${sessionId}-result.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: 'image/png' }
    });

    return blockBlobClient.url;
}
```

**Deliverables:**
- ✅ Screenshot upload working
- ✅ SAS tokens generated correctly

---

### 2.6 Deploy Azure Functions

**Tasks:**
- [ ] Test all endpoints locally
- [ ] Configure CORS settings
- [ ] Deploy to Azure
  ```bash
  func azure functionapp publish func-cocacola-game
  ```
- [ ] Configure application settings in Azure Portal
- [ ] Test deployed endpoints
- [ ] Set up Application Insights for monitoring

**Deliverables:**
- ✅ All APIs deployed and accessible
- ✅ Monitoring enabled

---

## 🎨 Stage 3: Frontend Core Gameplay
**Duration:** 2-3 weeks  
**Goal:** Build core game mechanics and UI

### 3.1 Asset Preparation

**Tasks:**
- [ ] Design hand gesture SVGs (8 gestures)
  - Pointing, tapping, magnifying, thumbs up, waving, clapping, salute, fist pump
- [ ] Design recyclable item SVGs (20+ items) — two sizes per item:
  - Scene thumbnail (~80×80px) for placement in area backgrounds
  - Close-up detail (~200×200px) for item inspection popup
- [ ] Design non-recyclable item SVGs (20+ items) — same two-size approach
- [ ] Design 6 area background illustrations (Park, Beach, Street, School, Market, Home)
- [ ] Design map overview illustration with 6 clickable area tiles
- [ ] Design item inspection popup card (outlined modal with close button)
- [ ] Create UI components (buttons, cards, badges, progress indicators)
- [ ] Export all assets to `src/lib/assets/`

**Asset Organization:**
```
src/lib/assets/
├── hands/
│   ├── pointing.svg
│   ├── tapping.svg
│   ├── magnifying.svg
│   ├── thumbs-up.svg
│   ├── wave-no.svg
│   ├── clapping.svg
│   ├── salute.svg
│   └── fist-pump.svg
├── items/
│   ├── scene/           (small thumbnails for area scenes)
│   │   ├── plastic-bottle.svg
│   │   ├── aluminum-can.svg
│   │   └── ... (40+ items)
│   └── detail/          (close-up for popup inspection)
│       ├── plastic-bottle.svg
│       ├── aluminum-can.svg
│       └── ... (40+ items)
├── areas/
│   ├── map-overview.svg         (or .png)
│   ├── area-park.png
│   ├── area-beach.png
│   ├── area-street.png
│   ├── area-school.png
│   ├── area-market.png
│   └── area-home.png
└── ui/
    ├── checkmark.svg
    ├── x-mark.svg
    ├── star.svg
    ├── close-button.svg
    ├── popup-card.svg
    └── area-tile.svg
```

**Deliverables:**
- ✅ All SVG/PNG assets created with stroke outlines
- ✅ Two sizes per item (scene + detail)
- ✅ 6 area backgrounds + map overview

---

### 3.2 Game Data Model

**Tasks:**
- [ ] Create item database JSON
- [ ] Define game state TypeScript interfaces
- [ ] Create Svelte stores for state management

**File:** `src/lib/data/items.json`
```json
[
  {
    "id": "plastic-bottle",
    "name": "Plastic Bottle",
    "isRecyclable": true,
    "area": "beach",
    "difficulty": "easy",
    "sceneImage": "/assets/items/scene/plastic-bottle.svg",
    "detailImage": "/assets/items/detail/plastic-bottle.svg",
    "description": "PET #1 plastic bottles are recyclable. Rinse and crush before recycling.",
    "position": { "x": 35, "y": 60 }
  },
  {
    "id": "food-waste",
    "name": "Food Waste",
    "isRecyclable": false,
    "area": "school",
    "difficulty": "easy",
    "sceneImage": "/assets/items/scene/food-waste.svg",
    "detailImage": "/assets/items/detail/food-waste.svg",
    "description": "Food waste belongs in compost, not recycling. It contaminates other recyclables.",
    "position": { "x": 70, "y": 45 }
  }
]
```

**File:** `src/lib/data/areas.json`
```json
[
  {
    "id": "park",
    "name": "Park",
    "icon": "🌳",
    "difficulty": "easy",
    "background": "/assets/areas/area-park.png",
    "itemCount": 8,
    "mapPosition": { "x": 15, "y": 20 }
  },
  {
    "id": "beach",
    "name": "Beach",
    "icon": "🏖️",
    "difficulty": "medium",
    "background": "/assets/areas/area-beach.png",
    "itemCount": 10,
    "mapPosition": { "x": 50, "y": 20 }
  },
  {
    "id": "street",
    "name": "Street",
    "icon": "🏙️",
    "difficulty": "medium",
    "background": "/assets/areas/area-street.png",
    "itemCount": 8,
    "mapPosition": { "x": 85, "y": 20 }
  },
  {
    "id": "school",
    "name": "School",
    "icon": "🏫",
    "difficulty": "easy",
    "background": "/assets/areas/area-school.png",
    "itemCount": 7,
    "mapPosition": { "x": 15, "y": 65 }
  },
  {
    "id": "market",
    "name": "Market",
    "icon": "🛒",
    "difficulty": "hard",
    "background": "/assets/areas/area-market.png",
    "itemCount": 9,
    "mapPosition": { "x": 50, "y": 65 }
  },
  {
    "id": "home",
    "name": "Home",
    "icon": "🏠",
    "difficulty": "mixed",
    "background": "/assets/areas/area-home.png",
    "itemCount": 8,
    "mapPosition": { "x": 85, "y": 65 }
  }
]
```

**File:** `src/lib/stores/gameStore.ts`
```typescript
import { writable } from 'svelte/store';

export interface AreaProgress {
    total: number;
    found: number;
    correct: number;
}

export interface GameState {
    userId: number | null;
    sessionId: number | null;
    score: number;
    lives: number;
    currentStreak: number;
    totalItemsIdentified: number;
    currentArea: string | null;       // 'park', 'beach', etc.
    areaProgress: Record<string, AreaProgress>;
    completedAreas: string[];
    inspectedItem: string | null;     // item id currently in popup
    identifiedItems: Record<string, 'correct' | 'incorrect'>;
    isPlaying: boolean;
    gamePhase: 'map' | 'area' | 'popup' | 'results';
}

export const gameStore = writable<GameState>({
    userId: null,
    sessionId: null,
    score: 0,
    lives: 3,
    currentStreak: 0,
    totalItemsIdentified: 0,
    currentArea: null,
    areaProgress: {},
    completedAreas: [],
    inspectedItem: null,
    identifiedItems: {},
    isPlaying: false,
    gamePhase: 'map'
});
```

**Deliverables:**
- ✅ Item database with 40+ items
- ✅ Game state management working

---

### 3.3 Build Start & Tutorial Screens

**Tasks:**
- [ ] Create `src/routes/+page.svelte` (Start Screen)
- [ ] Create `src/routes/tutorial/+page.svelte` (Tutorial)
- [ ] Implement navigation between screens
- [ ] Add animations (hand pointing, pulsing button)
- [ ] Style with Coca-Cola color scheme

**Start Screen Layout:**
```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import HandPointing from '$lib/components/HandPointing.svelte';

  function startGame() {
    goto('/login');
  }
</script>

<div class="start-screen">
  <img src="/logo.svg" alt="Coca-Cola" class="logo" />
  <h1>Recycling Challenge</h1>
  <button class="start-button" on:click={startGame}>
    TAP TO START
    <HandPointing />
  </button>
</div>

<style>
  .start-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: white;
  }
  
  .start-button {
    background: #ED1C24;
    color: white;
    border: 4px solid black;
    font-size: 2rem;
    padding: 1.5rem 3rem;
    cursor: pointer;
    animation: pulse 1.5s infinite;
  }
</style>
```

**Deliverables:**
- ✅ Start screen with animations
- ✅ Tutorial screen with swipeable steps

---

### 3.4 Build Map Overview & Area Scenes

**Tasks:**
- [ ] Create `src/routes/game/+page.svelte` (Map Overview + Area Scene container)
- [ ] Create `src/lib/components/game/MapOverview.svelte` (clickable area tiles)
- [ ] Create `src/lib/components/game/AreaScene.svelte` (exploration scene with scattered items)
- [ ] Create `src/lib/components/game/ItemPopup.svelte` (inspection modal)
- [ ] Implement zoom-in/fade transition from map to area
- [ ] Implement zoom-out/fade transition from area back to map
- [ ] Place items at predefined positions within each area scene
- [ ] Add subtle sparkle/glow hints on undiscovered items
- [ ] Add progress tracking per area
- [ ] Add keyboard shortcuts for testing

**Map → Area Zoom Transition:**
```typescript
let zoomTarget = { x: 0, y: 0 };
let transitioning = false;

async function enterArea(areaId: string, tileElement: HTMLElement) {
  transitioning = true;
  const rect = tileElement.getBoundingClientRect();
  zoomTarget = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  
  // Animate: map scales up from tapped point, fades out
  // Area scene fades in simultaneously
  await animateZoomIn(zoomTarget, 600); // 0.6s ease-in-out
  
  gameStore.update(s => ({ ...s, currentArea: areaId, gamePhase: 'area' }));
  transitioning = false;
}

async function exitArea() {
  transitioning = true;
  await animateZoomOut(600);
  gameStore.update(s => ({ ...s, currentArea: null, gamePhase: 'map' }));
  transitioning = false;
}
```

**Item Popup Implementation:**
```typescript
function openItemPopup(itemId: string) {
  gameStore.update(s => ({ ...s, inspectedItem: itemId, gamePhase: 'popup' }));
}

function closeItemPopup() {
  gameStore.update(s => ({ ...s, inspectedItem: null, gamePhase: 'area' }));
}

function handlePlayerChoice(itemId: string, playerSaysRecyclable: boolean) {
  const item = getItemById(itemId);
  const isCorrect = item.isRecyclable === playerSaysRecyclable;
  
  if (isCorrect) {
    addScore(10);
    incrementStreak();
  } else {
    loseLife();
    resetStreak();
  }
  
  markItemIdentified(itemId, isCorrect ? 'correct' : 'incorrect');
  showFeedbackInPopup(isCorrect, item);
  // Popup auto-closes after feedback animation
}
```

**Deliverables:**
- ✅ Map overview with 6 clickable area tiles
- ✅ Smooth zoom-in/out transitions between map and areas
- ✅ Area scenes with items scattered naturally
- ✅ Item popup with close button, image, name, description, and choice buttons
- ✅ Touch targets > 44pt

---

### 3.5 Implement Feedback System

**Tasks:**
- [ ] Create in-popup feedback animations (checkmark, X overlay on item image)
- [ ] Create scene-level feedback (item badge after identification)
- [ ] Add sound effects (correct, incorrect, streak, area complete)
- [ ] Show explanation text on incorrect answers (inside popup)
- [ ] Implement perfect streak bonus (5 in a row)
- [ ] Implement area completion celebration
- [ ] Add haptic feedback (iPad)

**Animation Component:** `src/lib/components/game/ItemPopup.svelte`
```svelte
<script lang="ts">
  export let item: GameItem;
  export let onClose: () => void;
  export let onChoice: (recyclable: boolean) => void;

  let feedbackState: 'choosing' | 'correct' | 'incorrect' = 'choosing';
  let showExplanation = false;

  function handleChoice(playerSaysRecyclable: boolean) {
    const isCorrect = item.isRecyclable === playerSaysRecyclable;
    feedbackState = isCorrect ? 'correct' : 'incorrect';
    
    if (!isCorrect) {
      showExplanation = true;
    }
    
    onChoice(playerSaysRecyclable);
    
    // Auto-close after feedback
    setTimeout(() => {
      onClose();
    }, isCorrect ? 1000 : 2000);
  }
</script>

<div class="popup-backdrop">
  <div class="popup-card" class:correct={feedbackState === 'correct'} class:incorrect={feedbackState === 'incorrect'}>
    <button class="close-btn" on:click={onClose}>✕</button>
    
    <div class="item-image">
      <img src={item.detailImage} alt={item.name} />
      {#if feedbackState === 'correct'}
        <div class="overlay-badge correct-badge">✅</div>
      {/if}
      {#if feedbackState === 'incorrect'}
        <div class="overlay-badge incorrect-badge">❌</div>
      {/if}
    </div>
    
    <h3 class="item-name">{item.name}</h3>
    <p class="item-desc">{item.description}</p>
    
    {#if showExplanation}
      <p class="explanation">
        This item is {item.isRecyclable ? 'recyclable' : 'not recyclable'}.
      </p>
    {/if}
    
    {#if feedbackState === 'choosing'}
      <div class="choice-buttons">
        <button class="btn-recyclable" on:click={() => handleChoice(true)}>
          ♻️ RECYCLABLE
        </button>
        <button class="btn-not-recyclable" on:click={() => handleChoice(false)}>
          🚫 NOT RECYCLABLE
        </button>
      </div>
    {/if}
  </div>
</div>
```

**Deliverables:**
- ✅ In-popup feedback animations (correct/incorrect)
- ✅ Scene badge overlays on identified items
- ✅ Sound effects integrated
- ✅ Educational explanations shown on incorrect answers

---

### 3.6 Build Results Screen

**Tasks:**
- [ ] Create `src/routes/results/+page.svelte`
- [ ] Implement score animation (count-up effect)
- [ ] Add performance-based hand animations
- [ ] Show fun recycling facts
- [ ] Add navigation buttons (Play Again, Dashboard)

**Results Animation Logic:**
```typescript
function getResultAnimation(accuracy: number) {
  if (accuracy >= 90) return { animation: 'salute', title: 'Recycling Champion!' };
  if (accuracy >= 70) return { animation: 'salute', title: 'Great Work!' };
  if (accuracy >= 50) return { animation: 'salute', title: 'Keep Learning!' };
  return { animation: 'fist-pump', title: 'Practice Makes Perfect!' };
}
```

**Deliverables:**
- ✅ Results screen with animations
- ✅ Score calculation working

---

## 👤 Stage 4: User System & Dashboard
**Duration:** 1-2 weeks  
**Goal:** Implement multi-user features and dashboard

### 4.1 Build Login/Selection Screen

**Tasks:**
- [ ] Create `src/routes/login/+page.svelte`
- [ ] Fetch user list from API
- [ ] Display user grid/dropdown
- [ ] Implement "New Player" flow
- [ ] Add "Guest Mode" option
- [ ] Store userId in session

**API Integration:**
```typescript
import { apiClient } from '$lib/utils/apiClient';

async function loadUsers() {
  const response = await apiClient.get('/users/list');
  return response.data;
}

async function selectUser(userId: number) {
  const response = await apiClient.post('/users/login', { userId });
  sessionStorage.setItem('sessionToken', response.data.sessionToken);
  gameStore.update(state => ({ ...state, userId }));
  goto('/start');
}
```

**Deliverables:**
- ✅ User selection working
- ✅ New user creation flow
- ✅ Session persistence

---

### 4.2 Build Dashboard Screen

**Tasks:**
- [ ] Create `src/routes/dashboard/+page.svelte`
- [ ] Create statistics cards component
- [ ] Create recent sessions list component
- [ ] Create learning progress bars component
- [ ] Implement data fetching from API
- [ ] Add loading states and error handling
- [ ] Make responsive for iPad orientations

**Dashboard Components:**
```
src/lib/components/dashboard/
├── StatsCard.svelte
├── SessionsList.svelte
├── LearningProgress.svelte
└── ProgressBar.svelte
```

**Data Fetching:**
```typescript
async function loadDashboardData(userId: number) {
  const [stats, sessions, progress] = await Promise.all([
    apiClient.get(`/users/${userId}/stats`),
    apiClient.get(`/users/${userId}/sessions?limit=10`),
    apiClient.get(`/users/${userId}/learning-progress`)
  ]);

  return { stats: stats.data, sessions: sessions.data, progress: progress.data };
}
```

**Deliverables:**
- ✅ Dashboard with all data sections
- ✅ Charts and progress bars animated
- ✅ Responsive layout

---

### 4.3 Integrate Session Data Saving

**Tasks:**
- [ ] Call `startSession` API on game start
- [ ] Call `saveItem` API after each item sorted
- [ ] Call `completeSession` API on game end
- [ ] Implement offline queue for failed requests
- [ ] Upload screenshot after results shown
- [ ] Handle sync errors gracefully

**Session Flow:**
```typescript
// On game start
const session = await apiClient.post('/sessions/start', {
  userId: $gameStore.userId,
  startTime: new Date().toISOString(),
  difficultyLevel: 'medium'
});
gameStore.update(state => ({ ...state, sessionId: session.data.sessionId }));

// After each item
await apiClient.post('/sessions/save-item', {
  sessionId: $gameStore.sessionId,
  itemType: item.id,
  isCorrect: playerWasCorrect,
  timeToDecide: elapsedTime,
  sequenceOrder: $gameStore.itemsSorted
});

// On game complete
await apiClient.post('/sessions/complete', {
  sessionId: $gameStore.sessionId,
  endTime: new Date().toISOString(),
  finalScore: $gameStore.score,
  accuracy: calculateAccuracy(),
  completionStatus: 'completed'
});
```

**Deliverables:**
- ✅ Full session tracking implemented
- ✅ Offline support with retry logic

---

## 🧪 Stage 5: Integration & Testing
**Duration:** 1-2 weeks  
**Goal:** Test all features and fix bugs

### 5.1 Unit Testing

**Tasks:**
- [ ] Write tests for game logic (scoring, validation)
- [ ] Write tests for API utilities
- [ ] Write tests for state management
- [ ] Achieve 70%+ code coverage

**Tools:**
- Vitest for unit tests
- Testing Library for component tests

**Deliverables:**
- ✅ 50+ unit tests passing

---

### 5.2 Integration Testing

**Tasks:**
- [ ] Test complete game flow end-to-end
- [ ] Test multi-user scenarios (2+ users)
- [ ] Test offline mode and sync
- [ ] Test on multiple iPad models (Air, Pro, Mini)
- [ ] Test both orientations (portrait, landscape)
- [ ] Test API error handling

**Test Scenarios:**
- User creates account → plays game → views dashboard
- User plays offline → goes online → data syncs
- Multiple users on same device
- Session interrupted mid-game → resume
- API timeout handling

**Deliverables:**
- ✅ All integration tests passing
- ✅ Known issues documented

---

### 5.3 Performance Testing

**Tasks:**
- [ ] Test load times (target: <3s)
- [ ] Test animation smoothness (target: 60fps)
- [ ] Test API response times (target: <500ms)
- [ ] Test with 100+ game sessions in database
- [ ] Optimize slow queries
- [ ] Add lazy loading for dashboard images

**Tools:**
- Lighthouse for web performance
- Azure Load Testing for API

**Deliverables:**
- ✅ Performance metrics meet targets
- ✅ Optimization complete

---

### 5.4 User Acceptance Testing

**Tasks:**
- [ ] Recruit 10 test users (target age group)
- [ ] Observe gameplay sessions
- [ ] Collect feedback on UI/UX
- [ ] Test educational effectiveness
- [ ] Measure completion rate and replay rate
- [ ] Iterate based on feedback

**Metrics to Track:**
- Average session time (target: 3-5 min)
- Completion rate (target: 80%+)
- Replay rate (target: 40%+)
- User satisfaction (target: 4/5 stars)

**Deliverables:**
- ✅ UAT report with recommendations
- ✅ UI improvements implemented

---

## 🚀 Stage 6: Polish & Deployment
**Duration:** 1-2 weeks  
**Goal:** Final polish and production deployment

### 6.1 Localization

**Tasks:**
- [ ] Complete English translations in `messages/en.json`
- [ ] Complete Traditional Chinese translations in `messages/zh-hk.json`
- [ ] Implement language switcher
- [ ] Test both languages thoroughly
- [ ] Ensure proper text wrapping for Chinese

**Translation Keys:**
```json
{
  "startScreen.title": "Recycling Challenge",
  "startScreen.tapToStart": "TAP TO START",
  "game.recyclable": "RECYCLABLE",
  "game.nonRecyclable": "NON-RECYCLABLE",
  "results.champion": "Recycling Champion!",
  "dashboard.title": "Dashboard",
  ...
}
```

**Deliverables:**
- ✅ Full bilingual support
- ✅ Language switcher in settings

---

### 6.2 Accessibility

**Tasks:**
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Test with screen readers
- [ ] Add high contrast mode option
- [ ] Ensure text meets WCAG contrast ratios
- [ ] Add captions for sound effects (optional)

**Deliverables:**
- ✅ WCAG 2.1 Level AA compliance

---

### 6.3 Security Hardening

**Tasks:**
- [ ] Implement rate limiting on APIs
- [ ] Add input sanitization
- [ ] Enable HTTPS only
- [ ] Configure Content Security Policy (CSP)
- [ ] Review CORS settings
- [ ] Audit dependencies for vulnerabilities
- [ ] Set up Azure Key Vault for secrets

**Deliverables:**
- ✅ Security audit passed
- ✅ No critical vulnerabilities

---

### 6.4 Production Deployment

**Tasks:**
- [ ] Set up production environment variables
- [ ] Configure custom domain (optional)
- [ ] Deploy SvelteKit app to Azure Static Web Apps or Vercel
  ```bash
  pnpm build
  # Deploy to Azure Static Web Apps
  ```
- [ ] Verify Azure Functions are in production mode
- [ ] Set up Azure CDN for static assets
- [ ] Configure Application Insights
- [ ] Set up monitoring alerts
- [ ] Create deployment documentation

**Production Checklist:**
- [ ] Database backups configured (daily)
- [ ] Blob Storage redundancy enabled
- [ ] Function App auto-scaling configured
- [ ] SSL certificate installed
- [ ] Error tracking enabled (Sentry/AppInsights)
- [ ] Analytics integrated (optional)

**Deliverables:**
- ✅ Game live in production
- ✅ Monitoring dashboards set up

---

### 6.5 Documentation & Handoff

**Tasks:**
- [ ] Write admin guide for managing users
- [ ] Write deployment guide
- [ ] Document API endpoints (Swagger/OpenAPI)
- [ ] Create troubleshooting guide
- [ ] Record demo video
- [ ] Prepare user manual (if needed)

**Documentation Files:**
```
docs/
├── README.md
├── DEPLOYMENT.md
├── API_REFERENCE.md
├── TROUBLESHOOTING.md
└── USER_GUIDE.md
```

**Deliverables:**
- ✅ Complete documentation set
- ✅ Knowledge transfer complete

---

## 📊 Success Metrics & KPIs

### Technical Metrics
- **Uptime:** 99.5%+
- **API Response Time:** <500ms (p95)
- **Page Load Time:** <3s (p95)
- **Error Rate:** <1%

### User Engagement Metrics
- **Completion Rate:** 80%+
- **Replay Rate:** 40%+
- **Average Session Time:** 3-5 minutes
- **Daily Active Users:** Track growth

### Educational Metrics
- **Items Learned:** 10+ per user
- **Accuracy Improvement:** Track over time
- **Retention:** 60% return within 7 days

---

## 🛠️ Tools & Technologies Summary

### Frontend
- **Framework:** SvelteKit
- **Language:** TypeScript
- **Styling:** CSS (custom, Coca-Cola design system)
- **State Management:** Svelte stores
- **Icons/Assets:** SVG with stroke outlines

### Backend
- **API:** Azure Functions (Node.js 18)
- **Database:** Azure SQL Database
- **Storage:** Azure Blob Storage
- **Auth:** Simple token-based (session tokens)

### DevOps
- **Hosting:** Azure Static Web Apps or Vercel
- **CI/CD:** GitHub Actions
- **Monitoring:** Azure Application Insights
- **Error Tracking:** Sentry (optional)

### Testing
- **Unit Tests:** Vitest
- **Integration Tests:** Playwright
- **Performance:** Lighthouse, Azure Load Testing

---

## 📅 Milestones & Timeline

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| 1-2 | Stage 1 Complete | Azure resources + Database schema |
| 2-3 | Stage 2 Complete | All API endpoints working |
| 3-4 | Stage 3.1-3.3 | Start screen + Tutorial + Assets |
| 4-5 | Stage 3.4-3.6 | Main game + Feedback + Results |
| 5-6 | Stage 4 Complete | Login + Dashboard |
| 7 | Stage 5.1-5.2 | Unit + Integration tests |
| 8 | Stage 5.3-5.4 | Performance + UAT |
| 9 | Stage 6.1-6.3 | i18n + Security + Polish |
| 10 | Stage 6.4-6.5 | Production deployment |

---

## 🚨 Risk Management

### High Priority Risks
1. **Azure SQL costs exceed budget**
   - Mitigation: Use Basic tier, monitor usage, implement caching
   
2. **Performance issues on older iPads**
   - Mitigation: Test early, optimize animations, reduce asset sizes
   
3. **API rate limiting issues**
   - Mitigation: Implement request batching, offline queue
   
4. **Data sync conflicts**
   - Mitigation: Use timestamps, implement conflict resolution

### Medium Priority Risks
1. **Localization delays**
   - Mitigation: Start early, use professional translators
   
2. **Browser compatibility issues**
   - Mitigation: Test on Safari (iPad default), add polyfills

---

## 📞 Support & Maintenance Plan

### Post-Launch Activities
- **Week 1:** Monitor closely, fix critical bugs
- **Week 2-4:** Address user feedback, minor improvements
- **Month 2+:** Feature enhancements, new items

### Maintenance Tasks
- Weekly: Review error logs
- Monthly: Database cleanup (old sessions), cost review
- Quarterly: Security updates, dependency updates
- Annually: Major feature releases

---

*Last Updated: February 3, 2026*
*Next Review: Start of Stage 2*
