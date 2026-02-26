<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { labStore, getCurrentSample, getTest, labAccuracy } from '$lib/stores/labStore';
	import type { LabGameState, PlasticSample, LabTest, LabStep, TestType } from '$lib/types/lab';

	let gameState = $state<LabGameState>(get(labStore));
	let accuracy = $state(0);
	let currentSample = $state<PlasticSample | undefined>(undefined);
	let showTutorial = $state(true);
	let holdTimer = $state<ReturnType<typeof setInterval> | null>(null);
	let holdProgress = $state(0);
	let stepAnimating = $state(false);
	let swipeStartX = $state(0);
	let swipeStartY = $state(0);
	let stepResultText = $state('');
	let showStepResult = $state(false);
	let autoReturnCountdown = $state(5);
	let autoReturnTimer = $state<ReturnType<typeof setInterval> | null>(null);

	$effect(() => {
		const unsub = labStore.subscribe((s) => {
			gameState = s;
			currentSample = getCurrentSample(s.currentSampleIndex);
		});
		return unsub;
	});

	$effect(() => {
		const unsub = labAccuracy.subscribe((a) => { accuracy = a; });
		return unsub;
	});

	onMount(() => {
		labStore.startGame();
	});

	// Auto-return to hub when results show
	$effect(() => {
		if (gameState.phase === 'results') {
			autoReturnCountdown = 5;
			autoReturnTimer = setInterval(() => {
				autoReturnCountdown -= 1;
				if (autoReturnCountdown <= 0) {
					if (autoReturnTimer) clearInterval(autoReturnTimer);
					labStore.reset();
					goto('/games');
				}
			}, 1000);
			return () => {
				if (autoReturnTimer) clearInterval(autoReturnTimer);
			};
		}
	});

	function dismissTutorial() {
		showTutorial = false;
	}

	// Current test + step helpers
	function getCurrentTest(): LabTest | undefined {
		if (gameState.testSequence.length === 0) return undefined;
		const testId = gameState.testSequence[gameState.currentTestIndex];
		return getTest(testId);
	}

	function getCurrentStep(): LabStep | undefined {
		const test = getCurrentTest();
		if (!test) return undefined;
		return test.steps[gameState.currentStepIndex];
	}

	// --- Interaction handlers for Cooking Mama steps ---

	function handleTap() {
		const step = getCurrentStep();
		if (!step || step.action !== 'tap' || stepAnimating) return;
		stepAnimating = true;

		// Show result text if this is an observe step
		const test = getCurrentTest();
		const testId = gameState.testSequence[gameState.currentTestIndex];
		if (step.id.startsWith('observe') && currentSample) {
			stepResultText = currentSample.testResults[testId as TestType] ?? '';
			showStepResult = true;
		}

		setTimeout(() => {
			stepAnimating = false;
			showStepResult = false;
			labStore.completeStep(true);
		}, step.id.startsWith('observe') ? 1800 : 600);
	}

	function handleHoldStart() {
		const step = getCurrentStep();
		if (!step || step.action !== 'hold' || stepAnimating) return;
		stepAnimating = true;
		holdProgress = 0;
		const duration = step.duration ?? 1500;
		const intervalTime = 30;
		const increment = (intervalTime / duration) * 100;

		holdTimer = setInterval(() => {
			holdProgress += increment;
			labStore.updateHoldProgress(holdProgress);
			if (holdProgress >= 100) {
				if (holdTimer) clearInterval(holdTimer);
				holdTimer = null;
				setTimeout(() => {
					stepAnimating = false;
					labStore.completeStep(true);
					holdProgress = 0;
				}, 300);
			}
		}, intervalTime);
	}

	function handleHoldEnd() {
		if (holdTimer) {
			clearInterval(holdTimer);
			holdTimer = null;
		}
		if (holdProgress < 100 && stepAnimating) {
			holdProgress = 0;
			stepAnimating = false;
			labStore.updateHoldProgress(0);
		}
	}

	function handleSwipeStart(e: TouchEvent | MouseEvent) {
		const step = getCurrentStep();
		if (!step || stepAnimating) return;
		if (step.action !== 'swipe-down' && step.action !== 'swipe-right') return;
		if ('touches' in e) {
			swipeStartX = e.touches[0].clientX;
			swipeStartY = e.touches[0].clientY;
		} else {
			swipeStartX = e.clientX;
			swipeStartY = e.clientY;
		}
	}

	function handleSwipeEnd(e: TouchEvent | MouseEvent) {
		const step = getCurrentStep();
		if (!step || stepAnimating) return;
		if (step.action !== 'swipe-down' && step.action !== 'swipe-right') return;

		let endX: number, endY: number;
		if ('changedTouches' in e) {
			endX = e.changedTouches[0].clientX;
			endY = e.changedTouches[0].clientY;
		} else {
			endX = e.clientX;
			endY = e.clientY;
		}

		const dx = endX - swipeStartX;
		const dy = endY - swipeStartY;
		const threshold = 50;

		let success = false;
		if (step.action === 'swipe-down' && dy > threshold) success = true;
		if (step.action === 'swipe-right' && dx > threshold) success = true;

		if (success) {
			stepAnimating = true;

			// Check if this completes the test
			const test = getCurrentTest();
			const testId = gameState.testSequence[gameState.currentTestIndex];
			if (test && gameState.currentStepIndex >= test.steps.length - 2 && currentSample) {
				stepResultText = currentSample.testResults[testId as TestType] ?? '';
				showStepResult = true;
			}

			setTimeout(() => {
				stepAnimating = false;
				showStepResult = false;
				labStore.completeStep(true);
			}, 500);
		}
	}

	// Plastic type guessing
	const plasticTypes = ['PET', 'HDPE', 'PVC', 'PP', 'PS', 'LDPE'];

	function handleGuess(type: string) {
		labStore.identifySample(type);
	}

	function handleNextSample() {
		labStore.nextSample();
	}

	function goHome() {
		labStore.reset();
		goto('/games');
	}

	function playAgain() {
		labStore.startGame();
	}

	function getActionIcon(action: string): string {
		switch (action) {
			case 'tap': return '👆';
			case 'swipe-down': return '👇';
			case 'swipe-right': return '👉';
			case 'hold': return '✊';
			case 'drag': return '🤏';
			default: return '👆';
		}
	}

	function getActionLabel(action: string): string {
		switch (action) {
			case 'tap': return 'TAP';
			case 'swipe-down': return 'SWIPE ↓';
			case 'swipe-right': return 'SWIPE →';
			case 'hold': return 'HOLD';
			case 'drag': return 'DRAG';
			default: return 'TAP';
		}
	}

	/** Per-test-type accent color & bg for distinct styling */
	function getTestTheme(testId: string): { accent: string; bg: string; glow: string } {
		switch (testId) {
			case 'float': return { accent: '#2196f3', bg: '#e3f2fd', glow: 'rgba(33,150,243,0.3)' };
			case 'bend': return { accent: '#ff9800', bg: '#fff3e0', glow: 'rgba(255,152,0,0.3)' };
			case 'scratch': return { accent: '#e91e63', bg: '#fce4ec', glow: 'rgba(233,30,99,0.3)' };
			case 'transparency': return { accent: '#ffc107', bg: '#fffde7', glow: 'rgba(255,193,7,0.3)' };
			case 'heat': return { accent: '#f44336', bg: '#ffebee', glow: 'rgba(244,67,54,0.3)' };
			default: return { accent: '#74AC4B', bg: '#e8f5e9', glow: 'rgba(116,172,75,0.3)' };
		}
	}

	/** Animated emoji scene for each test type while performing steps */
	function getTestAnimation(testId: string, stepIndex: number): { emoji: string; cssClass: string } {
		switch (testId) {
			case 'float':
				if (stepIndex === 0) return { emoji: '💧🫧💧', cssClass: 'anim-water-fill' };
				if (stepIndex === 1) return { emoji: '💦', cssClass: 'anim-splash' };
				return { emoji: '🫧', cssClass: 'anim-float' };
			case 'bend':
				if (stepIndex === 0) return { emoji: '✊', cssClass: 'anim-grab' };
				if (stepIndex === 1) return { emoji: '↪️', cssClass: 'anim-bend' };
				return { emoji: '🔍', cssClass: 'anim-observe' };
			case 'scratch':
				if (stepIndex === 0) return { emoji: '💅', cssClass: 'anim-position' };
				if (stepIndex === 1) return { emoji: '〰️', cssClass: 'anim-scratch' };
				return { emoji: '🔍', cssClass: 'anim-observe' };
			case 'transparency':
				if (stepIndex === 0) return { emoji: '✊', cssClass: 'anim-grab' };
				if (stepIndex === 1) return { emoji: '☀️', cssClass: 'anim-shine' };
				return { emoji: '✨', cssClass: 'anim-glow' };
			case 'heat':
				if (stepIndex === 0) return { emoji: '🫖♨️', cssClass: 'anim-heat-water' };
				if (stepIndex === 1) return { emoji: '♨️', cssClass: 'anim-dip' };
				return { emoji: '🔍', cssClass: 'anim-observe' };
			default:
				return { emoji: '🧪', cssClass: 'anim-observe' };
		}
	}
</script>

<svelte:head>
	<title>Home Lab - Recycling Challenge</title>
</svelte:head>

<div class="lab-screen">
	<!-- Tutorial Overlay -->
	{#if showTutorial}
		<div class="tutorial-overlay">
			<div class="tutorial-card">
				<h2>🧪 Home Lab</h2>
				<p>You're a plastic detective! Use simple home tests to identify each mystery sample.</p>
				<p>Perform <strong>3 tests</strong> on each sample using Cooking Mama–style controls:</p>
				<div class="tutorial-actions">
					<span class="action-tag">👆 Tap</span>
					<span class="action-tag">👇 Swipe</span>
					<span class="action-tag">✊ Hold</span>
				</div>
				<p>After testing, identify the plastic type. Ready?</p>
				<button class="nine-patch-btn nine-patch-btn-red tutorial-btn" onclick={dismissTutorial}>Let's Start! 🔬</button>
			</div>
		</div>
	{/if}

	<!-- Top Status Bar -->
	<div class="status-bar">
		<button class="home-btn" onclick={goHome}>← Back</button>
		<div class="stat">🏆 {gameState.score}</div>
		<div class="stat">
			{#each Array(gameState.maxLives) as _, i}
				<span class:dimmed={i >= gameState.lives}>❤️</span>
			{/each}
		</div>
		<div class="stat">Sample {gameState.currentSampleIndex + 1}/{gameState.totalSamples}</div>
	</div>

	<!-- Testing Phase -->
	{#if gameState.phase === 'testing'}
		<div class="game-area">
			<!-- Sample card -->
			{#if currentSample}
				<div class="sample-card">
					<span class="sample-icon">{currentSample.icon}</span>
					<div class="sample-info">
						<h3 class="sample-name">{currentSample.name}</h3>
						<p class="sample-subtitle">Mystery Plastic Sample</p>
					</div>
				</div>
			{/if}

			<!-- Test progress dots -->
			<div class="test-progress">
				{#each gameState.testSequence as testSeqId, i}
					{@const test = getTest(testSeqId)}
					{@const dotTheme = getTestTheme(testSeqId)}
					<div
						class="test-dot"
						class:active={i === gameState.currentTestIndex}
						class:completed={i < gameState.currentTestIndex}
						style={i === gameState.currentTestIndex ? `border-color: ${dotTheme.accent}; background: ${dotTheme.bg};` : ''}
					>
						<span class="dot-icon">{test?.icon ?? '?'}</span>
						<span class="dot-label" style={i === gameState.currentTestIndex ? `color: ${dotTheme.accent};` : ''}>{test?.name ?? testSeqId}</span>
					</div>
				{/each}
			</div>

			<!-- Current test card -->
			{#if getCurrentTest() && getCurrentStep()}
				{@const currentTest = getCurrentTest()}
				{@const currentStep = getCurrentStep()}
				{@const testId = gameState.testSequence[gameState.currentTestIndex]}
				{@const theme = getTestTheme(testId)}
				{@const anim = getTestAnimation(testId, gameState.currentStepIndex)}
				<div class="test-card" style="border-color: {theme.accent}; background: {theme.bg};">
					<div class="test-header">
						<span class="test-icon">{currentTest.icon}</span>
						<h3 style="color: {theme.accent};">{currentTest.name}</h3>
					</div>
					<p class="test-description">{currentTest.description}</p>

					<!-- Experiment animation scene -->
					<div class="experiment-scene" style="background: {theme.glow};">
						<span class="scene-emoji {anim.cssClass}">{anim.emoji}</span>
						{#if currentSample}
							<span class="scene-sample">{currentSample.icon}</span>
						{/if}
					</div>

					<!-- Step progress bar -->
					<div class="step-bar">
						{#each currentTest.steps as step, i}
							<div
								class="step-pip"
								class:active={i === gameState.currentStepIndex}
								class:done={i < gameState.currentStepIndex}
								style={i === gameState.currentStepIndex ? `border-color: ${theme.accent}; color: ${theme.accent}; background: ${theme.bg};` : i < gameState.currentStepIndex ? `border-color: ${theme.accent}; background: ${theme.accent};` : ''}
							>
								{i < gameState.currentStepIndex ? '✓' : i + 1}
							</div>
						{/each}
					</div>

					<!-- Step instruction -->
					<div class="step-instruction" style="border-color: {theme.accent}40; background: {theme.bg};">
						<span class="step-action-icon">{currentStep.icon}</span>
						<p>{currentStep.instruction}</p>
					</div>

					<!-- Observations notebook -->
					{#if Object.keys(gameState.testResults).length > 0}
						<div class="notebook">
							<h4>📓 Observations</h4>
							{#each Object.entries(gameState.testResults) as [testId, result]}
								{@const t = getTest(testId)}
								<div class="notebook-entry">
									<span class="nb-icon">{t?.icon ?? '?'}</span>
									<span class="nb-text">{result}</span>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Step Result Text -->
					{#if showStepResult && stepResultText}
						<div class="step-result-bubble">
							<p>{stepResultText}</p>
						</div>
					{/if}

					<!-- Interaction area -->
					<div class="interaction-zone">
						{#if currentStep.action === 'tap'}
							<button
								class="action-btn tap-btn"
								class:animating={stepAnimating}
								onclick={handleTap}
								disabled={stepAnimating}
								style="background: {theme.accent};"
							>
								<span class="action-icon">{getActionIcon(currentStep.action)}</span>
								<span class="action-label">{getActionLabel(currentStep.action)}</span>
								{#if stepAnimating}
									<span class="tap-ripple"></span>
								{/if}
							</button>
						{:else if currentStep.action === 'hold'}
							<button
								class="action-btn hold-btn"
								class:animating={stepAnimating}
								onpointerdown={handleHoldStart}
								onpointerup={handleHoldEnd}
								onpointerleave={handleHoldEnd}
								disabled={false}
							>
								<div class="hold-ring">
									<svg viewBox="0 0 100 100">
										<circle cx="50" cy="50" r="44" fill="none" stroke="#ddd" stroke-width="8" />
										<circle
											cx="50" cy="50" r="44"
											fill="none"
											stroke={theme.accent}
											stroke-width="8"
											stroke-dasharray="{holdProgress * 2.76} 276"
											stroke-linecap="round"
											transform="rotate(-90 50 50)"
										/>
									</svg>
									<span class="hold-icon">{currentStep.icon}</span>
								</div>
								<span class="action-label" style="color: {theme.accent};">{getActionLabel(currentStep.action)}</span>
							</button>
						{:else if currentStep.action === 'swipe-down' || currentStep.action === 'swipe-right'}
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="action-btn swipe-btn"
								class:animating={stepAnimating}
								style="border-color: {theme.accent}; background: {theme.glow};"
								onpointerdown={handleSwipeStart}
								onpointerup={handleSwipeEnd}
								ontouchstart={handleSwipeStart}
								ontouchend={handleSwipeEnd}
							>
								<span class="action-icon swipe-arrow" class:down={currentStep.action === 'swipe-down'}>
									{currentStep.action === 'swipe-down' ? '⬇️' : '➡️'}
								</span>
								<span class="action-label">{getActionLabel(currentStep.action)}</span>
								<div class="swipe-trail" class:vertical={currentStep.action === 'swipe-down'}></div>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Identify Phase -->
	{#if gameState.phase === 'identify'}
		<div class="identify-screen">
			{#if currentSample}
				<div class="identify-sample">
					<span class="big-icon">{currentSample.icon}</span>
					<h2>{currentSample.name}</h2>
				</div>
			{/if}

			<!-- Observations notebook (review) -->
			<div class="notebook review">
				<h4>📓 Your Observations</h4>
				{#each Object.entries(gameState.testResults) as [testId, result]}
					{@const t = getTest(testId)}
					<div class="notebook-entry">
						<span class="nb-icon">{t?.icon ?? '?'}</span>
						<span class="nb-label">{t?.name ?? testId}:</span>
						<span class="nb-text">{result}</span>
					</div>
				{/each}
			</div>

			<h3 class="identify-prompt">What type of plastic is this?</h3>

			<div class="guess-grid">
				{#each plasticTypes as ptype}
					<button class="guess-btn" onclick={() => handleGuess(ptype)}>
						{ptype}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Feedback Phase -->
	{#if gameState.phase === 'feedback'}
		{@const lastResult = gameState.results[gameState.results.length - 1]}
		<div class="feedback-screen">
			<div class="feedback-card" class:correct={lastResult?.isCorrect} class:incorrect={!lastResult?.isCorrect}>
				{#if lastResult?.isCorrect}
					<div class="feedback-icon">✅</div>
					<h2>Correct!</h2>
					<p>It's <strong>{lastResult.correctType}</strong>. Great detective work!</p>
				{:else}
					<div class="feedback-icon">❌</div>
					<h2>Not Quite!</h2>
					<p>This was <strong>{lastResult?.correctType}</strong>, not {lastResult?.playerGuess}.</p>
				{/if}

				{#if currentSample}
					<div class="feedback-detail">
						<p class="feedback-tip">💡 Key clues:</p>
						<ul class="clue-list">
							{#each Object.entries(gameState.testResults) as [testId, result]}
								{@const t = getTest(testId)}
								<li><strong>{t?.name}:</strong> {result}</li>
							{/each}
						</ul>
					</div>
				{/if}

				<button class="nine-patch-btn nine-patch-btn-green next-btn" onclick={handleNextSample}>
					{gameState.lives <= 0 || gameState.currentSampleIndex >= gameState.totalSamples - 1 ? 'See Results' : 'Next Sample →'}
				</button>
			</div>
		</div>
	{/if}

	<!-- Results Phase -->
	{#if gameState.phase === 'results'}
		<div class="results-screen">
			<h1 class="results-title">
				{#if accuracy >= 80}🏆 Lab Expert!{:else if accuracy >= 50}👍 Good Scientist!{:else}💪 Keep Exploring!{/if}
			</h1>

			<div class="results-stats">
				<div class="result-stat">
					<span class="stat-number">{gameState.score}</span>
					<span class="stat-label">Score</span>
				</div>
				<div class="result-stat">
					<span class="stat-number">{accuracy}%</span>
					<span class="stat-label">Accuracy</span>
				</div>
				<div class="result-stat">
					<span class="stat-number">{gameState.results.filter(r => r.isCorrect).length}/{gameState.results.length}</span>
					<span class="stat-label">Correct</span>
				</div>
			</div>

			<div class="results-list">
				{#each gameState.results as result}
					<div class="result-row" class:correct={result.isCorrect} class:incorrect={!result.isCorrect}>
						<span class="result-icon">{result.isCorrect ? '✅' : '❌'}</span>
						<span class="result-item">{result.sampleId}</span>
						<span class="result-answer">Guessed: {result.playerGuess}</span>
						<span class="result-correct">Was: {result.correctType}</span>
					</div>
				{/each}
			</div>

			<div class="results-buttons">
				<p class="auto-return">Returning to menu in {autoReturnCountdown}s...</p>
				<button class="nine-patch-btn nine-patch-btn-green" onclick={playAgain}>🔄 Play Again</button>
				<button class="nine-patch-btn nine-patch-btn-red" onclick={goHome}>🏠 Game Menu</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.lab-screen {
		min-height: 100vh;
		min-height: 100dvh;
		background: linear-gradient(180deg, #fdf6e3 0%, #fce9cc 50%, #f5deb3 100%);
		display: flex;
		flex-direction: column;
		position: relative;
		overflow-x: hidden;
	}

	/* Tutorial */
	.tutorial-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.75);
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.tutorial-card {
		border-style: solid;
		border-width: 48px 40px 44px 40px;
		border-image-source: url('/assets/box/msg_box.png');
		border-image-slice: 13% 8% 12% 8% fill;
		border-image-repeat: stretch;
		border-radius: 0;
		background: none;
		padding: 1.5rem;
		max-width: 420px;
		text-align: center;
		box-shadow: 6px 6px 0 rgba(0,0,0,0.35);
		color: var(--color-cream, #FCE9CC);
	}

	.tutorial-card h2 {
		font-size: 1.8rem;
		margin: 0 0 0.8rem 0;
		color: white;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
	}

	.tutorial-card p {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.5;
		margin: 0 0 0.6rem 0;
	}

	.tutorial-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		flex-wrap: wrap;
		margin: 0.8rem 0;
	}

	.action-tag {
		padding: 0.4rem 0.8rem;
		border: 2px solid black;
		border-radius: 10px;
		font-size: 0.9rem;
		font-weight: 700;
		background: #e8f5e9;
	}

	/* Tutorial button uses global nine-patch-btn */
	.tutorial-btn {
		margin-top: 0.5rem;
		font-size: 1.1rem;
	}

	/* Status Bar */
	.status-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 1rem;
		background: rgba(60,81,66,0.9);
		border-bottom: 3px solid var(--color-dark-green, #3C5142);
		flex-shrink: 0;
	}

	.home-btn {
		background: rgba(255,255,255,0.15);
		color: white;
		border: 2px solid rgba(255,255,255,0.3);
		border-radius: 8px;
		padding: 0.3rem 0.8rem;
		font-weight: 700;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.stat {
		color: white;
		font-weight: 700;
		font-size: 1rem;
	}

	.dimmed { opacity: 0.25; }

	/* Game Area */
	.game-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0.8rem 1rem;
		gap: 0.6rem;
		overflow-y: auto;
	}

	/* Sample Card */
	.sample-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: white;
		border: 3px solid black;
		border-radius: 16px;
		padding: 0.8rem 1rem;
		box-shadow: 4px 4px 0 rgba(0,0,0,0.15);
	}

	.sample-icon {
		font-size: 2.8rem;
	}

	.sample-info {
		flex: 1;
	}

	.sample-name {
		font-size: 1.1rem;
		font-weight: 800;
		margin: 0;
		color: #1a1a1a;
	}

	.sample-subtitle {
		font-size: 0.8rem;
		color: #888;
		margin: 0.1rem 0 0 0;
		font-style: italic;
	}

	/* Test Progress */
	.test-progress {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.test-dot {
		padding: 0.3rem 0.5rem;
		border-radius: 10px;
		border: 2px solid transparent;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		opacity: 0.4;
		transition: opacity 0.3s, transform 0.3s;
	}

	.test-dot.active {
		opacity: 1;
		transform: scale(1.15);
	}

	.test-dot.completed {
		opacity: 0.7;
	}

	.dot-icon { font-size: 1.4rem; }

	.dot-label {
		font-size: 0.6rem;
		font-weight: 700;
		color: #555;
		text-align: center;
		max-width: 60px;
	}

	/* Test Card */
	.test-card {
		background: white;
		border: 4px solid black;
		border-radius: 20px;
		padding: 1rem 1.2rem;
		box-shadow: 6px 6px 0 rgba(0,0,0,0.15);
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		transition: border-color 0.3s, background 0.3s;
	}

	.test-header {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.test-icon { font-size: 1.8rem; }

	.test-header h3 {
		font-size: 1.2rem;
		font-weight: 800;
		margin: 0;
		color: var(--color-dark-green, #3C5142);
	}

	.test-description {
		font-size: 0.85rem;
		color: #666;
		margin: 0;
		line-height: 1.4;
	}

	/* Step bar */
	.step-bar {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
	}

	.step-pip {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 3px solid #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 0.85rem;
		color: #999;
		background: #f5f5f5;
		transition: all 0.3s;
	}

	.step-pip.active {
		border-color: var(--color-green, #74AC4B);
		color: var(--color-green, #74AC4B);
		background: #e8f5e9;
		transform: scale(1.2);
	}

	.step-pip.done {
		border-color: var(--color-green, #74AC4B);
		background: var(--color-green, #74AC4B);
		color: white;
	}

	/* Step instruction */
	.step-instruction {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		background: #f0f7ff;
		border: 2px solid #b3d4fc;
		border-radius: 12px;
		padding: 0.6rem 1rem;
	}

	.step-action-icon {
		font-size: 1.6rem;
	}

	.step-instruction p {
		font-size: 0.95rem;
		font-weight: 600;
		color: #333;
		margin: 0;
	}

	/* Notebook */
	.notebook {
		background: #fffde7;
		border: 2px solid #ffe082;
		border-radius: 10px;
		padding: 0.6rem 0.8rem;
	}

	.notebook h4 {
		margin: 0 0 0.3rem 0;
		font-size: 0.85rem;
		color: #666;
	}

	.notebook-entry {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		padding: 0.15rem 0;
		color: #444;
	}

	.nb-icon { font-size: 1rem; }
	.nb-label { font-weight: 700; white-space: nowrap; }
	.nb-text { flex: 1; }

	/* Step Result Bubble */
	.step-result-bubble {
		background: var(--color-georgia-green, #A4CDA8);
		border: 3px solid var(--color-dark-green, #3C5142);
		border-radius: 14px;
		padding: 0.6rem 1rem;
		animation: bubblePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.step-result-bubble p {
		margin: 0;
		font-weight: 700;
		font-size: 0.95rem;
		color: #1a1a1a;
		text-align: center;
	}

	@keyframes bubblePop {
		from { transform: scale(0.7); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	/* Interaction Zone */
	.interaction-zone {
		display: flex;
		justify-content: center;
		

	/* Experiment Scene */
	.experiment-scene {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		height: 70px;
		border-radius: 14px;
		position: relative;
		overflow: hidden;
	}

	.scene-emoji {
		font-size: 2rem;
		z-index: 1;
	}

	.scene-sample {
		font-size: 2.2rem;
		z-index: 1;
	}
	position: relative;
		overflow: visible;
	
	/* Experiment animations */
	.anim-water-fill { animation: waterFill 1.5s ease infinite; }
	.anim-splash { animation: splash 0.6s ease-out; }
	.anim-float { animation: floatBob 2s ease-in-out infinite; }
	.anim-grab { animation: grabPulse 0.8s ease infinite; }
	.anim-bend { animation: bendWiggle 1s ease infinite; }
	.anim-observe { animation: observeLook 1.5s ease infinite; }
	.anim-position { animation: grabPulse 0.8s ease infinite; }
	.anim-scratch { animation: scratchMove 0.8s ease infinite; }
	.anim-shine { animation: shineGlow 1.5s ease infinite; }
	.anim-glow { animation: sparkle 1s ease infinite; }
	.anim-heat-water { animation: heatSteam 1.2s ease infinite; }
	.anim-dip { animation: dipDown 1s ease infinite; }

	@keyframes waterFill {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}

	@keyframes splash {
		0% { transform: scale(0.5); opacity: 0; }
		40% { transform: scale(1.3); opacity: 1; }
		100% { transform: scale(1); opacity: 1; }
	}

	@keyframes floatBob {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-8px); }
	}

	@keyframes grabPulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.15); }
	}

	@keyframes bendWiggle {
		0%, 100% { transform: rotate(0deg); }
		25% { transform: rotate(8deg); }
		75% { transform: rotate(-8deg); }
	}

	@keyframes observeLook {
		0%, 100% { transform: translateX(0); }
		30% { transform: translateX(-5px); }
		70% { transform: translateX(5px); }
	}

	@keyframes scratchMove {
		0%, 100% { transform: translateX(0); }
		50% { transform: translateX(12px); }
	}

	@keyframes shineGlow {
		0%, 100% { filter: brightness(1); transform: scale(1); }
		50% { filter: brightness(1.6); transform: scale(1.1); }
	}

	@keyframes sparkle {
		0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
		50% { opacity: 0.6; transform: scale(1.2) rotate(15deg); }
	}

	@keyframes heatSteam {
		0% { transform: translateY(0); opacity: 1; }
		100% { transform: translateY(-6px); opacity: 0.5; }
	}

	@keyframes dipDown {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(6px); }
	}

	/* Tap ripple */
	.tap-ripple {
		position: absolute;
		inset: -10px;
		border-radius: 50%;
		border: 3px solid rgba(255,255,255,0.6);
		animation: rippleExpand 0.6s ease-out forwards;
		pointer-events: none;
	}

	@keyframes rippleExpand {
		from { transform: scale(0.5); opacity: 1; }
		to { transform: scale(1.5); opacity: 0; }
	}padding: 0.5rem 0;
	}

	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		touch-action: none;
	}

	/* Tap Button */
	.tap-btn {
		background: var(--color-green, #74AC4B);
		border: 4px solid black;
		border-radius: 50%;
		width: 100px;
		height: 100px;
		justify-content: center;
		box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
		transition: all 0.15s;
	}

	.tap-btn:active, .tap-btn.animating {
		transform: scale(0.9);
		box-shadow: 2px 2px 0 rgba(0,0,0,0.3);
	}

	.tap-btn .action-icon {
		font-size: 2rem;
	}

	.tap-btn .action-label {
		font-size: 0.75rem;
		font-weight: 800;
		color: white;
	}

	/* Hold Button */
	.hold-btn {
		background: none;
		border: none;
		padding: 0;
	}

	.hold-ring {
		width: 100px;
		height: 100px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hold-ring svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.hold-icon {
		font-size: 2rem;
		z-index: 1;
	}

	.hold-btn .action-label {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-dark-green, #3C5142);
	}

	/* Swipe Area */
	.swipe-btn {
		background: rgba(116,172,75,0.15);
		border: 3px dashed var(--color-green, #74AC4B);
		border-radius: 20px;
		width: 180px;
		height: 120px;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.swipe-btn.animating {
		background: rgba(116,172,75,0.3);
	}

	.swipe-arrow {
		font-size: 2rem;
		animation: swipeHint 1.5s ease infinite;
	}

	.swipe-arrow.down {
		animation: swipeHintDown 1.5s ease infinite;
	}

	@keyframes swipeHint {
		0%, 100% { transform: translateX(0); opacity: 1; }
		50% { transform: translateX(15px); opacity: 0.5; }
	}

	@keyframes swipeHintDown {
		0%, 100% { transform: translateY(0); opacity: 1; }
		50% { transform: translateY(15px); opacity: 0.5; }
	}

	.action-label {
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--color-dark-green, #3C5142);
	}

	.swipe-trail {
		position: absolute;
		background: linear-gradient(90deg, transparent, rgba(116,172,75,0.3), transparent);
		height: 4px;
		width: 60%;
		bottom: 25%;
		border-radius: 2px;
	}

	.swipe-trail.vertical {
		width: 4px;
		height: 60%;
		left: 50%;
		bottom: auto;
		background: linear-gradient(180deg, transparent, rgba(116,172,75,0.3), transparent);
	}

	/* Identify Screen */
	.identify-screen {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem 1rem;
		gap: 1rem;
		overflow-y: auto;
	}

	.identify-sample {
		text-align: center;
	}

	.big-icon { font-size: 3rem; }

	.identify-sample h2 {
		font-size: 1.3rem;
		font-weight: 800;
		margin: 0.3rem 0 0 0;
		color: #1a1a1a;
	}

	.notebook.review {
		width: 100%;
		max-width: 380px;
	}

	.identify-prompt {
		font-size: 1.1rem;
		font-weight: 800;
		color: var(--color-dark-green, #3C5142);
		margin: 0;
	}

	.guess-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0.6rem;
		width: 100%;
		max-width: 340px;
	}

	.guess-btn {
		padding: 0.8rem 0.5rem;
		background: white;
		border: 3px solid black;
		border-radius: 12px;
		font-weight: 800;
		font-size: 1rem;
		cursor: pointer;
		box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
		transition: all 0.15s;
	}

	.guess-btn:active {
		transform: translate(3px, 3px);
		box-shadow: 0 0 0 rgba(0,0,0,0.2);
	}

	/* Feedback Screen */
	.feedback-screen {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.feedback-card {
		border-style: solid;
		border-width: 48px 40px 44px 40px;
		border-image-source: url('/assets/box/msg_box.png');
		border-image-slice: 13% 8% 12% 8% fill;
		border-image-repeat: stretch;
		border-radius: 0;
		background: none;
		padding: 1.5rem;
		max-width: 400px;
		width: 100%;
		text-align: center;
		box-shadow: 6px 6px 0 rgba(0,0,0,0.35);
		animation: feedbackPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		color: var(--color-cream, #FCE9CC);
	}

	@keyframes feedbackPop {
		from { transform: scale(0.8); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	.feedback-card.correct {
		/* chalkboard handles the border */
	}

	.feedback-card.incorrect {
		/* chalkboard handles the border */
	}

	.feedback-icon { font-size: 2.5rem; }

	.feedback-card h2 {
		font-size: 1.5rem;
		margin: 0.3rem 0;
		color: white;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
	}

	.feedback-card p {
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.85);
		margin: 0.2rem 0;
	}

	.feedback-detail {
		margin-top: 0.8rem;
		text-align: left;
	}

	.feedback-tip {
		font-weight: 700;
		margin-bottom: 0.3rem;
	}

	.clue-list {
		margin: 0;
		padding-left: 1.2rem;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.6;
	}

	/* Next button uses global nine-patch-btn */
	.next-btn {
		margin-top: 1rem;
		font-size: 1rem;
	}

	/* Results */
	.results-screen {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		gap: 1rem;
		overflow-y: auto;
	}

	.results-title {
		font-size: 2rem;
		font-weight: 900;
		color: var(--color-dark-green, #3C5142);
		text-shadow: 2px 2px 0 rgba(0,0,0,0.1);
		margin: 0;
	}

	.results-stats {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.result-stat {
		background: white;
		border: 3px solid black;
		border-radius: 14px;
		padding: 0.8rem 1rem;
		text-align: center;
		min-width: 80px;
		box-shadow: 3px 3px 0 rgba(0,0,0,0.1);
	}

	.stat-number {
		display: block;
		font-size: 1.6rem;
		font-weight: 900;
		color: var(--color-green, #74AC4B);
	}

	.stat-label {
		font-size: 0.8rem;
		color: #888;
		font-weight: 600;
	}

	.results-list {
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.result-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.8rem;
		border-radius: 8px;
		font-size: 0.85rem;
		color: #333;
	}

	.result-row.correct { background: rgba(200,230,201,0.9); }
	.result-row.incorrect { background: rgba(255,205,210,0.9); }

	.result-icon { font-size: 1rem; }
	.result-item { flex: 1; font-weight: 700; }
	.result-answer { font-size: 0.75rem; color: #666; }
	.result-correct { font-size: 0.75rem; color: #999; }

	.results-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.8rem;
		margin-top: 0.5rem;
	}

	.auto-return {
		font-size: 0.85rem;
		color: rgba(0,0,0,0.4);
		margin: 0;
	}

	/* Results buttons use global nine-patch-btn */
	.results-buttons :global(.nine-patch-btn) {
		font-size: 1rem;
	}
</style>
