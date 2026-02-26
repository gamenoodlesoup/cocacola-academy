<script lang="ts">
	import type { Area, AreaProgress } from '$lib/types';

	interface Props {
		areas: Area[];
		areaProgress: Record<string, AreaProgress>;
		completedAreas: string[];
		onEnterArea: (areaId: string) => void;
	}

	let { areas, areaProgress, completedAreas, onEnterArea }: Props = $props();

	/* Pin positions centred in each room quadrant (percentage of map-frame) */
	const pinPositions: Record<string, { x: number; y: number }> = {
		bathroom:    { x: 24, y: 28 },
		kitchen:     { x: 74, y: 28 },
		bedroom:     { x: 24, y: 72 },
		living_room: { x: 74, y: 72 }
	};

	function getPosition(areaId: string) {
		return pinPositions[areaId] ?? { x: 50, y: 50 };
	}

	function isCompleted(areaId: string): boolean {
		return completedAreas.includes(areaId);
	}

	function getProgress(areaId: string): number {
		const p = areaProgress[areaId];
		if (!p || p.total === 0) return 0;
		return Math.round((p.found / p.total) * 100);
	}
</script>

<div class="map-screen">
	<!-- Header -->
	<div class="map-header">
		<h2 class="map-title">🏠 Explore the House</h2>
		<p class="map-subtitle">Tap a room to find items!</p>
	</div>

	<!-- Centered Map -->
	<div class="map-frame">
		<!-- Floor plan image -->
		<img class="map-image" src="/assets/areas/map.png" alt="House floor plan" />

		<!-- Room pins -->
		{#each areas as area, i}
			{@const completed = isCompleted(area.id)}
			{@const progress = getProgress(area.id)}
			{@const pos = getPosition(area.id)}
			<button
				class="map-pin"
				class:completed
				class:has-progress={progress > 0 && !completed}
				onclick={() => onEnterArea(area.id)}
				disabled={completed}
				style="left: {pos.x}%; top: {pos.y}%; animation-delay: {i * 0.1}s;"
			>
				<span class="pin-icon">{area.icon}</span>
				<span class="pin-label">{area.name}</span>
				{#if completed}
					<span class="pin-badge completed-badge">✅</span>
				{:else if progress > 0}
					<span class="pin-badge progress-badge">{areaProgress[area.id].found}/{areaProgress[area.id].total}</span>
				{/if}
				<span class="pin-pointer"></span>
			</button>
		{/each}
	</div>
</div>

<style>
	.map-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		padding: 0.5rem;
		gap: 0.5rem;
		overflow: hidden;
	}

	.map-header {
		text-align: center;
		z-index: 1;
		animation: fadeSlideDown 0.5s ease-out;
		flex-shrink: 0;
	}

	@keyframes fadeSlideDown {
		from { opacity: 0; transform: translateY(-16px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.map-title {
		font-size: 1.8rem;
		font-weight: 900;
		color: var(--color-dark-green, #3C5142);
		margin: 0 0 0.2rem 0;
		text-shadow: 2px 2px 0 rgba(0,0,0,0.08);
	}

	.map-subtitle {
		font-size: 1rem;
		color: var(--color-text-light, #666);
		margin: 0;
	}

	/* ---------- Map Frame ---------- */
	.map-frame {
		position: relative;
		width: 100%;
		max-width: 840px;
		aspect-ratio: 4 / 3;
		border: 5px solid var(--color-dark-green, #3C5142);
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 6px 6px 0 rgba(0,0,0,0.25);
		background: #f5efe6;
		flex-shrink: 0;
	}

	/* ---------- Map Image ---------- */
	.map-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ---------- Map Pin ---------- */
	.map-pin {
		position: absolute;
		transform: translate(-50%, -100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		background: white;
		border: 3px solid black;
		border-radius: 14px;
		padding: 0.35rem 0.55rem 0.25rem;
		cursor: pointer;
		box-shadow: 3px 3px 0 rgba(0,0,0,0.3);
		transition: transform 0.15s, box-shadow 0.15s;
		animation: pinDrop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		z-index: 2;
		min-width: 56px;
	}

	@keyframes pinDrop {
		0%   { opacity: 0; transform: translate(-50%, -200%) scale(0.6); }
		100% { opacity: 1; transform: translate(-50%, -100%) scale(1); }
	}

	.map-pin:hover:not(:disabled) {
		transform: translate(-50%, -100%) scale(1.12);
		box-shadow: 4px 4px 0 rgba(0,0,0,0.35);
		z-index: 5;
	}

	.map-pin:active:not(:disabled) {
		transform: translate(-50%, -100%) scale(0.95);
		box-shadow: 1px 1px 0 rgba(0,0,0,0.3);
	}

	.map-pin.completed {
		background: var(--color-georgia-green, #A4CDA8);
		border-color: var(--color-dark-green, #3C5142);
		opacity: 0.75;
		cursor: default;
	}

	.map-pin.has-progress {
		background: var(--color-cream, #FCE9CC);
		border-color: var(--color-yellow, #F8C226);
	}

	.pin-pointer {
		position: absolute;
		bottom: -9px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 10px solid black;
	}

	.map-pin.completed .pin-pointer {
		border-top-color: var(--color-dark-green, #3C5142);
	}

	.map-pin.has-progress .pin-pointer {
		border-top-color: var(--color-yellow, #F8C226);
	}

	.pin-icon {
		font-size: 1.6rem;
		line-height: 1;
	}

	.pin-label {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--color-text, #333);
		white-space: nowrap;
		margin-top: 0.1rem;
	}

	.pin-badge {
		position: absolute;
		top: -10px;
		right: -10px;
		font-size: 0.65rem;
		font-weight: 800;
		line-height: 1;
	}

	.completed-badge {
		font-size: 0.9rem;
	}

	.progress-badge {
		background: var(--color-yellow, #F8C226);
		color: #333;
		border: 2px solid black;
		border-radius: 8px;
		padding: 1px 5px;
	}

	/* ---------- Landscape ---------- */
	@media (max-height: 700px) and (orientation: landscape) {
		.map-screen {
			flex-direction: row;
			gap: 1rem;
		}

		.map-header {
			writing-mode: horizontal-tb;
			max-width: 120px;
		}

		.map-title {
			font-size: 1.4rem;
		}

		.map-frame {
			max-width: 65vw;
			max-height: 80vh;
		}
	}

	/* ---------- Small screens ---------- */
	@media (max-width: 400px) {
		.map-frame {
			border-width: 4px;
			border-radius: 14px;
		}

		.map-pin {
			padding: 0.25rem 0.4rem 0.2rem;
			border-width: 2px;
			border-radius: 10px;
			min-width: 44px;
		}

		.pin-icon {
			font-size: 1.3rem;
		}

		.pin-label {
			font-size: 0.6rem;
		}
	}
</style>
