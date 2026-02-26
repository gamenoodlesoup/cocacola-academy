<script lang="ts">
	import type { Item } from '$lib/types';

	interface Props {
		item: Item;
		onClose: () => void;
		onIdentify: (isRecyclable: boolean) => void;
	}

	let { item, onClose, onIdentify }: Props = $props();

	let popupStartTime = $state(Date.now());

	function handleIdentify(isRecyclable: boolean) {
		onIdentify(isRecyclable);
	}

	// Get category label with icon for tag display
	function getCategoryIcon(category: string): string {
		const iconMap: Record<string, string> = {
			plastic: '♻️',
			metal: '🔩',
			glass: '🧪',
			paper: '📃',
			organic: '🌿',
			other: '📦'
		};
		return iconMap[category] || '📦';
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="popup-overlay" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()}>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="popup-card" onclick={(e) => e.stopPropagation()}>
		<!-- Close Button -->
		<button class="close-button" onclick={onClose} aria-label="Close">
			✕
		</button>

		<!-- Item Image -->
		<div class="item-image-container">
			<img src={item.image} alt={item.name} class="item-popup-image" />
		</div>

		<!-- Item Name -->
		<h3 class="item-name">{item.name}</h3>

		<!-- Item Description -->
		<p class="item-description">{item.description}</p>

		<!-- Category Tag -->
		<div class="category-tag">
			<span>{getCategoryIcon(item.category)}</span>
			<span>{item.category}</span>
		</div>

		<!-- Decision Buttons -->
		<div class="decision-buttons">
			<button class="nine-patch-btn nine-patch-btn-green" onclick={() => handleIdentify(true)}>
				<span class="btn-icon">♻️</span>
				<span>Recyclable</span>
			</button>
			<button class="nine-patch-btn nine-patch-btn-red" onclick={() => handleIdentify(false)}>
				<span class="btn-icon">🚫</span>
				<span>Not Recyclable</span>
			</button>
		</div>
	</div>
</div>

<style>
	.popup-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
		animation: overlayFadeIn 0.3s ease;
		padding: 1rem;
	}

	@keyframes overlayFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.popup-card {
		/* 9-patch chalkboard frame */
		border-style: solid;
		border-width: 48px 40px 44px 40px;
		border-image-source: url('/assets/box/msg_box.png');
		border-image-slice: 13% 8% 12% 8% fill;
		border-image-repeat: stretch;
		border-radius: 0;
		background: none;
		padding: 1.5rem;
		max-width: 420px;
		width: 100%;
		text-align: center;
		position: relative;
		box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.35);
		animation: popupSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		color: var(--color-cream, #FCE9CC);
	}

	@keyframes popupSlideIn {
		from {
			transform: scale(0.7) translateY(30px);
			opacity: 0;
		}
		to {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}

	.close-button {
		position: absolute;
		top: 0.8rem;
		right: 0.8rem;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--color-cream, #FCE9CC);
		border: 3px solid black;
		font-size: 1.2rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		color: var(--color-text, #333);
		box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
	}

	.close-button:hover {
		background: var(--color-coca-cola-red, #DF1725);
		color: white;
		transform: scale(1.1);
	}

	.item-image-container {
		width: 120px;
		height: 120px;
		margin: 0 auto 1rem;
		background: var(--color-cream, #FCE9CC);
		border: 4px solid black;
		border-radius: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.15);
	}

	.item-popup-image {
		width: 90%;
		height: 90%;
		object-fit: contain;
		filter: drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.2));
		user-select: none;
		-webkit-user-drag: none;
	}

	.item-name {
		font-size: 1.6rem;
		font-weight: 900;
		color: white;
		margin: 0 0 0.5rem 0;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
	}

	.item-description {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.85);
		margin: 0 0 0.8rem 0;
		line-height: 1.5;
	}

	.category-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: var(--color-cream, #FCE9CC);
		border: 2px solid black;
		border-radius: 20px;
		padding: 0.3rem 0.8rem;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: capitalize;
		margin-bottom: 1.2rem;
		color: var(--color-text, #333);
	}

	.decision-buttons {
		display: flex;
		gap: 0.8rem;
	}

	/* Decision buttons use global .nine-patch-btn classes */
	.decision-buttons :global(.nine-patch-btn) {
		flex: 1;
		flex-direction: column;
		min-height: 60px;
		font-size: 0.9rem;
	}

	.btn-icon {
		font-size: 1.5rem;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	/* iPad Landscape */
	@media (max-height: 700px) and (orientation: landscape) {
		.popup-card {
			padding: 1.2rem 1.5rem;
			max-width: 450px;
			display: grid;
			grid-template-columns: auto 1fr;
			grid-template-rows: auto auto auto auto;
			gap: 0 1.2rem;
			text-align: left;
		}

		.close-button {
			grid-column: 2;
			grid-row: 1;
			justify-self: end;
		}

		.item-image-container {
			grid-column: 1;
			grid-row: 1 / 5;
			width: 100px;
			height: 100px;
			margin: 0;
		}

		.item-name {
			grid-column: 2;
			grid-row: 1;
			font-size: 1.3rem;
			align-self: end;
			padding-right: 3rem;
		}

		.item-description {
			grid-column: 2;
			grid-row: 2;
			font-size: 0.9rem;
		}

		.category-tag {
			grid-column: 2;
			grid-row: 3;
			margin-bottom: 0.5rem;
		}

		.decision-buttons {
			grid-column: 1 / 3;
			grid-row: 5;
		}

		.item-popup-image {
			width: 85%;
			height: 85%;
		}
	}

	/* Small screens */
	@media (max-width: 400px) {
		.popup-card {
			padding: 1.5rem;
		}

		.item-image-container {
			width: 100px;
			height: 100px;
		}

		.item-popup-image {
			width: 85%;
			height: 85%;
		}

		.item-name {
			font-size: 1.3rem;
		}
	}
</style>
