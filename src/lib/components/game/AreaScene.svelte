<script lang="ts">
	import type { Item, Area, AreaProgress } from '$lib/types';

	interface Props {
		area: Area;
		items: Item[];
		areaProgress: AreaProgress;
		identifiedItemIds: string[];
		onItemTap: (itemId: string) => void;
		onBack: () => void;
	}

	let { area, items, areaProgress, identifiedItemIds, onItemTap, onBack }: Props = $props();

	function isIdentified(itemId: string): boolean {
		return identifiedItemIds.includes(itemId);
	}

	let remainingCount = $derived(areaProgress.total - areaProgress.found);

	// Clamp item positions so they stay fully inside the container
	// Items use translate(-50%,-50%) so we need ~10% margin from edges
	function clamp(val: number, min: number, max: number): number {
		return Math.min(Math.max(val, min), max);
	}

	// Deterministic pseudo-random positions for scenery decorations
	function sceneryPositions(scenery: string[]): { emoji: string; x: number; y: number; size: number; rotation: number }[] {
		return scenery.map((emoji, i) => ({
			emoji,
			x: ((i * 37 + 13) % 80) + 5,
			y: ((i * 53 + 29) % 70) + 10,
			size: 1.5 + (i % 3) * 0.8,
			rotation: ((i * 73) % 40) - 20
		}));
	}
</script>

<div class="area-scene">
	<!-- Area Background -->
	<div class="area-background">
		{#if area.background}
			<img class="area-bg-image" src={area.background} alt="{area.name} background" />
			<img class="area-bg-center" src={area.background} alt="" />
		{/if}
		<div class="area-bg-overlay" style="background: {area.gradient || 'linear-gradient(180deg, #87CEEB, #98FB98)'}"></div>
	</div>

	<!-- Back Button -->
	<button class="back-button interactive-button" onclick={onBack} aria-label="Back to map">
		<img src="/assets/buttons/back_button.svg" alt="Back" class="back-btn-icon" />
		<span class="back-btn-label">Map</span>
	</button>

	<!-- Area Info Badge -->
	<div class="area-info">
		<span class="area-badge-icon">{area.icon}</span>
		<span class="area-badge-name">{area.name}</span>
		<span class="area-badge-count">{remainingCount} left</span>
	</div>

	<!-- Scattered Items -->
	<div class="items-container">
		{#each items as item (item.id)}
			{@const identified = isIdentified(item.id)}
			<button
				class="scene-item interactive-icon"
				class:identified
				style="left: {clamp(item.position.x, 10, 90)}%; top: {clamp(item.position.y, 10, 90)}%;"
				onclick={() => !identified && onItemTap(item.id)}
				disabled={identified}
				aria-label={identified ? `${item.name} (identified)` : `Inspect ${item.name}`}
			>
				<img src={item.image} alt={item.name} class="item-icon" />
				{#if identified}
					<span class="item-check">✅</span>
				{:else}
					<span class="item-glow"></span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Area Progress -->
	<div class="area-progress">
		<div class="progress-bar-outer">
			<div
				class="progress-bar-inner"
				style="width: {areaProgress.total > 0 ? (areaProgress.found / areaProgress.total) * 100 : 0}%"
			></div>
		</div>
		<span class="progress-label">{areaProgress.found}/{areaProgress.total} found</span>
	</div>
</div>

<style>
	.area-scene {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		max-width: 100vw;
		max-height: 100vh;
		max-height: 100dvh;
		animation: areaFadeIn 0.5s ease-out;
	}

	@keyframes areaFadeIn {
		from {
			opacity: 0;
			transform: scale(1.1);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.area-background {
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
	}

	.area-bg-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		z-index: 0;
		filter: blur(12px) brightness(0.7);
		transform: scale(1.05);
		animation: bgZoomIn 0.8s ease-out;
	}

	.area-bg-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70%;
		height: 70%;
		object-fit: contain;
		z-index: 1;
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
		pointer-events: none;
		animation: centerImgIn 0.6s ease-out 0.2s both;
	}

	@keyframes centerImgIn {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@keyframes bgZoomIn {
		from {
			transform: scale(1.15);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.area-bg-overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		opacity: 0.15;
		pointer-events: none;
	}

	.back-button {
		position: absolute;
		top: 0.8rem;
		left: 0.8rem;
		z-index: 20;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.back-btn-icon {
		width: 52px;
		height: 52px;
		object-fit: contain;
		pointer-events: none;
	}

	.back-btn-label {
		font-size: 0.9rem;
		font-weight: 800;
		color: white;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
	}

	.area-info {
		position: absolute;
		top: 0.8rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		background: white;
		border: 3px solid black;
		border-radius: 20px;
		padding: 0.4rem 1.2rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
	}

	.area-badge-icon {
		font-size: 1.3rem;
	}

	.area-badge-name {
		font-weight: 800;
		font-size: 1rem;
		color: var(--color-text, #333);
	}

	.area-badge-count {
		font-size: 0.85rem;
		color: var(--color-coca-cola-red, #DF1725);
		font-weight: 700;
	}

	.items-container {
		position: absolute;
		top: 15%;
		left: 15%;
		width: 70%;
		height: 70%;
		z-index: 10;
		overflow: hidden;
		border-radius: 16px;
	}

	.scene-item {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 100px;
		height: 100px;
		border-radius: 0;
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.25s ease;
		animation: itemBob 3s ease-in-out infinite;
		padding: 0;
		overflow: visible;
		filter:
			drop-shadow(1.5px 0 0 #1A1A1A)
			drop-shadow(-1.5px 0 0 #1A1A1A)
			drop-shadow(0 1.5px 0 #1A1A1A)
			drop-shadow(0 -1.5px 0 #1A1A1A)
			drop-shadow(2px 3px 3px rgba(0, 0, 0, 0.25));
	}

	.scene-item:nth-child(odd) {
		animation-delay: -1.5s;
	}

	.scene-item:nth-child(3n) {
		animation-delay: -0.7s;
	}

	@keyframes itemBob {
		0%, 100% {
			transform: translate(-50%, -50%) translateY(0);
		}
		50% {
			transform: translate(-50%, -50%) translateY(-5px);
		}
	}

	.scene-item:hover:not(:disabled) {
		transform: translate(-50%, -50%) scale(1.15) translateY(-3px);
		z-index: 15;
	}

	.scene-item:active:not(:disabled) {
		transform: translate(-50%, -50%) scale(0.93);
	}

	.scene-item.identified {
		opacity: 0.45;
		cursor: default;
		animation: none;
		background: none;
		border: none;
		filter:
			drop-shadow(1.5px 0 0 var(--color-dark-green, #3C5142))
			drop-shadow(-1.5px 0 0 var(--color-dark-green, #3C5142))
			drop-shadow(0 1.5px 0 var(--color-dark-green, #3C5142))
			drop-shadow(0 -1.5px 0 var(--color-dark-green, #3C5142))
			grayscale(0.4);
	}

	.item-icon {
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
		-webkit-user-drag: none;
	}

	.item-check {
		position: absolute;
		top: -5px;
		right: -5px;
		font-size: 0.9rem;
	}

	.item-glow {
		position: absolute;
		inset: -6px;
		border-radius: 4px;
		background: radial-gradient(circle, rgba(248,194,38,0.35) 0%, transparent 70%);
		animation: glowPulse 2s ease-in-out infinite;
		pointer-events: none;
	}

	@keyframes glowPulse {
		0%, 100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.15);
		}
	}

	.area-progress {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		background: rgba(255, 255, 255, 0.95);
		border: 3px solid black;
		border-radius: 16px;
		padding: 0.5rem 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
		min-width: 200px;
	}

	.progress-bar-outer {
		flex: 1;
		height: 10px;
		background: #eee;
		border: 2px solid black;
		border-radius: 8px;
		overflow: hidden;
	}

	.progress-bar-inner {
		height: 100%;
		background: linear-gradient(90deg, var(--color-green, #74AC4B), var(--color-georgia-green, #A4CDA8));
		border-radius: 6px;
		transition: width 0.5s ease;
	}

	.progress-label {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-text, #333);
		white-space: nowrap;
	}

	/* === Interactive Icon: Drop Shadow + Hover Effects === */
	.interactive-icon {
		filter: drop-shadow(3px 4px 6px rgba(0, 0, 0, 0.35));
	}

	.interactive-icon:hover:not(:disabled) {
		filter:
			drop-shadow(0px 0px 8px rgba(248, 194, 38, 0.55))
			drop-shadow(3px 6px 10px rgba(0, 0, 0, 0.4));
	}

	.interactive-icon:active:not(:disabled) {
		filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.3));
	}

	/* Pulsing golden glow for undiscovered items */
	@keyframes iconPulse {
		0%, 100% { filter: drop-shadow(3px 4px 6px rgba(0, 0, 0, 0.35)); }
		50% { filter: drop-shadow(0px 0px 12px rgba(248, 194, 38, 0.5)) drop-shadow(3px 4px 6px rgba(0, 0, 0, 0.35)); }
	}

	.interactive-icon:not(.identified):not(:hover) {
		animation: iconPulse 2.5s ease-in-out infinite, itemBob 3s ease-in-out infinite;
	}

	/* === Interactive Button: Drop Shadow + Hover Effects === */
	.interactive-button {
		filter: drop-shadow(2px 3px 5px rgba(0, 0, 0, 0.3));
		transition: filter 0.2s ease, transform 0.2s ease;
	}

	.interactive-button:hover {
		filter:
			drop-shadow(0px 0px 10px rgba(223, 23, 37, 0.4))
			drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.4));
		transform: scale(1.08);
	}

	.interactive-button:active {
		filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
		transform: scale(0.94);
	}

	/* iPad Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.scene-item {
			width: 76px;
			height: 76px;
		}

		.area-info {
			top: 0.5rem;
			padding: 0.3rem 1rem;
		}

		.back-btn-icon {
			width: 44px;
			height: 44px;
		}
	}

	/* Larger screens: bigger touch targets */
	@media (min-width: 768px) {
		.scene-item {
			width: 110px;
			height: 110px;
		}

		.back-btn-icon {
			width: 60px;
			height: 60px;
		}
	}
</style>
