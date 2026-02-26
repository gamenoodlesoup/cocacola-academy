// Scanner Game Types - "Plastic Scanner" / "Match the Ingredients"

export type PlasticType = 'PET' | 'HDPE' | 'PVC' | 'LDPE' | 'PP' | 'PS';
export type ScannerPhase = 'ready' | 'scanning' | 'routing' | 'feedback' | 'results';

/** Real-world reference data for each plastic type */
export interface PlasticReference {
	name: string;
	nameZhHK: string;
	recycleCode: number;
	softeningPoint: number; // °C
	meltingPoint: number;   // °C
	description: string;
	descriptionZhHK: string;
}

export interface PlasticProperties {
	meltingPoint: number;   // dial value 0-100
	density: number;        // dial value 0-100
	softeningPoint: number; // dial value 0-100
	chlorine: number;       // dial value 0-100 (>70 = chlorine present)
}

export interface PlasticItem {
	id: string;
	name: string;
	nameZhHK: string;
	type: PlasticType;
	recycleCode: number; // 1-6
	icon: string;
	color: string;
	properties: PlasticProperties;
	hints: PlasticHints;
	correctType: PlasticType;
	funFact: string;
}

export interface PlasticHints {
	floatSink: 'float' | 'sink';       // density hint
	meltPeak: 'sharp' | 'broad';       // melting point hint
	bendCue: 'flexible' | 'rigid' | 'brittle'; // softening hint
	chlorineAlert: boolean;             // chlorine detection hint
}

export interface DialReadings {
	meltingPoint: number;
	density: number;
	softeningPoint: number;
	chlorine: number;
}

export interface ScannerGameState {
	phase: ScannerPhase;
	score: number;
	lives: number;
	maxLives: number;
	currentItemIndex: number;
	totalItems: number;
	dialReadings: DialReadings;
	isScanning: boolean;
	lastResult: 'correct' | 'incorrect' | null;
	lastCorrectType: PlasticType | null;
	streak: number;
	longestStreak: number;
	results: ScannerResult[];
	startTime: Date | null;
	/** Timer fields */
	timeLimit: number;       // seconds
	timeRemaining: number;   // seconds
}

export interface ScannerResult {
	itemId: string;
	playerChoice: PlasticType;
	correctType: PlasticType;
	isCorrect: boolean;
	dialReadings: DialReadings;
	timeToDecide: number;
}
