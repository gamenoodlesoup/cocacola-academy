// Lab Game Types - "Home Lab" / Cooking Mama style

export type LabPhase = 'intro' | 'testing' | 'identify' | 'feedback' | 'results';

export type TestType = 'float' | 'bend' | 'heat' | 'scratch' | 'transparency';

export interface LabTest {
	id: TestType;
	name: string;
	nameZhHK: string;
	icon: string;
	instruction: string;
	description: string;
	/** Steps the player performs (Cooking Mama style mini-actions) */
	steps: LabStep[];
}

export interface LabStep {
	id: string;
	action: 'tap' | 'swipe-down' | 'swipe-right' | 'hold' | 'drag';
	instruction: string;
	icon: string;
	duration?: number; // ms for hold action
}

export interface PlasticSample {
	id: string;
	name: string;
	nameZhHK: string;
	icon: string;
	actualType: string; // PET, HDPE, PVC, PP, etc
	testResults: Record<TestType, string>; // result text per test
	testOutcomes: Record<TestType, string>; // observable outcome
}

export interface LabGameState {
	phase: LabPhase;
	score: number;
	currentSampleIndex: number;
	totalSamples: number;
	currentTestIndex: number;
	currentStepIndex: number;
	testSequence: TestType[];
	completedTests: TestType[];
	testResults: Record<string, string>; // collected observations
	stepProgress: number; // 0-100 for current step
	isPerformingStep: boolean;
	lastStepSuccess: boolean;
	lives: number;
	maxLives: number;
	results: LabResult[];
	startTime: Date | null;
}

export interface LabResult {
	sampleId: string;
	playerGuess: string;
	correctType: string;
	isCorrect: boolean;
	testsCompleted: number;
	timeSpent: number;
}
