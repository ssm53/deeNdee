<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import { onMountstore } from '../stores/store';

	let inputArray = [];
	let replyArray = [];
	let x;

	console.log(replyArray);

	export async function clickStart() {
		let nonHiddenModal = document.querySelector('.home-page');
		nonHiddenModal.classList.add('hidden');
		let hiddenModal = document.querySelector('.game-space');
		hiddenModal.classList.remove('hidden');
	}

	export async function clickEndGame() {
		inputArray = [];
		replyArray = [];
		let nonHiddenModal = document.querySelector('.game-space');
		nonHiddenModal.classList.add('hidden');
		let hiddenModal = document.querySelector('.home-page');
		hiddenModal.classList.remove('hidden');
	}

	let formData = {
		input: ''
	};

	export async function getReply() {
		inputArray.push(formData.input);
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/get-reply`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		const res = await resp.json();

		if (resp.status == 200) {
			onMountstore.set(true);
			x = res.reply.text;
			replyArray = [...replyArray, x];
			console.log(replyArray);
			console.log('success');
			console.log(res.reply.text);
			// do alerts and spinners
		} else {
			// do some error handling here
			inputArray.pop();
			console.log('error replying you matey');
		}
	}

	// Automatically scroll to the bottom of the information div when replies are added
	function scrollToBottom() {
		const informationDiv = document.querySelector('.information');
		informationDiv.scrollTop = informationDiv.scrollHeight;
	}

	// Call getReply when the component is mounted
	if ($onMountstore == false) {
		console.log('dont show anything yet');
	} else {
		onMount(async () => {
			await getReply();
			scrollToBottom();
		});
	}
</script>

<!-- Beginning -->
<div class="bg-black min-h-screen flex flex-col items-center justify-center">
	<!-- MODAL 1 -->
	<div class=" w-screen flex-col home-page bg-black flex justify-center items-center">
		<button class="neon-button" on:click={clickStart}>START</button>
	</div>

	<!-- MODAL 2 -->
	<div class=" w-screen h-screen flex-col hidden game-space bg-white">
		<div
			class="information flex flex-col justify-items-center text-black h-2/3 overflow-y-auto p-4"
		>
			<p>
				Title: The Enchanted Forest's Dilemma In the heart of the mystical Eldrath Woods lies the
				Enchanted Forest, a realm where magic intertwines with nature in harmonious balance. This
				sacred grove has been a haven for magical creatures and a wellspring of unimaginable power
				for countless centuries. It has long stood as a testament to the delicate equilibrium
				between the ethereal forces that govern its existence. However, a foreboding menace now
				threatens to shatter this balance. The ancient Eldrath Tree, the revered guardian of the
				Enchanted Forest, has succumbed to a profound slumber, casting a shadow over the
				once-vibrant expanse. Whispers carried by the wind speak of a malevolent force that has
				infiltrated the sacred grove, a malevolence that drains the very life force from the magical
				inhabitants that call the forest home. As a daring adventurer, you stand on the verge of
				this enchanted realm, the air thick with the palpable weight of uncertainty. The ethereal
				glow that once bathed the forest in a mystical radiance has waned, replaced by an ominous
				and unsettling shadow. The towering trees, once lively and animated, now stand as silent
				witnesses to the encroaching threat. The scenario unfolds as you enter the dense thicket at
				the forest's entrance. The ancient trees, gnarled and wise, whisper secrets of the forest's
				plight. Their voices, carried by the gentle rustle of leaves, beckon you to embark on a
				quest to save the Enchanted Forest. The urgency of the situation resonates with each step
				you take, a pressing call to action from the very heart of the woods. Before you, the forest
				presents three diverging paths, each leading deeper into its mystical core. The choices you
				make will shape the destiny of this sacred realm, and the mystical creatures within watch
				with a collective bated breath, hoping that the balance can be restored. The Whispering
				Grove: To the right, the Whispering Grove beckons—an ancient enclave where the trees share
				their timeless knowledge. Will you listen to the wisdom of the ancient spirits, hoping to
				unveil the source of the mysterious affliction? Perhaps within their whispers, the key to
				awakening the Eldrath Tree lies hidden. The Forgotten Hollows: Straight ahead, a mysterious
				aura surrounds the path leading to the Forgotten Hollows, a secluded and mystical area
				untouched by most adventurers. Legends tell of forgotten magic buried deep within its
				depths, waiting to be rediscovered. Will you venture into the unknown, hoping to unearth
				ancient secrets that could save the Eldrath Tree? The Mystic Cascade: To the left, the sound
				of cascading water draws your attention to the Mystic Cascade. A powerful and ancient water
				source, rumored to hold the essence of the forest's magic. Do you dare to approach the
				cascade, seeking the untapped magical energy that may have the potential to revitalize the
				Eldrath Tree? As you contemplate your choice, the forest awaits your decision. The destiny
				of the Enchanted Forest hangs in the balance, and the echoes of your chosen path resonate
				through the ancient trees. The quest to save this mystical realm begins with a single step.
				\n Forest's Dilemma In the heart of the mystical Eldrath Woods lies the Enchanted Forest, a
				realm where magic intertwines with nature in harmonious balance. This sacred grove has been
				a haven for magical creatures and a wellspring of unimaginable power for countless
				centuries. It has long stood as a testament to the delicate equilibrium between the ethereal
				forces that govern its existence. However, a foreboding menace now threatens to shatter this
				balance. The ancient Eldrath Tree, the revered guardian of the Enchanted Forest, has
				succumbed to a profound slumber, casting a shadow over the once-vibrant expanse. Whispers
				carried by the wind speak of a malevolent force that has infiltrated the sacred grove, a
				malevolence that drains the very life force from the magical inhabitants that call the
				forest home. As a daring adventurer, you stand on the verge of this enchanted realm, the air
				thick with the palpable weight of uncertainty. The ethereal glow that once bathed the forest
				in a mystical radiance has waned, replaced by an ominous and unsettling shadow. The towering
				trees, once lively and animated, now stand as silent witnesses to the encroaching threat.
				The scenario unfolds as you enter the dense thicket at the forest's entrance. The ancient
				trees, gnarled and wise, whisper secrets of the forest's plight. Their voices, carried by
				the gentle rustle of leaves, beckon you to embark on a quest to save the Enchanted Forest.
				The urgency of the situation resonates with each step you take, a pressing call to action
				from the very heart of the woods. Before you, the forest presents three diverging paths,
				each leading deeper into its mystical core. The choices you make will shape the destiny of
				this sacred realm, and the mystical creatures within watch with a collective bated breath,
				hoping that the balance can be restored. The Whispering Grove: To the right, the Whispering
				Grove beckons—an ancient enclave where the trees share their timeless knowledge. Will you
				listen to the wisdom of the ancient spirits, hoping to unveil the source of the mysterious
				affliction? Perhaps within their whispers, the key to awakening the Eldrath Tree lies
				hidden. The Forgotten Hollows: Straight ahead, a mysterious aura surrounds the path leading
				to the Forgotten Hollows, a secluded and mystical area untouched by most adventurers.
				Legends tell of forgotten magic buried deep within its depths, waiting to be rediscovered.
				Will you venture into the unknown, hoping to unearth ancient secrets that could save the
				Eldrath Tree? The Mystic Cascade: To the left, the sound of cascading water draws your
				attention to the Mystic Cascade. A powerful and ancient water source, rumored to hold the
				essence of the forest's magic. Do you dare to approach the cascade, seeking the untapped
				magical energy that may have the potential to revitalize the Eldrath Tree? As you
				contemplate your choice, the forest awaits your decision. The destiny of the Enchanted
				Forest hangs in the balance, and the echoes of your chosen path resonate through the ancient
				trees. The quest to save this mystical realm begins with a single step. \n
			</p>

			{#if replyArray.length != 0}
				{#each replyArray as reply}
					<p>{reply}</p>
				{/each}
			{/if}
		</div>

		<div class=" user-input fixed bottom-0 w-full bg-white p-4">
			<label class="label">
				<textarea
					class=" textarea"
					rows="4"
					placeholder="Enter your reply here"
					bind:value={formData.input}
				/>
			</label>
			<button
				type="button"
				class="btn btn-sm variant-filled-primary"
				on:click={() => {
					getReply(formData);
				}}>Add reply</button
			>
		</div>
	</div>
</div>

<style>
	:root {
		--clr-neon: hsl(317 100% 54%);
		--clr-bg: hsl(323 21% 16%);
	}

	.neon-button {
		font-size: 3rem;
		color: var(--clr-neon);
		display: inline-block;
		cursor: pointer;
		text-decoration: none;
		border: var(--clr-neon) 0.125em solid;
		padding: 0.25em 1em;
		border-radius: 0.25em;

		text-shadow:
			0 0 0.125em hsl(0 0% 100% / 0.3),
			0 0 0.45em var(--clr-neon);

		box-shadow:
			inset 0 0 0.5em 0 var(--clr-neon),
			0 0 0.5em 0 var(--clr-neon);
		position: relative;
		transition: background-color 100ms linear;
	}

	.neon-button::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		box-shadow: 0 0 2em 0.5em var(--clr-neon);
		opacity: 0;
		transition: opacity 100ms linear;
		background-color: var(--clr-neon);
		z-index: -1;
	}

	.neon-button:hover::before,
	.neon-button:focus::before {
		opacity: 1;
	}

	.neon-button:hover::after,
	.neon-button:focus::after {
		opacity: 1;
	}

	.neon-button::before {
		pointer-events: none;
		content: '';
		position: absolute;
		background: var(--clr-neon);
		top: 120%;
		left: 0;
		width: 100%;
		height: 100%;

		transform: perspective(1em) rotateX(40deg) scale(1, 0.35);
		filter: blur(1.5em);
		opacity: 0.7;
	}

	.neon-button:hover,
	.neon-button:focus {
		background-color: var(--clr-neon);
		color: var(--clr-bg);
		text-shadow: none;
	}

	.neon-button::after {
	}
</style>
