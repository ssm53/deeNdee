<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import { onMountstore, loggedIn, loading } from '../stores/store';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import Spinner from '../spinner/spinner.svelte';
	import {
		redirectAlert,
		replyAlert,
		imageGenlimitReachedAlert,
		imageGenFailedAlert
	} from '../utils/alert';
	import { getUserId } from '../utils/auth';

	let inputArray = [];
	let replyArray = [];
	let x;
	let answer = '';
	let selectedSize = '512x512';
	const userId = getUserId();

	let logIO;
	loggedIn.subscribe((value) => {
		logIO = value;
	});
	console.log(logIO);

	export async function clickStart() {
		try {
			if (logIO == false) {
				redirectAlert();
				goto('/login');
			} else {
				let nonHiddenModal = document.querySelector('.home-page');
				nonHiddenModal.classList.add('hidden');
				let hiddenModal = document.querySelector('.game-space');
				hiddenModal.classList.remove('hidden');
			}
		} catch (error) {
			// Handle the redirection error here
			console.error('Redirection error:', error);
		}
	}

	async function clickSeeImage() {
		loading.set(true);

		// here we're doing api call to get no of prompts remaining, to see if user can do api call or not. if number is <5,, then can
		const resp2 = await fetch(PUBLIC_BACKEND_BASE_URL + `/prompts-remaining/${userId}`, {
			method: 'GET'
		});

		const res2 = await resp2.json();
		const promptsRemaining = Number(res2.promptsRemaining);
		// no of prompt remaining api ends here

		// here is to get the prompt!
		let begPrompt =
			"I need you to generate an image based on this situation from a text-based game. The beginning(prologue) of the game is as such Title: The Enchanted Forest's Dilemma In the heart of the mystical Eldrath Woods lies the Enchanted Forest, a realm where magic intertwines with nature in harmonious balance. This sacred grove has been a haven for magical creatures and a wellspring of unimaginable power for countless centuries. It has long stood as a testament to the delicate equilibrium between the ethereal forces that govern its existence. However, a foreboding menace now threatens to shatter this balance. The ancient Eldrath Tree, the revered guardian of the Enchanted Forest, has succumbed to a profound slumber, casting a shadow over the once-vibrant expanse. Whispers carried by the wind speak of a malevolent force that has infiltrated the sacred grove, a malevolence that drains the very life force from the magical inhabitants that call the forest home. As a daring adventurer, you stand on the verge of this enchanted realm, the air thick with the palpable weight of uncertainty. The ethereal glow that once bathed the forest in a mystical radiance has waned, replaced by an ominous and unsettling shadow. The towering trees, once lively and animated, now stand as silent witnesses to the encroaching threat. The scenario unfolds as you enter the dense thicket at the forest's entrance. The ancient trees, gnarled and wise, whisper secrets of the forest's plight. Their voices, carried by the gentle rustle of leaves, beckon you to embark on a quest to save the Enchanted Forest. The urgency of the situation resonates with each step you take, a pressing call to action from the very heart of the woods. Before you, the forest presents three diverging paths, each leading deeper into its mystical core. The choices you make will shape the destiny of this sacred realm, and the mystical creatures within watch with a collective bated breath, hoping that the balance can be restored. The Whispering Grove: To the right, the Whispering Grove beckons—an ancient enclave where the trees share their timeless knowledge. Will you listen to the wisdom of the ancient spirits, hoping to unveil the source of the mysterious affliction? Perhaps within their whispers, the key to awakening the Eldrath Tree lies hidden. The Forgotten Hollows: Straight ahead, a mysterious aura surrounds the path leading to the Forgotten Hollows, a secluded and mystical area untouched by most adventurers. Legends tell of forgotten magic buried deep within its depths, waiting to be rediscovered. Will you venture into the unknown, hoping to unearth ancient secrets that could save the Eldrath Tree? The Mystic Cascade: To the left, the sound of cascading water draws your attention to the Mystic Cascade. A powerful and ancient water source, rumored to hold the essence of the forest's magic. Do you dare to approach the cascade, seeking the untapped magical energy that may have the potential to revitalize the Eldrath Tree? As you contemplate your choice, the forest awaits your decision. The destiny of the Enchanted Forest hangs in the balance, and the echoes of your chosen path resonate through the ancient trees. The quest to save this mystical realm begins with a single step. that's the end of the prologue. now, player inputs their decisions/actions and the game master replies with the appropriate answer to continue the game. Basically the game master and the player have a conversation. Below is the conversation history between the game master and the player. Please generate an images based on the scenario and the conversation between player and game master";

		let conversationHistory = '';

		const minLength = Math.min(inputArray.length, replyArray.length);

		for (let i = 0; i < minLength; i++) {
			conversationHistory = conversationHistory.concat(`player: ${inputArray[i]}\n`);
			conversationHistory = conversationHistory.concat(`game master: ${replyArray[i]}\n`);
		}

		// If one array is longer than the other, append the remaining elements
		if (inputArray.length > minLength) {
			for (let i = minLength; i < inputArray.length; i++) {
				conversationHistory = conversationHistory.concat(`player: ${inputArray[i]}\n`);
			}
		} else if (replyArray.length > minLength) {
			for (let i = minLength; i < replyArray.length; i++) {
				conversationHistory = conversationHistory.concat(`game master: ${replyArray[i]}\n`);
			}
		}

		// Now conversationHistory contains the dynamic conversation history
		let artPrompt = begPrompt.concat(' + ', conversationHistory);
		// YAY we finally got the art prompt!

		// now let's do our request
		if (promptsRemaining > 0) {
			try {
				const resp = await fetch(`${PUBLIC_BACKEND_BASE_URL}` + '/get-art', {
					method: 'POST',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
						// Authorization: getAccessTokenFromLocalStorage()
					},
					body: JSON.stringify({ prompt: artPrompt, size: selectedSize, userId: userId })
				});
				if (resp.status === 200) {
					loading.set(false);
					const res = await resp.json();
					// next we need to do hidden modal and shit
					let nonHiddenModal = document.querySelector('.game-space');
					nonHiddenModal.classList.add('hidden');
					let hiddenModal = document.querySelector('.image-space');
					hiddenModal.classList.remove('hidden');

					console.log(res);
					answer = res.text[0].url;
					// here we do api call to decrement no of prompts of this user by 1
					const resp2 = await fetch(`${PUBLIC_BACKEND_BASE_URL}` + `/dec-no-of-prompts/${userId}`, {
						method: 'POST',
						mode: 'cors',
						headers: {
							'Content-Type': 'application/json'
							// Authorization: getAccessTokenFromLocalStorage()
						}
					});
				} else {
					loading.set('false');
					imageGenFailedAlert();
					// Handle other status codes here
					console.error('Error:', resp.status);
				}
			} catch (error) {
				loading.set(false);
				// Handle network errors or exceptions
				console.error('Error:', error);
				// do cannot give image alert
			} finally {
				loading.set(false);
				console.log('aiyo');
			}
		} else {
			// do image gen limit reached alert
			imageGenlimitReachedAlert();
			console.log('limit reached');
		}
	}

	export async function clickEndGame() {
		inputArray = [];
		replyArray = [];
		let nonHiddenModal = document.querySelector('.game-space');
		nonHiddenModal.classList.add('hidden');
		let hiddenModal = document.querySelector('.home-page');
		hiddenModal.classList.remove('hidden');
	}

	export async function clickCloseModal() {
		let nonHiddenModal = document.querySelector('.image-space');
		nonHiddenModal.classList.add('hidden');
		let hiddenModal = document.querySelector('.game-space');
		hiddenModal.classList.remove('hidden');
	}

	let formData = {
		input: ''
	};

	export async function getReply() {
		// spinner shits
		loading.update((value) => {
			return true;
		});
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
			// spinner shits
			loading.update((value) => {
				return false;
			});
			onMountstore.set(true);
			x = res.reply.text;
			replyArray = [...replyArray, x];
			console.log(replyArray);
			console.log('success');
			console.log(res.reply.text);
			// do alerts and spinners
		} else {
			// spinner shits
			loading.update((value) => {
				return false;
			});
			replyAlert();
			// do some error handling here
			inputArray.pop();
			// do alerts and spinners
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

<Spinner />

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
			<p style="margin-bottom: 10px;">
				Title: The Enchanted Forest's Dilemma <br />In the heart of the mystical Eldrath Woods lies
				the Enchanted Forest, a realm where magic intertwines with nature in harmonious balance.
				This sacred grove has been a haven for magical creatures and a wellspring of unimaginable
				power for countless centuries. It has long stood as a testament to the delicate equilibrium
				between the ethereal forces that govern its existence.<br /> However, a foreboding menace
				now threatens to shatter this balance. The ancient Eldrath Tree, the revered guardian of the
				Enchanted Forest, has succumbed to a profound slumber, casting a shadow over the
				once-vibrant expanse. Whispers carried by the wind speak of a malevolent force that has
				infiltrated the sacred grove, a malevolence that drains the very life force from the magical
				inhabitants that call the forest home.<br /> As a daring adventurer, you stand on the verge
				of this enchanted realm, the air thick with the palpable weight of uncertainty. The ethereal
				glow that once bathed the forest in a mystical radiance has waned, replaced by an ominous
				and unsettling shadow. The towering trees, once lively and animated, now stand as silent
				witnesses to the encroaching threat.<br /> The scenario unfolds as you enter the dense
				thicket at the forest's entrance. The ancient trees, gnarled and wise, whisper secrets of
				the forest's plight. Their voices, carried by the gentle rustle of leaves, beckon you to
				embark on a quest to save the Enchanted Forest. The urgency of the situation resonates with
				each step you take, a pressing call to action from the very heart of the woods. Before you,
				the forest presents three diverging paths, each leading deeper into its mystical core. The
				choices you make will shape the destiny of this sacred realm, and the mystical creatures
				within watch with a collective bated breath, hoping that the balance can be restored. The
				Whispering Grove: To the right, the Whispering Grove beckons—an ancient enclave where the
				trees share their timeless knowledge. Will you listen to the wisdom of the ancient spirits,
				hoping to unveil the source of the mysterious affliction? Perhaps within their whispers, the
				key to awakening the Eldrath Tree lies hidden. The Forgotten Hollows: Straight ahead, a
				mysterious aura surrounds the path leading to the Forgotten Hollows, a secluded and mystical
				area untouched by most adventurers. Legends tell of forgotten magic buried deep within its
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
				from the very heart of the woods.<br /> Before you, the forest presents three diverging
				paths, each leading deeper into its mystical core. The choices you make will shape the
				destiny of this sacred realm, and the mystical creatures within watch with a collective
				bated breath, hoping that the balance can be restored.<br /> The Whispering Grove: To the
				right, the Whispering Grove beckons—an ancient enclave where the trees share their timeless
				knowledge. Will you listen to the wisdom of the ancient spirits, hoping to unveil the source
				of the mysterious affliction? Perhaps within their whispers, the key to awakening the
				Eldrath Tree lies hidden.<br />
				The Forgotten Hollows: Straight ahead, a mysterious aura surrounds the path leading to the Forgotten
				Hollows, a secluded and mystical area untouched by most adventurers. Legends tell of forgotten
				magic buried deep within its depths, waiting to be rediscovered. Will you venture into the unknown,
				hoping to unearth ancient secrets that could save the Eldrath Tree?<br /> The Mystic Cascade:
				To the left, the sound of cascading water draws your attention to the Mystic Cascade. A powerful
				and ancient water source, rumored to hold the essence of the forest's magic. Do you dare to approach
				the cascade, seeking the untapped magical energy that may have the potential to revitalize the
				Eldrath Tree? As you contemplate your choice, the forest awaits your decision. The destiny of
				the Enchanted Forest hangs in the balance, and the echoes of your chosen path resonate through
				the ancient trees. The quest to save this mystical realm begins with a single step.
			</p>

			{#if replyArray.length != 0}
				{#each replyArray as reply}
					<p style="margin-bottom: 20px;">{reply}</p>
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
			<button type="button" class="btn btn-sm variant-filled-primary" on:click={clickEndGame}
				>End Game</button
			>
			<button type="button" class="btn btn-sm variant-filled-primary" on:click={clickSeeImage}
				>See Image</button
			>
		</div>
	</div>

	<!-- MODAL 3 -->
	<div class=" w-screen flex-col image-space hidden bg-black flex justify-center items-center">
		<!-- svelte-ignore a11y-img-redundant-alt -->
		<img src={answer} alt="a picture" />
		<button type="button" class="btn btn-sm variant-filled-primary" on:click={clickCloseModal}
			>Close</button
		>
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
