<script>
	import { loggedIn } from '../stores/store';
	import { logOut } from './auth';
	import { goto } from '$app/navigation';

	let logIO;
	loggedIn.subscribe((value) => {
		logIO = value;
	});

	async function clickLogin() {
		goto('/login');
	}

	function clickSignUp() {
		goto('/sign-up');
	}

	function clickHome() {
		goto('/');
	}
</script>

<main>
	<div class="bg-black text-white">
		<div class="container mx-auto flex justify-between items-center p-4">
			<button
				class="bg-black text-white p-3 rounded-full hover:bg-gray-900 focus:outline-none"
				on:click={clickHome}
			>
				<img
					src="https://images.websiteplanet.com/wp-content/uploads/2020/08/9-Best-Z-Logos-and-How-to-Make-Your-Own-for-Free-image1.png"
					alt="Home"
					class="w-8 h-7"
				/>
			</button>
			<div class="flex space-x-4">
				{#if logIO === true}
					<button class="text-white hover:text-indigo-600 focus:outline-none" on:click={logOut}>
						Log Out
					</button>
				{:else}
					<button class="text-white hover:text-indigo-600 focus:outline-none" on:click={clickLogin}>
						Log In
					</button>
					<button
						class="text-white hover:text-indigo-600 focus:outline-none"
						on:click={clickSignUp}
					>
						Sign Up
					</button>
				{/if}
			</div>
		</div>
	</div>
</main>
