<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { gameStore, feedbackStore, accuracy, timeElapsed, getItemsForArea, getItemById, getAreas } from '$lib/stores/gameStore';
	import TopBar from '$lib/components/game/TopBar.svelte';
	import MapOverview from '$lib/components/game/MapOverview.svelte';
	import AreaScene from '$lib/components/game/AreaScene.svelte';
	import ItemPopup from '$lib/components/game/ItemPopup.svelte';
	import FeedbackAnimation from '$lib/components/game/FeedbackAnimation.svelte';
	import type { Area, GameState, FeedbackState } from '$lib/types';

	let showPauseMenu = $state(false);
	let itemPopupStartTime = $state(Date.now());
	let isZooming = $state(false);

	const areas = getAreas();

	// Reactive store subscriptions using $state + $effect
	let gameState = $state<GameState>(get(gameStore));
	let feedbackState = $state<FeedbackState>(get(feedbackStore));
	let currentAccuracy = $state(0);
	let elapsedSeconds = $state(0);

	$effect(() => {
		const unsub = gameStore.subscribe((s) => { gameState = s; });
		return unsub;
	});

	$effect(() => {
		const unsub = feedbackStore.subscribe((s) => { feedbackState = s; });
		return unsub;
	});

	$effect(() => {
		const unsub = accuracy.subscribe((a) => { currentAccuracy = a; });
		return unsub;
	});

	// Tick timer every second
	let timerTick: ReturnType<typeof setInterval> | null = null;
	$effect(() => {
		if (gameState.isPlaying && !gameState.isPaused) {
			timerTick = setInterval(() => {
				elapsedSeconds = get(timeElapsed);
			}, 1000);
			return () => { if (timerTick) clearInterval(timerTick); };
		}
	});

	// Current area object
	let currentArea = $derived<Area | undefined>(
		gameState.currentArea ? areas.find((a) => a.id === gameState.currentArea) : undefined
	);

	// Items for current area
	let currentAreaItems = $derived(
		gameState.currentArea ? getItemsForArea(gameState.currentArea) : []
	);

	// Inspected item object
	let inspectedItem = $derived(
		gameState.inspectedItem ? getItemById(gameState.inspectedItem) : undefined
	);

	// Already-identified item IDs
	let identifiedItemIds = $derived(Object.keys(gameState.identifiedItems));

	onMount(() => {
		// Start game if not already playing
		if (!gameState.isPlaying && gameState.totalItemsIdentified === 0) {
			gameStore.startGame();
		}
	});

	// Watch for game over -> navigate to results
	$effect(() => {
		if (gameState.gamePhase === 'results') {
			const timer = setTimeout(() => {
				goto('/results');
			}, 500);
			return () => clearTimeout(timer);
		}
	});

	function handleEnterArea(areaId: string) {
		isZooming = true;
		gameStore.enterArea(areaId);
		setTimeout(() => {
			isZooming = false;
		}, 800);
	}

	function handleExitArea() {
		gameStore.exitArea();
	}

	function handleItemTap(itemId: string) {
		itemPopupStartTime = Date.now();
		gameStore.openItemPopup(itemId);
	}

	function handleClosePopup() {
		gameStore.closeItemPopup();
	}

	function handleIdentifyItem(isRecyclable: boolean) {
		if (!gameState.inspectedItem) return;

		const timeToDecide = (Date.now() - itemPopupStartTime) / 1000;
		const item = getItemById(gameState.inspectedItem);
		if (!item) return;

		const result = gameStore.identifyItem(gameState.inspectedItem, isRecyclable, timeToDecide);

		// Show feedback
		const correctAnswer = item.isRecyclable ? 'Recyclable' : 'Not Recyclable';
		feedbackStore.show(result.isCorrect, item, gameState.currentStreak, correctAnswer);
	}

	function handleFeedbackComplete() {
		feedbackStore.hide();
		gameStore.dismissFeedback();
	}

	function togglePause() {
		showPauseMenu = !showPauseMenu;
		gameStore.togglePause();
	}

	function quitGame() {
		gameStore.reset();
		goto('/');
	}

	function resumeGame() {
		showPauseMenu = false;
		gameStore.togglePause();
	}
</script>

<svelte:head>
	<title>Playing - Recycling Challenge</title>
</svelte:head>

<div class="game-screen">
	<!-- Top Bar -->
	<TopBar
		score={gameState.score}
		lives={gameState.lives}
		maxLives={gameState.maxLives}
		itemsIdentified={gameState.totalItemsIdentified}
		totalItems={gameState.totalItems}
		streak={gameState.currentStreak}
		areasCompleted={gameState.completedAreas.length}
		totalAreas={areas.length}
		{elapsedSeconds}
	/>

	<!-- Pause Button -->
	<button class="pause-button" onclick={togglePause} aria-label="Pause game">
		⏸️
	</button>

	<!-- Game Content -->
	<div class="game-content">
		<!-- Map Phase -->
		{#if gameState.gamePhase === 'map'}
			<MapOverview
				{areas}
				areaProgress={gameState.areaProgress}
				completedAreas={gameState.completedAreas}
				onEnterArea={handleEnterArea}
			/>
		{/if}

		<!-- Zoom Transition -->
		{#if gameState.gamePhase === 'zooming'}
			<div class="zoom-transition">
				<div class="zoom-circle">
					{#if currentArea}
						<span class="zoom-icon">{currentArea.icon}</span>
						<span class="zoom-name">{currentArea.name}</span>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Area Phase -->
		{#if gameState.gamePhase === 'area' && currentArea}
			<AreaScene
				area={currentArea}
				items={currentAreaItems}
				areaProgress={gameState.areaProgress[gameState.currentArea!]}
				{identifiedItemIds}
				onItemTap={handleItemTap}
				onBack={handleExitArea}
			/>
		{/if}

		<!-- Popup Phase -->
		{#if gameState.gamePhase === 'popup' && inspectedItem}
			{#if currentArea}
				<AreaScene
					area={currentArea}
					items={currentAreaItems}
					areaProgress={gameState.areaProgress[gameState.currentArea!]}
					{identifiedItemIds}
					onItemTap={handleItemTap}
					onBack={handleExitArea}
				/>
			{/if}
			<ItemPopup
				item={inspectedItem}
				onClose={handleClosePopup}
				onIdentify={handleIdentifyItem}
			/>
		{/if}

		<!-- Feedback Phase -->
		{#if gameState.gamePhase === 'feedback' || feedbackState.show}
			{#if currentArea && gameState.currentArea}
				<AreaScene
					area={currentArea}
					items={currentAreaItems}
					areaProgress={gameState.areaProgress[gameState.currentArea]}
					{identifiedItemIds}
					onItemTap={handleItemTap}
					onBack={handleExitArea}
				/>
			{/if}
			{#if feedbackState.show}
				<FeedbackAnimation
					isCorrect={feedbackState.isCorrect}
					item={feedbackState.item}
					streak={feedbackState.streak}
					correctAnswer={feedbackState.correctAnswer}
					onComplete={handleFeedbackComplete}
				/>
			{/if}
		{/if}
	</div>

	<!-- Pause Menu -->
	{#if showPauseMenu}
		<div class="pause-overlay">
			<div class="pause-menu">
				<h2>Game Paused</h2>

				<div class="pause-stats">
					<div class="stat">
						<span class="stat-label">Score</span>
						<span class="stat-value">{gameState.score}</span>
					</div>
					<div class="stat">
						<span class="stat-label">Accuracy</span>
						<span class="stat-value">{currentAccuracy}%</span>
					</div>
					<div class="stat">
						<span class="stat-label">Areas</span>
						<span class="stat-value">{gameState.completedAreas.length}/{areas.length}</span>
					</div>
				</div>

				<div class="pause-buttons">
					<button class="nine-patch-btn nine-patch-btn-green" onclick={resumeGame}>
						▶️ Resume
					</button>
					<button class="nine-patch-btn nine-patch-btn-red" onclick={quitGame}>
						🏠 Quit Game
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.game-screen {
		display: flex;
		flex-direction: column;
		height: 100vh;
		height: 100dvh;
		max-width: 100vw;
		overflow: hidden;
		background: linear-gradient(180deg, var(--color-cream, #FCE9CC) 0%, #f5f0e8 100%);
		position: relative;
		box-sizing: border-box;
	}

	.pause-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: white;
		border: 3px solid black;
		font-size: 1.5rem;
		cursor: pointer;
		box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
		transition: all 0.2s;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pause-button:hover {
		transform: scale(1.1);
	}

	.game-content {
		flex: 1;
		display: flex;
		position: relative;
		max-width: 100vw;
		overflow: hidden;
	}

	/* Zoom Transition */
	.zoom-transition {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-cream, #FCE9CC);
		z-index: 50;
		animation: zoomIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoomIn {
		0% {
			opacity: 0;
			transform: scale(0.3);
		}
		50% {
			opacity: 1;
			transform: scale(1.05);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.zoom-circle {
		width: 200px;
		height: 200px;
		background: white;
		border: 5px solid black;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
		animation: zoomPulse 0.8s;
	}

	@keyframes zoomPulse {
		0% { transform: scale(0.5); }
		60% { transform: scale(1.1); }
		100% { transform: scale(1); }
	}

	.zoom-icon {
		font-size: 4rem;
	}

	.zoom-name {
		font-size: 1.5rem;
		font-weight: 900;
		color: var(--color-dark-green, #3C5142);
	}

	/* Pause Overlay */
	.pause-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		animation: fadeIn 0.3s;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.pause-menu {
		border-style: solid;
		border-width: 48px 40px 44px 40px;
		border-image-source: url('/assets/box/msg_box.png');
		border-image-slice: 13% 8% 12% 8% fill;
		border-image-repeat: stretch;
		border-radius: 0;
		background: none;
		padding: 1.5rem 2rem;
		text-align: center;
		box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.35);
		max-width: 400px;
		width: 90%;
		animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		color: var(--color-cream, #FCE9CC);
	}

	@keyframes scaleIn {
		from { transform: scale(0.8); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	.pause-menu h2 {
		font-size: 2.5rem;
		margin: 0 0 1.5rem 0;
		color: white;
		text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
	}

	.pause-stats {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-label {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 0.3rem;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: bold;
		color: var(--color-yellow, #F8C226);
	}

	.pause-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Pause buttons use global .nine-patch-btn classes */
	.pause-buttons :global(.nine-patch-btn) {
		font-size: 1.3rem;
	}

	/* iPad Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.pause-menu {
			padding: 1.5rem;
		}

		.pause-menu h2 {
			font-size: 2rem;
			margin-bottom: 1rem;
		}

		.zoom-circle {
			width: 150px;
			height: 150px;
		}

		.zoom-icon {
			font-size: 3rem;
		}

		.zoom-name {
			font-size: 1.2rem;
		}
	}
</style>
