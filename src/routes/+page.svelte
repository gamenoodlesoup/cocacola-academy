<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	let isLoaded = $state(false);

	onMount(() => {
		isLoaded = true;
	});

	function startGame() {
		goto('/games');
	}
</script>

<svelte:head>
	<title>Recycling Challenge - Coca-Cola Academy</title>
</svelte:head>

<div class="start-screen" class:loaded={isLoaded}>
	<!-- Decorative Background -->
	<div class="background-pattern"></div>

	<!-- Main Content -->
	<div class="content" class:visible={isLoaded}>
		<!-- Logo -->
		<div class="logo-container">
			<div class="logo-circle">
				<span class="logo-text">♻️</span>
			</div>
		</div>

		<!-- Title -->
		<h1 class="title">Recycling<br />Challenge</h1>

		<p class="subtitle">Learn to sort recyclable items the fun way!</p>

		<!-- Start Button -->
		<button class="start-button" onclick={startGame}>
			<span>TAP TO START</span>
			<span class="hand-icon">👆</span>
		</button>

		<!-- Footer -->
		<div class="footer">
			<p>An educational game about recycling</p>
		</div>
	</div>
</div>

<style>
	.start-screen {
		height: 100vh;
		height: 100dvh;
		max-width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
		padding: 2rem;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
	}

	.background-pattern {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle at 20% 80%, rgba(0, 166, 81, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(237, 28, 36, 0.1) 0%, transparent 50%);
		pointer-events: none;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		z-index: 1;
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.content.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.logo-container {
		margin-bottom: 2rem;
	}

	.logo-circle {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		background: linear-gradient(135deg, #00a651 0%, #008542 100%);
		border: 5px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 8px 8px 0 black;
	}

	.logo-text {
		font-size: 80px;
	}

	.title {
		font-size: 4rem;
		font-weight: 900;
		color: #ed1c24;
		margin: 0 0 1rem 0;
		line-height: 1.1;
		text-shadow: 4px 4px 0 black;
		-webkit-text-stroke: 2px black;
		paint-order: stroke fill;
	}

	.subtitle {
		font-size: 1.4rem;
		color: #666;
		margin: 0 0 3rem 0;
		max-width: 400px;
	}

	.start-button {
		position: relative;
		background: #ed1c24;
		color: white;
		border: 5px solid black;
		font-size: 2rem;
		font-weight: bold;
		padding: 1.5rem 3rem;
		cursor: pointer;
		box-shadow: 8px 8px 0 black;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 1rem;
		border-radius: 8px;
	}

	.start-button:hover {
		transform: translate(3px, 3px);
		box-shadow: 5px 5px 0 black;
	}

	.start-button:active {
		transform: translate(8px, 8px);
		box-shadow: 0 0 0 black;
	}

	.hand-icon {
		font-size: 2.5rem;
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
	}

	.footer {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
	}

	.footer p {
		color: #999;
		font-size: 1rem;
		margin: 0;
	}

	/* iPad Portrait */
	@media (max-width: 1024px) and (orientation: portrait) {
		.title {
			font-size: 3.5rem;
		}

		.start-button {
			font-size: 1.8rem;
			padding: 1.25rem 2.5rem;
		}

		.logo-circle {
			width: 120px;
			height: 120px;
		}

		.logo-text {
			font-size: 60px;
		}
	}

	/* iPad Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.title {
			font-size: 2.5rem;
		}

		.subtitle {
			margin-bottom: 2rem;
			font-size: 1.2rem;
		}

		.logo-circle {
			width: 100px;
			height: 100px;
		}

		.logo-text {
			font-size: 50px;
		}

		.start-button {
			font-size: 1.5rem;
			padding: 1rem 2rem;
		}
	}
</style>
