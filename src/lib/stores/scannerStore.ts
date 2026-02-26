import { writable, derived } from 'svelte/store';
import type {
	ScannerGameState,
	PlasticItem,
	DialReadings,
	PlasticType,
	ScannerResult
} from '$lib/types/scanner';
import plasticsData from '$lib/data/plastics.json';

const allPlastics = plasticsData as PlasticItem[];

function shuffleArray<T>(arr: T[]): T[] {
	const shuffled = [...arr];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

let gameItems: PlasticItem[] = [];
let timerInterval: ReturnType<typeof setInterval> | null = null;

const TIME_LIMIT = 120; // 2 minutes

const INITIAL_STATE: ScannerGameState = {
	phase: 'ready',
	score: 0,
	lives: 3,
	maxLives: 3,
	currentItemIndex: 0,
	totalItems: 0,
	dialReadings: { meltingPoint: 50, density: 50, softeningPoint: 50, chlorine: 50 },
	isScanning: false,
	lastResult: null,
	lastCorrectType: null,
	streak: 0,
	longestStreak: 0,
	results: [],
	startTime: null,
	timeLimit: TIME_LIMIT,
	timeRemaining: TIME_LIMIT
};

function createScannerStore() {
	const { subscribe, set, update } = writable<ScannerGameState>({ ...INITIAL_STATE });

	return {
		subscribe,

		startGame: () => {
			gameItems = shuffleArray(allPlastics);
			// Clear any existing timer
			if (timerInterval) clearInterval(timerInterval);
			set({
				...INITIAL_STATE,
				phase: 'scanning',
				totalItems: gameItems.length,
				startTime: new Date(),
				dialReadings: { meltingPoint: 50, density: 50, softeningPoint: 50, chlorine: 50 },
				timeLimit: TIME_LIMIT,
				timeRemaining: TIME_LIMIT
			});
			// Start countdown timer
			timerInterval = setInterval(() => {
				update((s) => {
					const newTime = s.timeRemaining - 1;
					if (newTime <= 0) {
						if (timerInterval) clearInterval(timerInterval);
						timerInterval = null;
						return { ...s, timeRemaining: 0, phase: 'results' };
					}
					return { ...s, timeRemaining: newTime };
				});
			}, 1000);
		},

		setDial: (dial: keyof DialReadings, value: number) => {
			update((s) => ({
				...s,
				dialReadings: { ...s.dialReadings, [dial]: Math.max(0, Math.min(100, value)) }
			}));
		},

		scan: () => {
			update((s) => ({ ...s, isScanning: true }));
			// Scanning animation takes 1s
			setTimeout(() => {
				update((s) => ({ ...s, isScanning: false }));
			}, 1000);
		},

		routeToLine: (choice: PlasticType) => {
			update((s) => {
				const item = gameItems[s.currentItemIndex];
				if (!item) return s;

				const isCorrect = item.correctType === choice;
				const newStreak = isCorrect ? s.streak + 1 : 0;
				const basePoints = isCorrect ? 15 : 0;
				const streakBonus = isCorrect && newStreak >= 3 ? 5 : 0;

				// Check dial accuracy for bonus points
				const dialAccuracy = calculateDialAccuracy(s.dialReadings, item);
				const dialBonus = isCorrect && dialAccuracy > 70 ? Math.round(dialAccuracy / 10) : 0;

				const result: ScannerResult = {
					itemId: item.id,
					playerChoice: choice,
					correctType: item.correctType,
					isCorrect,
					dialReadings: { ...s.dialReadings },
					timeToDecide: s.startTime ? (Date.now() - s.startTime.getTime()) / 1000 : 0
				};

				const newLives = isCorrect ? s.lives : s.lives - 1;

				return {
					...s,
					phase: 'feedback',
					score: s.score + basePoints + streakBonus + dialBonus,
					lives: newLives,
					streak: newStreak,
					longestStreak: Math.max(s.longestStreak, newStreak),
					lastResult: isCorrect ? 'correct' : 'incorrect',
					lastCorrectType: item.correctType,
					results: [...s.results, result]
				};
			});
		},

		nextItem: () => {
			update((s) => {
				const nextIndex = s.currentItemIndex + 1;
				if (s.lives <= 0 || nextIndex >= gameItems.length || s.timeRemaining <= 0) {
					if (timerInterval) clearInterval(timerInterval);
					timerInterval = null;
					return { ...s, phase: 'results' };
				}
				return {
					...s,
					phase: 'scanning',
					currentItemIndex: nextIndex,
					lastResult: null,
					lastCorrectType: null,
					dialReadings: { meltingPoint: 50, density: 50, softeningPoint: 50, chlorine: 50 }
				};
			});
		},

		reset: () => {
			if (timerInterval) clearInterval(timerInterval);
			timerInterval = null;
			set({ ...INITIAL_STATE });
		}
	};
}

function calculateDialAccuracy(readings: DialReadings, item: PlasticItem): number {
	const props = item.properties;
	const diffs = [
		Math.abs(readings.meltingPoint - props.meltingPoint),
		Math.abs(readings.density - props.density),
		Math.abs(readings.softeningPoint - props.softeningPoint),
		Math.abs(readings.chlorine - props.chlorine)
	];
	const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
	return Math.max(0, 100 - avgDiff);
}

export const scannerStore = createScannerStore();

export function getPlastics(): PlasticItem[] {
	return allPlastics;
}

export function getCurrentItem(index: number): PlasticItem | undefined {
	return gameItems[index];
}

export const scannerAccuracy = derived(scannerStore, ($s) => {
	if ($s.results.length === 0) return 0;
	const correct = $s.results.filter((r) => r.isCorrect).length;
	return Math.round((correct / $s.results.length) * 100);
});
