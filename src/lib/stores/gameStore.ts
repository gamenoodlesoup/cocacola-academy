import { writable, derived, get } from 'svelte/store';
import type { GameState, Item, IdentifiedItem, FeedbackState, Area, AreaProgress } from '$lib/types';
import itemsData from '$lib/data/items.json';
import areasData from '$lib/data/areas.json';

// Cast imported data
const allItems = itemsData as Item[];
const allAreas = areasData as Area[];

function buildAreaProgress(): Record<string, AreaProgress> {
	const progress: Record<string, AreaProgress> = {};
	for (const area of allAreas) {
		const areaItems = allItems.filter((item) => item.area === area.id);
		progress[area.id] = { total: areaItems.length, found: 0, correct: 0 };
	}
	return progress;
}

const INITIAL_STATE: GameState = {
	userId: null,
	sessionId: null,
	score: 0,
	lives: 3,
	maxLives: 3,
	currentStreak: 0,
	longestStreak: 0,
	totalItemsIdentified: 0,
	totalItems: allItems.length,
	currentArea: null,
	areaProgress: buildAreaProgress(),
	completedAreas: [],
	inspectedItem: null,
	identifiedItems: {},
	isPlaying: false,
	isPaused: false,
	gamePhase: 'map',
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
		startGame: () => {
			update((state) => ({
				...state,
				isPlaying: true,
				isPaused: false,
				gamePhase: 'map',
				gameStartTime: new Date(),
				gameEndTime: null,
				score: 0,
				lives: 3,
				currentStreak: 0,
				longestStreak: 0,
				totalItemsIdentified: 0,
				totalItems: allItems.length,
				currentArea: null,
				areaProgress: buildAreaProgress(),
				completedAreas: [],
				inspectedItem: null,
				identifiedItems: {}
			}));
		},

		// Enter an area from the map
		enterArea: (areaId: string) => {
			update((state) => ({
				...state,
				currentArea: areaId,
				gamePhase: 'zooming'
			}));

			// After zoom animation, switch to area phase
			setTimeout(() => {
				update((state) => {
					if (state.gamePhase === 'zooming') {
						return { ...state, gamePhase: 'area' };
					}
					return state;
				});
			}, 800);
		},

		// Exit area back to map
		exitArea: () => {
			update((state) => ({
				...state,
				currentArea: null,
				inspectedItem: null,
				gamePhase: 'map'
			}));
		},

		// Open item popup
		openItemPopup: (itemId: string) => {
			update((state) => ({
				...state,
				inspectedItem: itemId,
				gamePhase: 'popup'
			}));
		},

		// Close item popup
		closeItemPopup: () => {
			update((state) => ({
				...state,
				inspectedItem: null,
				gamePhase: 'area'
			}));
		},

		// Identify item as recyclable or not
		identifyItem: (itemId: string, playerSaysRecyclable: boolean, timeToDecide: number) => {
			let result = { isCorrect: false, streakBonus: false };

			update((state) => {
				const item = allItems.find((i) => i.id === itemId);
				if (!item || !state.currentArea) return state;

				const isCorrect = item.isRecyclable === playerSaysRecyclable;
				const newStreak = isCorrect ? state.currentStreak + 1 : 0;
				const streakBonus = newStreak === 5 ? 50 : 0;
				const pointsEarned = isCorrect ? 10 + streakBonus : 0;
				const newLives = isCorrect ? state.lives : state.lives - 1;

				result = { isCorrect, streakBonus: streakBonus > 0 };

				const identified: IdentifiedItem = {
					itemId,
					result: isCorrect ? 'correct' : 'incorrect',
					playerChoice: playerSaysRecyclable,
					timeToDecide,
					timestamp: new Date()
				};

				const newIdentified = { ...state.identifiedItems, [itemId]: identified };
				const newTotalIdentified = state.totalItemsIdentified + 1;

				// Update area progress
				const newAreaProgress = { ...state.areaProgress };
				const areaP = { ...newAreaProgress[state.currentArea] };
				areaP.found = areaP.found + 1;
				if (isCorrect) areaP.correct = areaP.correct + 1;
				newAreaProgress[state.currentArea] = areaP;

				// Check if area is complete
				const areaComplete = areaP.found >= areaP.total;
				const newCompletedAreas = areaComplete
					? [...state.completedAreas, state.currentArea]
					: state.completedAreas;

				// Check game over
				const gameOver = newLives <= 0 || newCompletedAreas.length >= allAreas.length;

				return {
					...state,
					score: state.score + pointsEarned,
					lives: newLives,
					currentStreak: newStreak,
					longestStreak: Math.max(state.longestStreak, newStreak),
					totalItemsIdentified: newTotalIdentified,
					identifiedItems: newIdentified,
					areaProgress: newAreaProgress,
					completedAreas: newCompletedAreas,
					inspectedItem: null,
					gamePhase: 'feedback',
					isPlaying: !gameOver,
					gameEndTime: gameOver ? new Date() : null
				};
			});

			return result;
		},

		// After feedback animation finishes
		dismissFeedback: () => {
			update((state) => {
				// If game is over, go to results
				if (!state.isPlaying) {
					return { ...state, gamePhase: 'results' };
				}

				// Check if current area is complete
				if (
					state.currentArea &&
					state.completedAreas.includes(state.currentArea)
				) {
					return {
						...state,
						currentArea: null,
						gamePhase: 'map'
					};
				}

				// Stay in area
				return { ...state, gamePhase: 'area' };
			});
		},

		// End game
		endGame: () => {
			update((state) => ({
				...state,
				isPlaying: false,
				gamePhase: 'results',
				gameEndTime: new Date()
			}));
		},

		// Reset game
		reset: () => set({ ...INITIAL_STATE, areaProgress: buildAreaProgress() }),

		// Toggle pause
		togglePause: () => {
			update((state) => ({
				...state,
				isPaused: !state.isPaused
			}));
		},

		// Settings
		updateSettings: (settings: Partial<Pick<GameState, 'soundEnabled' | 'language'>>) => {
			update((state) => ({
				...state,
				...settings
			}));
		}
	};
}

export const gameStore = createGameStore();

// Feedback store
const INITIAL_FEEDBACK: FeedbackState = {
	show: false,
	isCorrect: false,
	item: null,
	streak: 0
};

function createFeedbackStore() {
	const { subscribe, set } = writable<FeedbackState>(INITIAL_FEEDBACK);

	return {
		subscribe,
		show: (isCorrect: boolean, item: Item, streak: number, correctAnswer?: string) => {
			set({ show: true, isCorrect, item, streak, correctAnswer });
		},
		hide: () => {
			set(INITIAL_FEEDBACK);
		}
	};
}

export const feedbackStore = createFeedbackStore();

// Derived stores
export const accuracy = derived(gameStore, ($game) => {
	if ($game.totalItemsIdentified === 0) return 0;
	const correct = Object.values($game.identifiedItems).filter((i) => i.result === 'correct').length;
	return Math.round((correct / $game.totalItemsIdentified) * 100);
});

export const isGameOver = derived(gameStore, ($game) => {
	return !$game.isPlaying && $game.totalItemsIdentified > 0;
});

export const correctCount = derived(gameStore, ($game) => {
	return Object.values($game.identifiedItems).filter((i) => i.result === 'correct').length;
});

export const timeElapsed = derived(gameStore, ($game) => {
	if (!$game.gameStartTime) return 0;
	const endTime = $game.gameEndTime || new Date();
	return Math.floor((endTime.getTime() - $game.gameStartTime.getTime()) / 1000);
});

// Helper: get items for a specific area
export function getItemsForArea(areaId: string): Item[] {
	return allItems.filter((item) => item.area === areaId);
}

// Helper: get item by id
export function getItemById(itemId: string): Item | undefined {
	return allItems.find((item) => item.id === itemId);
}

// Helper: get all areas
export function getAreas(): Area[] {
	return allAreas;
}
