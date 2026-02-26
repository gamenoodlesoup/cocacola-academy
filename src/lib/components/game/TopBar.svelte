<script lang="ts">
	interface Props {
		score: number;
		lives: number;
		maxLives: number;
		itemsIdentified: number;
		totalItems: number;
		streak?: number;
		areasCompleted?: number;
		totalAreas?: number;
		elapsedSeconds?: number;
	}

	let {
		score,
		lives,
		maxLives,
		itemsIdentified,
		totalItems,
		streak = 0,
		areasCompleted = 0,
		totalAreas = 6,
		elapsedSeconds = 0
	}: Props = $props();

	let progress = $derived((itemsIdentified / totalItems) * 100);

	function formatTime(sec: number): string {
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		return `${m}:${s.toString().padStart(2, '0')}`;
	}
</script>

<div class="top-bar">
	<!-- Score -->
	<div class="score-section">
		<div class="score-label">SCORE</div>
		<div class="score-value">{score}</div>
	</div>

	<!-- Timer -->
	<div class="timer-section">
		<span class="timer-icon">⏱️</span>
		<span class="timer-value">{formatTime(elapsedSeconds)}</span>
	</div>

	<!-- Progress -->
	<div class="progress-section">
		<div class="progress-label">{itemsIdentified} / {totalItems}</div>
		<div class="progress-bar">
			<div class="progress-fill" style="width: {progress}%"></div>
		</div>
		{#if streak >= 3}
			<div class="streak-badge">🔥 {streak}</div>
		{/if}
	</div>

	<!-- Areas + Lives -->
	<div class="right-section">
		<div class="areas-badge">
			🗺️ {areasCompleted}/{totalAreas}
		</div>
		<div class="lives-section">
			<div class="lives-hearts">
				{#each Array(maxLives) as _, i}
					<span class="heart" class:active={i < lives} class:lost={i >= lives}>
						{i < lives ? '❤️' : '🖤'}
					</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: white;
		border-bottom: 4px solid black;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.score-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.score-label,
	.lives-label {
		font-size: 0.85rem;
		font-weight: bold;
		color: #666;
		letter-spacing: 0.05em;
	}

	.score-value {
		font-size: 2.5rem;
		font-weight: 900;
		color: var(--color-coca-cola-red, #DF1725);
		font-family: 'Courier New', monospace;
		line-height: 1;
	}

	.timer-section {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.timer-icon {
		font-size: 1.2rem;
	}

	.timer-value {
		font-size: 1.3rem;
		font-weight: 800;
		color: #555;
		font-variant-numeric: tabular-nums;
		font-family: 'Courier New', monospace;
	}

	.progress-section {
		flex: 1;
		max-width: 350px;
		min-width: 150px;
		position: relative;
	}

	.progress-label {
		font-size: 1rem;
		font-weight: bold;
		margin-bottom: 0.4rem;
		text-align: center;
		color: #333;
	}

	.progress-bar {
		height: 24px;
		background: #eee;
		border: 3px solid black;
		border-radius: 15px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-green, #74AC4B) 0%, var(--color-georgia-green, #A4CDA8) 100%);
		transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		border-radius: 12px;
	}

	.streak-badge {
		position: absolute;
		top: -8px;
		right: -10px;
		background: var(--color-yellow, #F8C226);
		border: 2px solid black;
		border-radius: 12px;
		padding: 0.2rem 0.5rem;
		font-size: 0.9rem;
		font-weight: bold;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.right-section {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.3rem;
	}

	.areas-badge {
		font-size: 0.85rem;
		font-weight: bold;
		background: var(--color-cream, #FCE9CC);
		border: 2px solid black;
		border-radius: 12px;
		padding: 0.15rem 0.5rem;
		color: var(--color-dark-green, #3C5142);
	}

	.lives-section {
		display: flex;
		align-items: center;
	}

	.lives-hearts {
		display: flex;
		gap: 0.3rem;
	}

	.heart {
		font-size: 1.8rem;
		transition: all 0.3s;
	}

	.heart.active {
		filter: drop-shadow(0 0 5px rgba(237, 28, 36, 0.5));
	}

	.heart.lost {
		opacity: 0.5;
		transform: scale(0.9);
	}

	/* iPad Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.top-bar {
			padding: 0.75rem 1.5rem;
		}

		.score-value {
			font-size: 2rem;
		}

		.progress-bar {
			height: 20px;
		}

		.heart {
			font-size: 1.5rem;
		}
	}

	/* Small screens */
	@media (max-width: 600px) {
		.top-bar {
			padding: 0.75rem 1rem;
			gap: 1rem;
		}

		.progress-section {
			order: 3;
			flex-basis: 100%;
			max-width: 100%;
		}
	}
</style>
