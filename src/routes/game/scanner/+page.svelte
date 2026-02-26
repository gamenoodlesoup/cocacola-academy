<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { scannerStore, getCurrentItem, scannerAccuracy } from '$lib/stores/scannerStore';
	import type { ScannerGameState, PlasticItem, PlasticType, DialReadings } from '$lib/types/scanner';

	let gameState = $state<ScannerGameState>(get(scannerStore));
	let accuracy = $state(0);
	let currentItem = $state<PlasticItem | undefined>(undefined);
	let scanLineY = $state(0);
	let showTutorial = $state(true);
	let autoReturnCountdown = $state(5);
	let autoReturnTimer = $state<ReturnType<typeof setInterval> | null>(null);
	let hasScanned = $state(false);
	let activeDial = $state<keyof DialReadings | null>(null);

	$effect(() => {
		const unsub = scannerStore.subscribe((s) => {
			gameState = s;
			currentItem = getCurrentItem(s.currentItemIndex);
		});
		return unsub;
	});

	$effect(() => {
		const unsub = scannerAccuracy.subscribe((a) => { accuracy = a; });
		return unsub;
	});

	// Scan line animation
	$effect(() => {
		if (gameState.isScanning) {
			scanLineY = 0;
			const interval = setInterval(() => {
				scanLineY += 2;
				if (scanLineY > 100) scanLineY = 0;
			}, 20);
			return () => clearInterval(interval);
		}
	});

	// Reset scan state when moving to new item
	$effect(() => {
		void gameState.currentItemIndex;
		hasScanned = false;
	});

	// Auto-return to hub when results show
	$effect(() => {
		if (gameState.phase === 'results') {
			autoReturnCountdown = 5;
			autoReturnTimer = setInterval(() => {
				autoReturnCountdown -= 1;
				if (autoReturnCountdown <= 0) {
					if (autoReturnTimer) clearInterval(autoReturnTimer);
					scannerStore.reset();
					goto('/games');
				}
			}, 1000);
			return () => {
				if (autoReturnTimer) clearInterval(autoReturnTimer);
			};
		}
	});

	onMount(() => {
		scannerStore.startGame();
	});

	function dismissTutorial() {
		showTutorial = false;
	}

	function handleDial(dial: keyof DialReadings, delta: number) {
		const current = gameState.dialReadings[dial];
		scannerStore.setDial(dial, current + delta);
	}

	function handleRoute(choice: PlasticType) {
		scannerStore.routeToLine(choice);
	}

	function handleNext() {
		scannerStore.nextItem();
	}

	function handleScan() {
		scannerStore.scan();
		setTimeout(() => { hasScanned = true; }, 1000);
	}

	function handleDialPointerDown(dial: keyof DialReadings, e: PointerEvent) {
		activeDial = dial;
		const track = e.currentTarget as HTMLElement;
		track.setPointerCapture(e.pointerId);
		updateDialFromPointer(dial, track, e);
	}

	function handleDialPointerMove(dial: keyof DialReadings, e: PointerEvent) {
		if (activeDial !== dial) return;
		const track = e.currentTarget as HTMLElement;
		updateDialFromPointer(dial, track, e);
	}

	function handleDialPointerUp() {
		activeDial = null;
	}

	function updateDialFromPointer(dial: keyof DialReadings, track: HTMLElement, e: PointerEvent) {
		const rect = track.getBoundingClientRect();
		const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
		scannerStore.setDial(dial, Math.round(pct));
	}

	function goHome() {
		scannerStore.reset();
		goto('/games');
	}

	function playAgain() {
		scannerStore.startGame();
	}

	function getTypeLabel(type: PlasticType): string {
		switch (type) {
			case 'PET': return '1 PET';
			case 'HDPE': return '2 HDPE';
			case 'PVC': return '3 PVC';
			case 'LDPE': return '4 LDPE';
			case 'PP': return '5 PP';
			case 'PS': return '6 PS';
		}
	}

	function formatTime(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	const plasticTypes: { type: PlasticType; code: number; color: string }[] = [
		{ type: 'PET', code: 1, color: '#a8d8ea' },
		{ type: 'HDPE', code: 2, color: '#c8e6c9' },
		{ type: 'PVC', code: 3, color: '#ffcdd2' },
		{ type: 'LDPE', code: 4, color: '#fff9c4' },
		{ type: 'PP', code: 5, color: '#f0e0ff' },
		{ type: 'PS', code: 6, color: '#ffe0b2' }
	];

	function getHintIcon(item: PlasticItem): string {
		const h = item.hints;
		const icons: string[] = [];
		icons.push(h.floatSink === 'float' ? '🫧 Floats' : '⬇️ Sinks');
		icons.push(h.meltPeak === 'sharp' ? '📈 Sharp peak' : '📊 Broad peak');
		icons.push(h.bendCue === 'flexible' ? '🔄 Flexible' : h.bendCue === 'brittle' ? '💥 Brittle' : '🪨 Rigid');
		if (h.chlorineAlert) icons.push('⚠️ Chlorine!');
		return icons.join('  •  ');
	}

	const dialLabels: { key: keyof DialReadings; label: string; labelZh: string; icon: string }[] = [
		{ key: 'meltingPoint', label: 'Melting Pt', labelZh: '熔點', icon: '🌡️' },
		{ key: 'density', label: 'Density', labelZh: '密度', icon: '⚖️' },
		{ key: 'softeningPoint', label: 'Softening', labelZh: '軟化點', icon: '🔥' },
		{ key: 'chlorine', label: 'Chlorine', labelZh: '氯氣', icon: '☣️' }
	];
</script>

<svelte:head>
	<title>Plastic Scanner - Recycling Challenge</title>
</svelte:head>

<div class="scanner-screen">
	<!-- Tutorial Overlay -->
	{#if showTutorial}
		<div class="tutorial-overlay">
			<div class="tutorial-card">
				<h2>🔬 Plastic Scanner</h2>
				<p>Items arrive on the conveyor belt. Use the <strong>scanner</strong> and read the <strong>hint icons</strong> to identify each plastic type.</p>
				<p>Adjust the <strong>4 dials</strong> to match the readings, then identify which of the <strong>6 plastic types</strong> the item is:</p>
				<div class="tutorial-lines">
					<span class="line-tag pet">1 PET</span>
					<span class="line-tag hdpe">2 HDPE</span>
					<span class="line-tag pvc">3 PVC</span>
					<span class="line-tag ldpe">4 LDPE</span>
					<span class="line-tag pp">5 PP</span>
					<span class="line-tag ps">6 PS</span>
				</div>
				<p>⏱️ You have <strong>2 minutes</strong> — be quick and accurate!</p>
				<button class="nine-patch-btn nine-patch-btn-red tutorial-btn" onclick={dismissTutorial}>Got it! Let's go →</button>
			</div>
		</div>
	{/if}

	<!-- Top Status Bar -->
	<div class="status-bar">
		<button class="home-btn" onclick={goHome}>← Back</button>
		<div class="stat timer" class:urgent={gameState.timeRemaining <= 30}>⏱️ {formatTime(gameState.timeRemaining)}</div>
		<div class="stat">🏆 {gameState.score}</div>
		<div class="stat">
			{#each Array(gameState.maxLives) as _, i}
				<span class:dimmed={i >= gameState.lives}>❤️</span>
			{/each}
		</div>
		<div class="stat">{gameState.currentItemIndex + 1}/{gameState.totalItems}</div>
	</div>

	<!-- Main Game Area -->
	{#if gameState.phase === 'scanning' || gameState.phase === 'feedback'}
		<div class="game-area">
			<!-- Conveyor Belt + Scanner -->
			<div class="conveyor-section">
				<!-- Conveyor belt -->
				<div class="conveyor-belt">
					<div class="belt-pattern"></div>

					<!-- Items on belt (upcoming) -->
					<div class="belt-items">
						{#if currentItem}
							{#key gameState.currentItemIndex}
							<!-- Scanner frame -->
							<div class="scanner-frame slide-in" class:scanning={gameState.isScanning}>
								<div class="scanner-glass">
									<span class="item-in-scanner">{currentItem.icon}</span>
									{#if gameState.isScanning}
										<div class="scan-line" style="top: {scanLineY}%"></div>
									{/if}
								</div>
								<!-- Recycling code label -->
								<div class="recycle-code">
									<span class="code-arrows">♻️</span>
									<span class="code-number">{currentItem.recycleCode}</span>
									<span class="code-type">{currentItem.type}</span>
								</div>
							</div>
							{/key}
						{/if}
					</div>

					<!-- Belt rivets -->
					<div class="belt-rivets">
						{#each Array(12) as _}
							<span class="rivet"></span>
						{/each}
					</div>
				</div>

				<!-- Scan Button -->
				{#if !hasScanned && !gameState.isScanning && gameState.phase === 'scanning'}
					<button class="scan-btn" onclick={handleScan}>🔍 Scan Item</button>
				{:else if gameState.isScanning}
					<div class="scanning-label">⏳ Scanning...</div>
				{/if}

				<!-- Hint Bar (revealed after scan) -->
				{#if currentItem && hasScanned}
					<div class="hint-bar hint-reveal">
						<span class="hint-label">📋 Hints:</span>
						<span class="hint-text">{getHintIcon(currentItem)}</span>
					</div>
				{/if}
			</div>

			<!-- Dial Controls -->
			<div class="dials-section">
				{#each dialLabels as dial}
					<div class="dial-group">
						<span class="dial-label-zh">{dial.labelZh}</span>
						<div class="dial-container">
							<span class="dial-min">0</span>
							<div
								class="dial-track"
								role="slider"
								aria-label="{dial.label} dial"
								aria-valuemin={0}
								aria-valuemax={100}
								aria-valuenow={gameState.dialReadings[dial.key]}
								onpointerdown={(e) => handleDialPointerDown(dial.key, e)}
								onpointermove={(e) => handleDialPointerMove(dial.key, e)}
								onpointerup={handleDialPointerUp}
								onpointercancel={handleDialPointerUp}
							>
								<div class="dial-fill" style="width: {gameState.dialReadings[dial.key]}%"></div>
								<div
									class="dial-knob"
									class:dragging={activeDial === dial.key}
									style="left: {gameState.dialReadings[dial.key]}%"
								>
									{dial.icon}
								</div>
							</div>
							<span class="dial-max">100</span>
						</div>
						<div class="dial-buttons">
							<button class="dial-btn" onclick={() => handleDial(dial.key, -10)}>◀</button>
							<span class="dial-value">{gameState.dialReadings[dial.key]}</span>
							<button class="dial-btn" onclick={() => handleDial(dial.key, 10)}>▶</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- Identify Plastic Type -->
			{#if gameState.phase === 'scanning'}
				<div class="routing-section">
					<p class="route-prompt">Which plastic is this?</p>
					<div class="route-buttons">
						{#each plasticTypes as pt}
							<button class="route-btn" style="background: {pt.color}" onclick={() => handleRoute(pt.type)}>
								♻️ {pt.code}<br />{pt.type}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Feedback -->
			{#if gameState.phase === 'feedback'}
				<div class="feedback-section" class:correct={gameState.lastResult === 'correct'} class:incorrect={gameState.lastResult === 'incorrect'}>
					{#if gameState.lastResult === 'correct'}
						<div class="feedback-icon">✅</div>
						<p class="feedback-text">Correct! Nice work!</p>
						{#if currentItem}
							<p class="feedback-fact">💡 {currentItem.funFact}</p>
						{/if}
					{:else}
						<div class="feedback-icon">❌</div>
						<p class="feedback-text">Not quite!</p>
						{#if gameState.lastCorrectType}
							<p class="feedback-answer">Correct type: <strong>{getTypeLabel(gameState.lastCorrectType)}</strong></p>
						{/if}
						{#if currentItem}
							<div class="correct-dials">
								<p class="dials-label">Correct dial readings:</p>
								<div class="dial-comparison">
									{#each dialLabels as dial}
										<div class="dial-compare-item">
											<span class="dial-compare-icon">{dial.icon}</span>
											<span class="dial-compare-yours">{gameState.results[gameState.results.length - 1]?.dialReadings[dial.key] ?? '–'}</span>
											<span class="dial-compare-arrow">→</span>
											<span class="dial-compare-correct">{currentItem.properties[dial.key]}</span>
										</div>
									{/each}
								</div>
							</div>
							<p class="feedback-fact">💡 {currentItem.funFact}</p>
						{/if}
					{/if}
					<button class="nine-patch-btn nine-patch-btn-blue next-btn" onclick={handleNext}>
						{gameState.lives <= 0 || gameState.currentItemIndex >= gameState.totalItems - 1 || gameState.timeRemaining <= 0 ? 'See Results' : 'Next Item →'}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Results Screen -->
	{#if gameState.phase === 'results'}
		<div class="results-screen">
			<h1 class="results-title">
				{#if accuracy >= 80}🏆 Excellent!{:else if accuracy >= 50}👍 Good Job!{:else}💪 Keep Practicing!{/if}
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
				<div class="result-stat">
					<span class="stat-number">{gameState.longestStreak}</span>
					<span class="stat-label">Best Streak</span>
				</div>
			</div>

			<!-- Item Results -->
			<div class="results-list">
				{#each gameState.results as result}
					<div class="result-row" class:correct={result.isCorrect} class:incorrect={!result.isCorrect}>
						<span class="result-icon">{result.isCorrect ? '✅' : '❌'}</span>
						<span class="result-item">{result.itemId}</span>
						<span class="result-line">{result.playerChoice} → {result.correctType}</span>
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
	.scanner-screen {
		min-height: 100vh;
		min-height: 100dvh;
		background: linear-gradient(180deg, #2d2d2d 0%, #4a4a4a 100%);
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

	.tutorial-lines {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		flex-wrap: wrap;
		margin: 0.8rem 0;
	}

	.line-tag {
		padding: 0.3rem 0.6rem;
		border: 2px solid black;
		border-radius: 8px;
		font-size: 0.8rem;
		font-weight: 700;
	}

	.line-tag.pet { background: #a8d8ea; }
	.line-tag.hdpe { background: #c8e6c9; }
	.line-tag.pvc { background: #ffcdd2; }
	.line-tag.ldpe { background: #fff9c4; }
	.line-tag.pp { background: #f0e0ff; }
	.line-tag.ps { background: #ffe0b2; }

	/* Tutorial & action buttons use global nine-patch-btn */
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
		background: rgba(0,0,0,0.4);
		border-bottom: 3px solid #555;
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

	.dimmed {
		opacity: 0.25;
	}

	/* Game Area */
	.game-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	/* Conveyor Section */
	.conveyor-section {
		padding: 0.8rem 1rem;
	}

	.conveyor-belt {
		background: linear-gradient(180deg, #1a2a3a 0%, #2a3a4a 100%);
		border: 4px solid #555;
		border-radius: 12px;
		padding: 1rem;
		position: relative;
		min-height: 150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.belt-rivets {
		position: absolute;
		bottom: 6px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-evenly;
	}

	.rivet {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: radial-gradient(circle at 30% 30%, #888, #444);
		border: 1px solid #333;
	}

	.scanner-frame {
		background: linear-gradient(180deg, #cc2222 0%, #aa1111 100%);
		border: 4px solid #880000;
		border-radius: 8px;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		box-shadow: 0 0 20px rgba(255,0,0,0.2);
		transition: box-shadow 0.3s;
	}

	.scanner-frame.scanning {
		box-shadow: 0 0 30px rgba(255,0,0,0.5);
		animation: scanPulse 0.5s ease infinite;
	}

	/* Slide-in animation for new items */
	.slide-in {
		animation: slideInRight 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	@keyframes slideInRight {
		from { transform: translateX(120%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}

	@keyframes scanPulse {
		0%, 100% { box-shadow: 0 0 20px rgba(255,0,0,0.3); }
		50% { box-shadow: 0 0 40px rgba(255,0,0,0.6); }
	}

	.scanner-glass {
		width: 100px;
		height: 100px;
		background: rgba(200,150,80,0.3);
		border: 3px solid #666;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.item-in-scanner {
		font-size: 3rem;
		z-index: 1;
	}

	.scan-line {
		position: absolute;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(255,0,0,0.8);
		box-shadow: 0 0 10px red;
		z-index: 2;
	}

	.recycle-code {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: white;
		border: 3px solid black;
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		gap: 0.1rem;
	}

	.code-arrows { font-size: 1.4rem; }
	.code-number { font-size: 1.6rem; font-weight: 900; }
	.code-type { font-size: 0.8rem; font-weight: 700; color: #666; }

	.hint-bar {
		margin-top: 0.5rem;
		background: rgba(255,255,255,0.1);
		border: 2px solid rgba(255,255,255,0.2);
		border-radius: 8px;
		padding: 0.4rem 0.8rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.hint-label {
		color: #ffd700;
		font-weight: 800;
		font-size: 0.85rem;
		white-space: nowrap;
	}

	.hint-text {
		color: #ddd;
		font-size: 0.8rem;
	}

	/* Hint reveal animation */
	.hint-reveal {
		animation: hintFadeIn 0.4s ease-out;
	}

	@keyframes hintFadeIn {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* Scan Button */
	.scan-btn {
		display: block;
		margin: 0.6rem auto 0;
		padding: 0.7rem 2rem;
		background: linear-gradient(180deg, #22cc66 0%, #11aa44 100%);
		color: white;
		border: 3px solid #0a7733;
		border-radius: 14px;
		font-size: 1.1rem;
		font-weight: 800;
		cursor: pointer;
		box-shadow: 4px 4px 0 rgba(0,0,0,0.25);
		transition: transform 0.1s, box-shadow 0.1s;
	}

	.scan-btn:active {
		transform: translate(3px, 3px);
		box-shadow: 0 0 0 rgba(0,0,0,0.2);
	}

	.scanning-label {
		text-align: center;
		color: #ffd700;
		font-weight: 800;
		font-size: 1rem;
		margin-top: 0.6rem;
		animation: scanLabelPulse 0.6s ease infinite;
	}

	@keyframes scanLabelPulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	/* Dials Section */
	.dials-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
		padding: 0.5rem 1rem;
	}

	.dial-group {
		background: rgba(0,0,0,0.3);
		border: 3px solid #666;
		border-radius: 12px;
		padding: 0.5rem;
		text-align: center;
	}

	.dial-label-zh {
		color: white;
		font-weight: 900;
		font-size: 1rem;
		display: block;
		margin-bottom: 0.3rem;
	}

	.dial-container {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.dial-min, .dial-max {
		color: #999;
		font-size: 0.7rem;
		font-weight: 600;
		min-width: 20px;
	}

	.dial-track {
		flex: 1;
		height: 12px;
		background: #333;
		border: 2px solid #555;
		border-radius: 6px;
		position: relative;
		overflow: visible;
		touch-action: none;
		cursor: pointer;
	}

	.dial-fill {
		height: 100%;
		background: linear-gradient(90deg, #ff6600, #ffaa00);
		border-radius: 4px;
		transition: width 0.1s;
		pointer-events: none;
	}

	.dial-knob {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: radial-gradient(circle at 35% 35%, #ff8800, #cc5500);
		border: 3px solid #333;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		cursor: grab;
		box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
		padding: 0;
		pointer-events: none;
		transition: transform 0.1s;
	}

	.dial-knob.dragging {
		cursor: grabbing;
		transform: translate(-50%, -50%) scale(1.2);
		box-shadow: 0 0 12px rgba(255,136,0,0.6);
	}

	.dial-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.3rem;
	}

	.dial-btn {
		background: #555;
		color: white;
		border: 2px solid #777;
		border-radius: 6px;
		width: 32px;
		height: 28px;
		font-size: 0.8rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.dial-btn:active {
		background: #777;
	}

	.dial-value {
		color: #ffaa00;
		font-weight: 900;
		font-size: 1.1rem;
		min-width: 32px;
	}

	/* Routing */
	.routing-section {
		padding: 0.5rem 1rem 1rem;
	}

	.route-prompt {
		color: #ccc;
		text-align: center;
		font-size: 0.95rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
	}

	.route-buttons {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 0.5rem;
	}

	.route-btn {
		padding: 0.6rem 0.3rem;
		border: 3px solid black;
		border-radius: 12px;
		font-size: 0.9rem;
		font-weight: 800;
		cursor: pointer;
		box-shadow: 3px 3px 0 rgba(0,0,0,0.25);
		transition: all 0.15s;
		line-height: 1.3;
		text-align: center;
	}

	.route-btn:active {
		transform: translate(3px, 3px);
		box-shadow: 0 0 0 rgba(0,0,0,0.2);
	}

	/* Timer */
	.timer {
		font-variant-numeric: tabular-nums;
		min-width: 4ch;
	}

	.timer.urgent {
		color: #ff4444;
		animation: timerPulse 0.5s ease infinite;
	}

	@keyframes timerPulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	/* Feedback */
	.feedback-section {
		margin: 0.5rem 1rem 1rem;
		padding: 1.2rem;
		border-radius: 16px;
		border: 4px solid black;
		text-align: center;
		animation: feedbackPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes feedbackPop {
		from { transform: scale(0.8); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	.feedback-section.correct {
		background: #c8e6c9;
		border-color: var(--color-dark-green, #3C5142);
	}

	.feedback-section.incorrect {
		background: #ffcdd2;
		border-color: var(--color-coca-cola-red, #DF1725);
	}

	.feedback-icon { font-size: 2.5rem; }
	.feedback-text { font-size: 1.2rem; font-weight: 800; margin: 0.3rem 0; color: #1a1a1a; }
	.feedback-answer { font-size: 0.95rem; color: #333; margin: 0.3rem 0; }
	.feedback-fact { font-size: 0.85rem; color: #555; margin: 0.3rem 0; font-style: italic; }

	/* Correct dial comparison */
	.correct-dials {
		margin: 0.5rem 0;
	}

	.dials-label {
		font-size: 0.8rem;
		font-weight: 700;
		color: #555;
		margin: 0 0 0.3rem 0;
	}

	.dial-comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.3rem;
	}

	.dial-compare-item {
		display: flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.8rem;
		background: rgba(0,0,0,0.06);
		border-radius: 6px;
		padding: 0.2rem 0.4rem;
	}

	.dial-compare-icon { font-size: 0.9rem; }
	.dial-compare-yours { color: #cc3333; font-weight: 700; min-width: 22px; text-align: center; }
	.dial-compare-arrow { color: #999; }
	.dial-compare-correct { color: #228b22; font-weight: 800; min-width: 22px; text-align: center; }

	.next-btn {
		margin-top: 0.5rem;
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
		color: white;
		text-shadow: 2px 2px 0 rgba(0,0,0,0.3);
		margin: 0;
	}

	.results-stats {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.result-stat {
		background: rgba(255,255,255,0.15);
		border: 3px solid rgba(255,255,255,0.3);
		border-radius: 14px;
		padding: 0.8rem 1rem;
		text-align: center;
		min-width: 80px;
	}

	.stat-number {
		display: block;
		font-size: 1.6rem;
		font-weight: 900;
		color: #ffd700;
	}

	.stat-label {
		font-size: 0.8rem;
		color: #ccc;
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
		padding: 0.4rem 0.8rem;
		border-radius: 8px;
		font-size: 0.85rem;
		color: #333;
	}

	.result-row.correct { background: rgba(200,230,201,0.9); }
	.result-row.incorrect { background: rgba(255,205,210,0.9); }

	.result-icon { font-size: 1rem; }
	.result-item { flex: 1; font-weight: 700; }
	.result-line { font-size: 0.75rem; color: #666; }

	.results-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.8rem;
		margin-top: 0.5rem;
	}

	.auto-return {
		font-size: 0.85rem;
		color: rgba(255,255,255,0.6);
		margin: 0;
	}

	/* Results buttons use global nine-patch-btn */
	.results-buttons :global(.nine-patch-btn) {
		font-size: 1rem;
	}

	/* Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.dials-section {
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}

		.conveyor-section {
			flex-direction: row;
		}
	}
</style>
