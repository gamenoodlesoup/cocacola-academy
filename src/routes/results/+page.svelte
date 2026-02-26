<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { gameStore, accuracy, correctCount, getAreas } from '$lib/stores/gameStore';
	import type { IdentifiedItem } from '$lib/types';
	import itemsData from '$lib/data/items.json';

	let displayScore = $state(0);
	let displayAccuracy = $state(0);
	let showStars = $state(false);
	let showButtons = $state(false);
	let animationComplete = $state(false);
	let autoReturnCountdown = $state(5);
	let autoReturnTimer: ReturnType<typeof setInterval> | null = null;

	// Get final values from store
	let finalScore = $state(0);
	let finalAccuracy = $state(0);
	let finalCorrect = $state(0);
	let totalItems = $state(0);
	let completedAreas = $state(0);
	let totalAreas = getAreas().length;
	let identifiedItems = $state<Record<string, IdentifiedItem>>({});

	let funFactItem = $derived.by(() => {
		const ids = Object.keys(identifiedItems);
		if (ids.length === 0) return null;
		const randomId = ids[Math.floor(Math.random() * ids.length)];
		return itemsData.find((i: any) => i.id === randomId) ?? null;
	});

	onMount(() => {
		const unsubGame = gameStore.subscribe((s) => {
			finalScore = s.score;
			totalItems = s.totalItems;
			completedAreas = s.completedAreas.length;
			identifiedItems = s.identifiedItems;
		});

		const unsubAccuracy = accuracy.subscribe((a) => {
			finalAccuracy = a;
		});

		const unsubCorrect = correctCount.subscribe((c) => {
			finalCorrect = c;
		});

		const startDelay = setTimeout(() => {
			animateScore();
			// Start auto-return countdown
			autoReturnTimer = setInterval(() => {
				autoReturnCountdown -= 1;
				if (autoReturnCountdown <= 0) {
					if (autoReturnTimer) clearInterval(autoReturnTimer);
					gameStore.reset();
					goto('/games');
				}
			}, 1000);
		}, 500);

		return () => {
			unsubGame();
			unsubAccuracy();
			unsubCorrect();
			clearTimeout(startDelay);
			if (autoReturnTimer) clearInterval(autoReturnTimer);
		};
	});

	function animateScore() {
		const scoreDuration = 1500;
		const accuracyDuration = 1000;
		const scoreStart = Date.now();

		function updateScore() {
			const elapsed = Date.now() - scoreStart;
			const progress = Math.min(elapsed / scoreDuration, 1);

			// Ease out cubic
			const eased = 1 - Math.pow(1 - progress, 3);
			displayScore = Math.floor(finalScore * eased);

			if (progress < 1) {
				requestAnimationFrame(updateScore);
			} else {
				displayScore = finalScore;
				animateAccuracy();
			}
		}

		function animateAccuracy() {
			const accuracyStart = Date.now();

			function updateAccuracy() {
				const elapsed = Date.now() - accuracyStart;
				const progress = Math.min(elapsed / accuracyDuration, 1);

				const eased = 1 - Math.pow(1 - progress, 3);
				displayAccuracy = Math.floor(finalAccuracy * eased);

				if (progress < 1) {
					requestAnimationFrame(updateAccuracy);
				} else {
					displayAccuracy = finalAccuracy;
					showStars = true;
					setTimeout(() => {
						showButtons = true;
						animationComplete = true;
					}, 500);
				}
			}

			updateAccuracy();
		}

		updateScore();
	}

	function getStarCount(acc: number): number {
		if (acc >= 90) return 3;
		if (acc >= 70) return 2;
		if (acc >= 50) return 1;
		return 0;
	}

	function getMessage(acc: number): string {
		if (acc >= 90) return 'Recycling Superstar! 🌟';
		if (acc >= 70) return 'Great Job! 🎉';
		if (acc >= 50) return 'Good Effort! 👍';
		return 'Keep Practicing! 💪';
	}

	function playAgain() {
		if (autoReturnTimer) clearInterval(autoReturnTimer);
		gameStore.reset();
		gameStore.startGame();
		goto('/game');
	}

	function goHome() {
		if (autoReturnTimer) clearInterval(autoReturnTimer);
		gameStore.reset();
		goto('/games');
	}
</script>

<svelte:head>
	<title>Results - Recycling Challenge</title>
</svelte:head>

<div class="results-screen">
	<div class="results-card">
		<!-- Header -->
		<h1 class="title">Game Complete!</h1>

		<!-- Score Counter -->
		<div class="score-section">
			<div class="score-label">Final Score</div>
			<div class="score-value">{displayScore}</div>
		</div>

		<!-- Stats Row -->
		<div class="stats-row">
			<div class="stat-box">
				<span class="stat-icon">🎯</span>
				<span class="stat-value">{displayAccuracy}%</span>
				<span class="stat-label">Accuracy</span>
			</div>
			<div class="stat-box">
				<span class="stat-icon">✅</span>
				<span class="stat-value">{finalCorrect}/{totalItems}</span>
				<span class="stat-label">Correct</span>
			</div>
			<div class="stat-box">
				<span class="stat-icon">🗺️</span>
				<span class="stat-value">{completedAreas}/{totalAreas}</span>
				<span class="stat-label">Areas</span>
			</div>
		</div>

		<!-- Stars -->
		<div class="stars-container" class:show={showStars}>
			{#each Array(3) as _, i}
				<span
					class="star"
					class:earned={i < getStarCount(displayAccuracy)}
					style="animation-delay: {i * 0.15}s"
				>
					{i < getStarCount(displayAccuracy) ? '⭐' : '☆'}
				</span>
			{/each}
		</div>

		<!-- Message -->
		<p class="message" class:show={showStars}>
			{getMessage(displayAccuracy)}
		</p>

		<!-- Fun Fact -->
		{#if funFactItem}
			<div class="fun-fact" class:show={animationComplete}>
				<span class="fact-icon">💡</span>
				<p class="fact-text">
					Did you know? {funFactItem.funFact || "Recycling one aluminum can saves enough energy to run a TV for 3 hours!"}
				</p>
			</div>
		{/if}

		<!-- Buttons -->
		<div class="buttons" class:show={showButtons}>
			<p class="auto-return">Returning to menu in {autoReturnCountdown}s...</p>
			<button class="nine-patch-btn nine-patch-btn-green" onclick={playAgain}>
				🔄 Play Again
			</button>
			<button class="nine-patch-btn nine-patch-btn-red" onclick={goHome}>
				🏠 Game Menu
			</button>
		</div>
	</div>

	<!-- Confetti Effect for high scores -->
	{#if showStars && getStarCount(displayAccuracy) >= 2}
		<div class="confetti">
			{#each Array(20) as _, i}
				<span
					class="confetti-piece"
					style="
						left: {Math.random() * 100}%;
						animation-delay: {Math.random() * 2}s;
					background: {['var(--color-coca-cola-red, #DF1725)', 'var(--color-green, #74AC4B)', 'var(--color-yellow, #F8C226)', '#2196f3'][i % 4]};
					"
				></span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.results-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		height: 100dvh;
		max-width: 100vw;
		background: linear-gradient(135deg, var(--color-dark-green, #3C5142) 0%, var(--color-green, #74AC4B) 100%);
		padding: 2rem;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
	}

	.results-card {
		border-style: solid;
		border-width: 48px 40px 44px 40px;
		border-image-source: url('/assets/box/msg_box.png');
		border-image-slice: 13% 8% 12% 8% fill;
		border-image-repeat: stretch;
		border-radius: 0;
		background: none;
		padding: 2rem;
		text-align: center;
		box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.35);
		max-width: 500px;
		width: 100%;
		position: relative;
		z-index: 2;
		animation: cardSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		color: var(--color-cream, #FCE9CC);
	}

	@keyframes cardSlideIn {
		from {
			transform: translateY(50px) scale(0.9);
			opacity: 0;
		}
		to {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}

	.title {
		font-size: 2.5rem;
		margin: 0 0 1.5rem 0;
		color: white;
		text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
		animation: titlePop 0.5s 0.3s both;
	}

	@keyframes titlePop {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}

	.score-section {
		margin-bottom: 1.5rem;
	}

	.score-label {
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 0.5rem;
	}

	.score-value {
		font-size: 5rem;
		font-weight: bold;
		color: var(--color-coca-cola-red, #DF1725);
		line-height: 1;
		text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.stats-row {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 1.5rem;
	}

	.stat-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 1.5rem;
		background: rgba(0, 0, 0, 0.2);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 15px;
	}

	.stat-box .stat-icon {
		font-size: 2rem;
		margin-bottom: 0.3rem;
	}

	.stat-box .stat-value {
		font-size: 1.8rem;
		font-weight: bold;
		color: var(--color-yellow, #F8C226);
	}

	.stat-box .stat-label {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.stars-container {
		margin: 1.5rem 0;
		opacity: 0;
		transform: scale(0.5);
		transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.stars-container.show {
		opacity: 1;
		transform: scale(1);
	}

	.star {
		font-size: 4rem;
		display: inline-block;
		margin: 0 0.3rem;
		animation: starPop 0.4s both;
	}

	.star.earned {
		filter: drop-shadow(0 0 10px gold);
	}

	@keyframes starPop {
		0% {
			transform: scale(0) rotate(-180deg);
		}
		70% {
			transform: scale(1.3) rotate(10deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
		}
	}

	.message {
		font-size: 1.8rem;
		font-weight: bold;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
		margin: 1rem 0;
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.5s 0.3s;
	}

	.message.show {
		opacity: 1;
		transform: translateY(0);
	}

	.fun-fact {
		background: linear-gradient(135deg, #e8f5e9 0%, var(--color-georgia-green, #A4CDA8) 100%);
		border: 3px solid var(--color-green, #74AC4B);
		border-radius: 15px;
		padding: 1rem;
		margin: 1.5rem 0;
		display: flex;
		align-items: flex-start;
		gap: 0.8rem;
		text-align: left;
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.5s;
	}

	.fun-fact.show {
		opacity: 1;
		transform: translateY(0);
	}

	.fact-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.fact-text {
		margin: 0;
		font-size: 1rem;
		color: #333;
		line-height: 1.4;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.5rem;
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.5s;
	}

	.buttons.show {
		opacity: 1;
		transform: translateY(0);
	}

	/* Results buttons use global .nine-patch-btn classes */
	.buttons :global(.nine-patch-btn) {
		font-size: 1.4rem;
	}

	.auto-return {
		font-size: 0.9rem;
		color: rgba(255,255,255,0.6);
		margin: 0 0 0.5rem 0;
		text-align: center;
	}

	/* Confetti */
	.confetti {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 1;
	}

	.confetti-piece {
		position: absolute;
		top: -20px;
		width: 10px;
		height: 20px;
		border-radius: 50%;
		animation: confettiFall 3s linear infinite;
	}

	@keyframes confettiFall {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 1;
		}
		100% {
			transform: translateY(100vh) rotate(720deg);
			opacity: 0;
		}
	}

	/* iPad Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.results-card {
			padding: 1.5rem;
			max-width: 600px;
		}

		.title {
			font-size: 2rem;
			margin-bottom: 1rem;
		}

		.score-value {
			font-size: 3.5rem;
		}

		.stats-row {
			margin-bottom: 1rem;
		}

		.stars-container {
			margin: 1rem 0;
		}

		.star {
			font-size: 3rem;
		}

		.message {
			font-size: 1.4rem;
		}

		.fun-fact {
			margin: 1rem 0;
		}

		.buttons {
			flex-direction: row;
			justify-content: center;
		}

		.btn-play-again,
		.btn-home {
			padding: 1rem 1.5rem;
			font-size: 1.2rem;
		}
	}

	/* Small screens */
	@media (max-width: 400px) {
		.results-card {
			padding: 1.5rem;
		}

		.score-value {
			font-size: 4rem;
		}

		.star {
			font-size: 3rem;
		}
	}
</style>
