import { writable, derived } from 'svelte/store';
import type { LabGameState, LabResult, TestType, LabTest, PlasticSample } from '$lib/types/lab';
import labData from '$lib/data/lab-tests.json';

const allTests = labData.tests as LabTest[];
const allSamples = labData.samples as PlasticSample[];

function shuffleArray<T>(arr: T[]): T[] {
	const out = [...arr];
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}

let gameSamples: PlasticSample[] = [];

// Pick 3 random tests per sample to keep it snappy
function pickTestSequence(): TestType[] {
	const shuffled = shuffleArray(allTests.map((t) => t.id));
	return shuffled.slice(0, 3) as TestType[];
}

const INITIAL_STATE: LabGameState = {
	phase: 'intro',
	score: 0,
	currentSampleIndex: 0,
	totalSamples: 0,
	currentTestIndex: 0,
	currentStepIndex: 0,
	testSequence: [],
	completedTests: [],
	testResults: {},
	stepProgress: 0,
	isPerformingStep: false,
	lastStepSuccess: false,
	lives: 3,
	maxLives: 3,
	results: [],
	startTime: null
};

function createLabStore() {
	const { subscribe, set, update } = writable<LabGameState>({ ...INITIAL_STATE });

	return {
		subscribe,

		startGame: () => {
			gameSamples = shuffleArray(allSamples);
			const testSeq = pickTestSequence();
			set({
				...INITIAL_STATE,
				phase: 'testing',
				totalSamples: gameSamples.length,
				testSequence: testSeq,
				startTime: new Date()
			});
		},

		/** Player performs the current step action (tap, swipe, hold) */
		performStep: () => {
			update((s) => ({ ...s, isPerformingStep: true, stepProgress: 0 }));
		},

		/** Called when step animation/interaction completes */
		completeStep: (success: boolean) => {
			update((s) => {
				const testId = s.testSequence[s.currentTestIndex];
				const test = allTests.find((t) => t.id === testId);
				if (!test) return s;

				const isLastStep = s.currentStepIndex >= test.steps.length - 1;

				if (isLastStep) {
					// Test complete — record result
					const sample = gameSamples[s.currentSampleIndex];
					const resultText = sample?.testResults[testId] ?? 'No result';
					const newTestResults = { ...s.testResults, [testId]: resultText };
					const newCompleted = [...s.completedTests, testId];

					const isLastTest = s.currentTestIndex >= s.testSequence.length - 1;

					if (isLastTest) {
						// All tests done - time to identify
						return {
							...s,
							isPerformingStep: false,
							lastStepSuccess: success,
							stepProgress: 100,
							completedTests: newCompleted,
							testResults: newTestResults,
							phase: 'identify'
						};
					}

					// Next test
					return {
						...s,
						isPerformingStep: false,
						lastStepSuccess: success,
						stepProgress: 100,
						completedTests: newCompleted,
						testResults: newTestResults,
						currentTestIndex: s.currentTestIndex + 1,
						currentStepIndex: 0
					};
				}

				// Next step within same test
				return {
					...s,
					isPerformingStep: false,
					lastStepSuccess: success,
					stepProgress: Math.round(((s.currentStepIndex + 1) / test.steps.length) * 100),
					currentStepIndex: s.currentStepIndex + 1
				};
			});
		},

		/** Update hold progress (0-100) */
		updateHoldProgress: (progress: number) => {
			update((s) => ({ ...s, stepProgress: Math.min(100, progress) }));
		},

		/** Player identifies the plastic type */
		identifySample: (guess: string) => {
			update((s) => {
				const sample = gameSamples[s.currentSampleIndex];
				if (!sample) return s;

				const isCorrect = guess === sample.actualType;
				const points = isCorrect ? 20 : 0;
				const newLives = isCorrect ? s.lives : s.lives - 1;

				const result: LabResult = {
					sampleId: sample.id,
					playerGuess: guess,
					correctType: sample.actualType,
					isCorrect,
					testsCompleted: s.completedTests.length,
					timeSpent: s.startTime ? (Date.now() - s.startTime.getTime()) / 1000 : 0
				};

				return {
					...s,
					phase: 'feedback',
					score: s.score + points,
					lives: newLives,
					results: [...s.results, result]
				};
			});
		},

		/** Move to next sample or results */
		nextSample: () => {
			update((s) => {
				const nextIdx = s.currentSampleIndex + 1;
				if (s.lives <= 0 || nextIdx >= gameSamples.length) {
					return { ...s, phase: 'results' };
				}

				const newTestSeq = pickTestSequence();
				return {
					...s,
					phase: 'testing',
					currentSampleIndex: nextIdx,
					currentTestIndex: 0,
					currentStepIndex: 0,
					testSequence: newTestSeq,
					completedTests: [],
					testResults: {},
					stepProgress: 0,
					isPerformingStep: false
				};
			});
		},

		reset: () => {
			set({ ...INITIAL_STATE });
		}
	};
}

export const labStore = createLabStore();

export function getSamples(): PlasticSample[] {
	return allSamples;
}

export function getCurrentSample(index: number): PlasticSample | undefined {
	return gameSamples[index];
}

export function getTest(testId: string): LabTest | undefined {
	return allTests.find((t) => t.id === testId);
}

export function getAllTests(): LabTest[] {
	return allTests;
}

export const labAccuracy = derived(labStore, ($s) => {
	if ($s.results.length === 0) return 0;
	const correct = $s.results.filter((r) => r.isCorrect).length;
	return Math.round((correct / $s.results.length) * 100);
});
