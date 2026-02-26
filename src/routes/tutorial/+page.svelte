<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { gameStore } from '$lib/stores/gameStore';

	let currentStep = $state(0);
	const totalSteps = 4;

	let touchStartX = 0;

	const steps = [
		{
			title: 'Welcome!',
			description: 'Explore the house and find items to recycle',
			emoji: '👋',
			bgColor: '#e8f5e9'
		},
		{
			title: 'Explore the Map',
			description: 'Tap on different rooms of the house to zoom in and explore',
			emoji: '🗺️',
			bgColor: '#fff3e0'
		},
		{
			title: 'Find & Inspect',
			description: 'Tap on items scattered around each area to inspect them',
			emoji: '🔍',
			bgColor: '#e3f2fd',
			showExample: true
		},
		{
			title: "Let's Go!",
			description: 'Decide if each item is recyclable or not. Ready?',
			emoji: '🎮',
			bgColor: '#fce4ec'
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
		gameStore.startGame();
		goto('/game');
	}

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

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') nextStep();
		if (e.key === 'ArrowLeft') prevStep();
		if (e.key === 'Enter' && currentStep === totalSteps - 1) startGame();
	}
</script>

<svelte:head>
	<title>How to Play - Recycling Challenge</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div
	class="tutorial-screen"
	style="background: {steps[currentStep].bgColor}"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	role="region"
	aria-label="Tutorial"
>
	<!-- Skip Button -->
	<button class="skip-button" onclick={startGame}> Skip Tutorial </button>

	<!-- Progress Dots -->
	<div class="progress-bar">
		{#each Array(totalSteps) as _, i}
			<button
				class="progress-dot"
				class:active={i === currentStep}
				class:completed={i < currentStep}
				onclick={() => (currentStep = i)}
				aria-label="Go to step {i + 1}"
			></button>
		{/each}
	</div>

	<!-- Content -->
	<div class="tutorial-content">
		{#key currentStep}
			<div class="step-content">
				<!-- Emoji Icon -->
				<div class="step-emoji">
					{steps[currentStep].emoji}
				</div>

				<!-- Title -->
				<h2 class="step-title">{steps[currentStep].title}</h2>

				<!-- Description -->
				<p class="step-description">{steps[currentStep].description}</p>

				<!-- Bins Example (Step 3) -->
				{#if steps[currentStep].showExample}
					<div class="example-popup">
						<div class="example-item-card">
							<span class="example-icon">🍾</span>
							<span class="example-name">Glass Bottle</span>
						</div>
						<div class="example-buttons">
							<div class="nine-patch-btn nine-patch-btn-green example-btn">♻️ Recyclable</div>
							<div class="nine-patch-btn nine-patch-btn-red example-btn">🚫 Not</div>
						</div>
					</div>
				{/if}
			</div>
		{/key}
	</div>

	<!-- Navigation -->
	<div class="tutorial-navigation">
		{#if currentStep > 0}
		<button class="nav-button nine-patch-btn nine-patch-btn-blue secondary" onclick={prevStep}> ← Back </button>
		{:else}
			<div class="nav-spacer"></div>
		{/if}

		{#if currentStep < totalSteps - 1}
			<button class="nav-button nine-patch-btn nine-patch-btn-green primary" onclick={nextStep}> Next → </button>
		{:else}
			<button class="nav-button nine-patch-btn nine-patch-btn-red start" onclick={startGame}>
				<span>START GAME!</span>
				<span class="play-icon">▶️</span>
			</button>
		{/if}
	</div>

	<!-- Swipe Hint -->
	<p class="swipe-hint">← Swipe to navigate →</p>
</div>

<style>
	.tutorial-screen {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		padding: 2rem;
		position: relative;
		transition: background 0.4s ease;
	}

	.skip-button {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		background: transparent;
		border: none;
		color: #666;
		font-size: 1rem;
		text-decoration: underline;
		cursor: pointer;
		z-index: 10;
	}

	.progress-bar {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin: 2rem 0;
	}

	.progress-dot {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.2);
		border: 3px solid black;
		cursor: pointer;
		transition: all 0.3s;
		padding: 0;
	}

	.progress-dot.active {
		background: #ed1c24;
		transform: scale(1.4);
	}

	.progress-dot.completed {
		background: #00a651;
	}

	.tutorial-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 700px;
		margin: 0 auto;
		width: 100%;
	}

	.step-content {
		text-align: center;
		width: 100%;
		animation: fadeIn 0.4s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.step-emoji {
		font-size: 100px;
		margin-bottom: 1.5rem;
		animation: bounce 2s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-15px);
		}
	}

	.step-title {
		font-size: 3rem;
		font-weight: 900;
		color: #333;
		margin: 0 0 1rem 0;
		text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
	}

	.step-description {
		font-size: 1.5rem;
		color: #555;
		margin: 0;
		line-height: 1.6;
		max-width: 500px;
		margin: 0 auto;
	}

	/* Example Popup */
	.example-popup {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
	}

	.example-item-card {
		border-style: solid;
		border-width: 36px 30px 32px 30px;
		border-image-source: url('/assets/box/msg_box.png');
		border-image-slice: 13% 8% 12% 8% fill;
		border-image-repeat: stretch;
		border-radius: 0;
		background: none;
		padding: 1rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.35);
		color: var(--color-cream, #FCE9CC);
	}

	.example-icon {
		font-size: 3rem;
	}

	.example-name {
		font-size: 1.2rem;
		font-weight: bold;
	}

	.example-buttons {
		display: flex;
		gap: 1rem;
	}

	/* Example buttons use global nine-patch-btn */
	.example-btn {
		padding: 0.5rem 0.8rem;
		font-size: 0.9rem;
	}

	.example-btn.green {
		/* handled by nine-patch-btn-green */
	}

	.example-btn.red {
		/* handled by nine-patch-btn-red */
	}

	/* Navigation */
	.tutorial-navigation {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 2rem;
		padding: 0 1rem;
	}

	.nav-spacer {
		width: 120px;
	}

	/* Nav buttons use global nine-patch-btn */
	.nav-button {
		font-size: 1.3rem;
		padding: 0.8rem 1.5rem;
	}

	.nav-button.primary {
		/* green via nine-patch-btn-green */
	}

	.nav-button.secondary {
		/* blue via nine-patch-btn-blue */
	}

	.nav-button.start {
		/* red via nine-patch-btn-red */
		font-size: 1.5rem;
		padding: 1rem 2rem;
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 5px 5px 0 black;
		}
		50% {
			box-shadow:
				5px 5px 0 black,
				0 0 20px rgba(237, 28, 36, 0.5);
		}
	}

	.nav-button:hover {
		transform: scale(1.05) translateY(-2px);
	}

	.nav-button:active {
		transform: scale(0.95);
	}

	.play-icon {
		font-size: 1.5rem;
	}

	.swipe-hint {
		text-align: center;
		color: #999;
		font-size: 0.9rem;
		margin-top: 1.5rem;
	}

	/* iPad Portrait */
	@media (max-width: 1024px) and (orientation: portrait) {
		.step-title {
			font-size: 2.5rem;
		}

		.step-description {
			font-size: 1.3rem;
		}

		.step-emoji {
			font-size: 80px;
		}
	}

	/* iPad Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.step-title {
			font-size: 2rem;
		}

		.step-description {
			font-size: 1.1rem;
		}

		.step-emoji {
			font-size: 60px;
			margin-bottom: 1rem;
		}

		.example-popup {
			margin-top: 1.5rem;
		}

		.example-item-card {
			padding: 1rem;
		}
	}
</style>
