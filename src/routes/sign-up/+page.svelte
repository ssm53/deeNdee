<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { authenticateUser } from '../../utils/auth';
	import { loggedIn } from '../../stores/store';
	// import { signUpAlert } from '../../../utils/alert.js';
	let formErrors = {};

	function postSignUp() {
		loggedIn.update((value) => {
			return true;
		});
		goto('/');
		// signUpAlert();
	}

	async function createUser(evt) {
		evt.preventDefault();

		// if (evt.target['password'].value != evt.target['password-confirmation'].value) {
		// 	formErrors['password'] = { message: 'Password confirmation does not match' };
		// 	return;
		// }

		const userData = {
			username: evt.target['username'].value,
			password: evt.target['password'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/users', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		});

		if (resp.status == 200) {
			const res = await authenticateUser(userData.username, userData.password);

			if (res.success) {
				console.log('signup success');
				postSignUp();
			} else {
				throw 'Sign up succeeded but authentication failed';
			}
		} else {
			const res2 = await resp.json();
			// formErrors = res.data;
			if (res2.error) {
				formErrors = res2.error; // Update formErrors with validation errors
				console.log(formErrors);
			}
		}
	}
</script>

<div class=" bg-black h-screen py-10">
	<h1 class="text-center text-xl text-white">
		Fucking create an account matey...wear some Nike's and just do it
	</h1>
	<div class="text-center">
		<a class="link-hover italic text-xs text-white" href="/login"
			>Already have an account? Click here to login instead.</a
		>
	</div>
	<div class="flex justify-center items-center mt-8 bg-black">
		<form on:submit={createUser} class="w-1/3">
			<div class="form-control w-full">
				<label class="label" for="username">
					<span class="label-text text-white">Username</span>
				</label>
				<input
					type="text"
					name="username"
					placeholder="johndoe"
					class="input input-bordered w-full text-white bg-black border-4 border-pink-500"
				/>
				{#if 'username' in formErrors}
					<label class="label" for="username">
						<span class="label-text-alt text-red-500">{formErrors.username}</span>
					</label>
				{/if}
			</div>

			<div class="form-control w-full">
				<label class="label" for="password">
					<span class="label-text text-white">Password</span>
				</label>
				<input
					type="password"
					name="password"
					placeholder=""
					class="input input-bordered w-full text-white bg-black border-4 border-pink-500"
					required
				/>
				{#if 'password' in formErrors}
					<label class="label" for="password">
						<span class="label-text-alt text-red-500">{formErrors.password}</span>
					</label>
				{/if}
			</div>

			<div class="form-control w-full mt-4">
				<button
					class="btn btn-md text-white border-4 border-pink-500 bg-black hover:bg-gray-700 hover:shadow hover:shadow-gray-700 hover:text-yellow-100"
					>Sign Up</button
				>
			</div>
		</form>
	</div>
</div>
