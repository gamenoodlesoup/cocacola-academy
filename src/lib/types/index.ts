export type ItemCategory = 'plastic' | 'metal' | 'glass' | 'paper' | 'organic' | 'other';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GamePhase = 'map' | 'zooming' | 'area' | 'popup' | 'feedback' | 'results';

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
	area: string;
	position: { x: number; y: number };
}

export interface Area {
	id: string;
	name: string;
	nameZhHK: string;
	icon: string;
	difficulty: Difficulty;
	background: string;
	gradient?: string;
	scenery?: string[];
}

export interface AreaProgress {
	total: number;
	found: number;
	correct: number;
}

export interface IdentifiedItem {
	itemId: string;
	result: 'correct' | 'incorrect';
	playerChoice: boolean; // true = recyclable, false = not
	timeToDecide: number;
	timestamp: Date;
}

export interface GameState {
	// User info
	userId: number | null;
	sessionId: number | null;

	// Game progress
	score: number;
	lives: number;
	maxLives: number;
	currentStreak: number;
	longestStreak: number;

	// Items & Areas
	totalItemsIdentified: number;
	totalItems: number;
	currentArea: string | null;
	areaProgress: Record<string, AreaProgress>;
	completedAreas: string[];
	inspectedItem: string | null;
	identifiedItems: Record<string, IdentifiedItem>;

	// State
	isPlaying: boolean;
	isPaused: boolean;
	gamePhase: GamePhase;
	gameStartTime: Date | null;
	gameEndTime: Date | null;

	// Settings
	soundEnabled: boolean;
	language: 'en' | 'zh-HK';
}

export interface FeedbackState {
	show: boolean;
	isCorrect: boolean;
	item: Item | null;
	streak: number;
	correctAnswer?: string;
}
