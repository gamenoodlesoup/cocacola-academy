<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isLoaded = $state(false);

	onMount(() => {
		isLoaded = true;
	});

	interface GameMode {
		id: string;
		title: string;
		subtitle: string;
		description: string;
		icon: string;
		color: string;
		borderColor: string;
		route: string;
		difficulty: string;
		duration: string;
	}

	const games: GameMode[] = [
		{
			id: 'explore',
			title: 'Explore & Sort',
			subtitle: 'Home Explorer',
			description: 'Explore the house, find scattered items in each room and decide if they are recyclable or not!',
			icon: '🗺️',
			color: 'var(--color-georgia-green, #A4CDA8)',
			borderColor: 'var(--color-dark-green, #3C5142)',
			route: '/tutorial',
			difficulty: '⭐',
			duration: '3-5 min'
		},
		{
			id: 'scanner',
			title: 'Plastic Scanner',
			subtitle: 'Material Detective',
			description: 'Scan items on the conveyor belt, read the hints, adjust 4 dials, and identify each of the 6 plastic types!',
			icon: '🔬',
			color: '#FFD6D6',
			borderColor: 'var(--color-coca-cola-red, #DF1725)',
			route: '/game/scanner',
			difficulty: '⭐⭐',
			duration: '3-5 min'
		},
		{
			id: 'lab',
			title: 'Home Lab',
			subtitle: 'Cooking Mama Style',
			description: 'Perform step-by-step experiments with home tools to identify mystery plastics!',
			icon: '🧪',
			color: '#FFF3D6',
			borderColor: 'var(--color-yellow, #F8C226)',
			route: '/game/lab',
			difficulty: '⭐⭐⭐',
			duration: '4-6 min'
		}
	];

	function selectGame(game: GameMode) {
		goto(game.route);
	}

	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Choose a Game - Recycling Challenge</title>
</svelte:head>

<div class="selection-screen" class:loaded={isLoaded}>
	<!-- Background -->
	<div class="bg-pattern"></div>

	<!-- Header -->
	<div class="header" class:visible={isLoaded}>
		<button class="back-btn" onclick={goBack}>← Back</button>
		<h1 class="page-title">🎮 Choose Your Game</h1>
		<p class="page-subtitle">Pick a challenge and start learning about recycling!</p>
	</div>

	<!-- Game Cards -->
	<div class="games-grid" class:visible={isLoaded}>
		{#each games as game, i}
			<button
				class="game-card"
				style="
					--card-bg: {game.color};
					--card-border: {game.borderColor};
					animation-delay: {0.1 + i * 0.15}s;
				"
				onclick={() => selectGame(game)}
			>
				<div class="card-header">
					<span class="card-icon">{game.icon}</span>
					<div class="card-badges">
						<span class="badge difficulty">{game.difficulty}</span>
						<span class="badge duration">⏱️ {game.duration}</span>
					</div>
				</div>

				<h2 class="card-title">{game.title}</h2>
				<p class="card-subtitle">{game.subtitle}</p>
				<p class="card-desc">{game.description}</p>

				<div class="card-footer">
					<span class="play-label">TAP TO PLAY →</span>
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.selection-screen {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		background: linear-gradient(160deg, #f8f9fa 0%, #e9ecef 100%);
		position: relative;
		overflow-y: auto;
	}

	.bg-pattern {
		position: fixed;
		inset: 0;
		background-image:
			radial-gradient(circle at 10% 90%, rgba(164, 205, 168, 0.2) 0%, transparent 40%),
			radial-gradient(circle at 90% 10%, rgba(223, 23, 37, 0.1) 0%, transparent 40%),
			radial-gradient(circle at 50% 50%, rgba(248, 194, 38, 0.08) 0%, transparent 50%);
		pointer-events: none;
		z-index: 0;
	}

	.header {
		text-align: center;
		z-index: 1;
		margin-bottom: 1.5rem;
		opacity: 0;
		transform: translateY(-20px);
		transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		width: 100%;
		max-width: 700px;
		position: relative;
	}

	.header.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.back-btn {
		position: absolute;
		left: 0;
		top: 0;
		background: white;
		border: 3px solid black;
		border-radius: 12px;
		padding: 0.5rem 1rem;
		font-weight: 800;
		font-size: 1rem;
		cursor: pointer;
		box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
		transition: all 0.15s;
	}

	.back-btn:hover {
		transform: translate(1px, 1px);
		box-shadow: 2px 2px 0 rgba(0,0,0,0.2);
	}

	.page-title {
		font-size: 2.2rem;
		font-weight: 900;
		color: var(--color-dark-green, #3C5142);
		margin: 0 0 0.3rem 0;
		text-shadow: 2px 2px 0 rgba(0,0,0,0.06);
	}

	.page-subtitle {
		font-size: 1.05rem;
		color: #666;
		margin: 0;
	}

	.games-grid {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		width: 100%;
		max-width: 500px;
		z-index: 1;
		opacity: 0;
		transition: opacity 0.4s ease 0.2s;
	}

	.games-grid.visible {
		opacity: 1;
	}

	.game-card {
		background: var(--card-bg);
		border: 4px solid var(--card-border);
		border-radius: 20px;
		padding: 1.4rem;
		cursor: pointer;
		box-shadow: 6px 6px 0 rgba(0,0,0,0.2);
		transition: all 0.2s;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		animation: cardSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		position: relative;
		overflow: hidden;
	}

	@keyframes cardSlideUp {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.game-card:hover {
		transform: translate(3px, 3px);
		box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
	}

	.game-card:active {
		transform: translate(6px, 6px);
		box-shadow: 0 0 0 rgba(0,0,0,0.2);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.2rem;
	}

	.card-icon {
		font-size: 2.8rem;
		line-height: 1;
	}

	.card-badges {
		display: flex;
		gap: 0.4rem;
	}

	.badge {
		background: white;
		border: 2px solid black;
		border-radius: 8px;
		padding: 0.2rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.card-title {
		font-size: 1.6rem;
		font-weight: 900;
		color: #1a1a1a;
		margin: 0;
	}

	.card-subtitle {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--card-border);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.card-desc {
		font-size: 0.95rem;
		color: #444;
		margin: 0.3rem 0 0 0;
		line-height: 1.4;
	}

	.card-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.5rem;
	}

	.play-label {
		font-size: 0.95rem;
		font-weight: 900;
		color: var(--card-border);
		letter-spacing: 0.5px;
	}

	/* Landscape */
	@media (min-width: 700px) {
		.games-grid {
			flex-direction: row;
			flex-wrap: wrap;
			max-width: 900px;
			justify-content: center;
		}

		.game-card {
			width: calc(50% - 0.6rem);
			max-width: 400px;
		}

		.game-card:last-child {
			width: calc(50% - 0.6rem);
		}
	}

	@media (min-width: 1000px) {
		.games-grid {
			max-width: 1100px;
		}

		.game-card {
			width: calc(33.33% - 0.8rem);
		}

		.game-card:last-child {
			width: calc(33.33% - 0.8rem);
		}
	}

	/* Small screens */
	@media (max-width: 400px) {
		.page-title {
			font-size: 1.7rem;
		}

		.card-icon {
			font-size: 2.2rem;
		}

		.card-title {
			font-size: 1.3rem;
		}

		.game-card {
			padding: 1rem;
		}
	}
</style>
