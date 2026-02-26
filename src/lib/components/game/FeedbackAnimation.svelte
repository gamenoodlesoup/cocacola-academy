<script lang="ts">
	import { onMount } from 'svelte';
	import type { Item } from '$lib/types';

	interface Props {
		isCorrect: boolean;
		item: Item | null;
		streak: number;
		correctAnswer?: string;
		onComplete?: () => void;
	}

	let { isCorrect, item, streak, correctAnswer, onComplete }: Props = $props();

	let showContent = $state(false);
	let showStreakBonus = $derived(streak === 5);

	onMount(() => {
		showContent = true;

		// Haptic feedback
		if ('vibrate' in navigator) {
			if (isCorrect) {
				navigator.vibrate(50);
			} else {
				navigator.vibrate([100, 50, 100]);
			}
		}

		// Auto-hide after animation
		const timer = setTimeout(() => {
			if (onComplete) onComplete();
		}, 1800);

		return () => clearTimeout(timer);
	});
</script>

<div class="feedback-container" class:visible={showContent}>
	{#if isCorrect}
		<div class="feedback correct">
			<!-- Checkmark -->
			<div class="icon-circle correct-circle">
				<span class="check-icon">✓</span>
			</div>

			<!-- Thumbs Up -->
			<div class="hand-animation">👍</div>

			<!-- Points -->
			<div class="points">+10</div>

			<!-- Streak Bonus -->
			{#if showStreakBonus}
				<div class="streak-bonus">
					<div class="streak-text">🔥 PERFECT STREAK! 🔥</div>
					<div class="bonus-points">+50 BONUS</div>
					<div class="celebration">🎉</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="feedback incorrect">
			<!-- X Mark -->
			<div class="icon-circle incorrect-circle">
				<span class="x-icon">✗</span>
			</div>

			<!-- Wave -->
			<div class="hand-animation wave">👋</div>

			<!-- Explanation -->
			{#if item}
				<div class="explanation">
					<p class="explanation-title">
						{item.isRecyclable ? '♻️ This IS recyclable!' : '🚫 This is NOT recyclable'}
					</p>
					<p class="explanation-text">{item.description}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.feedback-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		transition: opacity 0.3s;
		z-index: 50;
		background: rgba(255, 255, 255, 0.9);
	}

	.feedback-container.visible {
		opacity: 1;
	}

	.feedback {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.icon-circle {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 5px solid black;
		box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
	}

	.correct-circle {
		background: linear-gradient(135deg, var(--color-green, #74AC4B) 0%, var(--color-georgia-green, #A4CDA8) 100%);
	}

	.incorrect-circle {
		background: linear-gradient(135deg, var(--color-coca-cola-red, #DF1725) 0%, #ff6b6b 100%);
		animation: shake 0.5s;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-10px) rotate(-5deg);
		}
		75% {
			transform: translateX(10px) rotate(5deg);
		}
	}

	.check-icon,
	.x-icon {
		font-size: 60px;
		font-weight: bold;
		color: white;
		text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
	}

	.hand-animation {
		font-size: 80px;
		animation: bounce 0.6s ease-in-out;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}

	.hand-animation.wave {
		animation: wave 0.6s ease-in-out 2;
	}

	@keyframes wave {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(-20deg);
		}
		75% {
			transform: rotate(20deg);
		}
	}

	.points {
		font-size: 3.5rem;
		font-weight: 900;
		color: var(--color-green, #74AC4B);
		text-shadow: 3px 3px 0 black;
		animation: floatUp 1s ease-out forwards;
	}

	@keyframes floatUp {
		0% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		100% {
			opacity: 0;
			transform: translateY(-40px) scale(1.3);
		}
	}

	.streak-bonus {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
		padding: 2rem 3rem;
		border: 5px solid black;
		border-radius: 20px;
		text-align: center;
		box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
		animation: pulseGlow 1s infinite;
		z-index: 100;
	}

	@keyframes pulseGlow {
		0%,
		100% {
			box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			box-shadow: 0 0 60px rgba(255, 215, 0, 1);
			transform: translate(-50%, -50%) scale(1.02);
		}
	}

	.streak-text {
		font-size: 1.8rem;
		font-weight: 900;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.bonus-points {
		font-size: 3rem;
		font-weight: 900;
		color: var(--color-coca-cola-red, #DF1725);
		text-shadow: 2px 2px 0 white;
	}

	.celebration {
		font-size: 3rem;
		margin-top: 0.5rem;
		animation: bounce 0.3s ease-in-out infinite;
	}

	.explanation {
		border-style: solid;
		border-width: 48px 40px 44px 40px;
		border-image-source: url('/assets/box/msg_box.png');
		border-image-slice: 13% 8% 12% 8% fill;
		border-image-repeat: stretch;
		border-radius: 0;
		background: none;
		padding: 1.5rem 2rem;
		max-width: 400px;
		text-align: center;
		box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.35);
	}

	.explanation-title {
		font-size: 1.4rem;
		font-weight: bold;
		margin: 0 0 0.5rem 0;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
	}

	.explanation-text {
		font-size: 1.1rem;
		color: rgba(255, 255, 255, 0.85);
		margin: 0;
		line-height: 1.5;
	}

	/* iPad Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.icon-circle {
			width: 80px;
			height: 80px;
		}

		.check-icon,
		.x-icon {
			font-size: 40px;
		}

		.hand-animation {
			font-size: 50px;
		}

		.points {
			font-size: 2.5rem;
		}

		.explanation {
			padding: 1rem 1.5rem;
		}

		.explanation-title {
			font-size: 1.1rem;
		}

		.explanation-text {
			font-size: 0.95rem;
		}
	}
</style>
