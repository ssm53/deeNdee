import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
//SHAUNS CODE
import { goto } from '$app/navigation';
import { loggedIn } from '../stores/store';

// also need to set emptyauth
// pleaase note that we need to set three things to our local strage... at the moment, it is two

const emptyAuth = {
	userToken: '',
	user: ''
};
export function logOut() {
	localStorage.setItem('auth', JSON.stringify(emptyAuth));
	//SHAUNS CODE
	loggedIn.update((value) => {
		return false;
	});
	goto('/');

	return true;
}

// original authenticate user function
export async function authenticateUser(username, password) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/auth', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password
		})
	});

	const res = await resp.json();

	if (resp.status == 200) {
		// const res = await resp.json();
		localStorage.setItem(
			'auth',
			JSON.stringify({
				userToken: res.userAccessToken, // here i put access token
				user: res.userId
			})
		);
		//shauns code
		loggedIn.update((value) => {
			return true;
		});
		goto('/');
		// shaun's code
		return {
			success: true,
			res: res
		};
	} else {
		return {
			success: false,
			res: res
		};
	}
}

export function getUserId() {
	const auth = localStorage.getItem('auth');
	if (auth) {
		return JSON.parse(auth)['user'];
	}
	return null;
}

export function getTokenFromLocalStorage() {
	let auth = localStorage.getItem('auth');
	if (auth) {
		return JSON.parse(auth)['userToken'];
	}
	return null;
}

export async function isLoggedIn() {
	if (!getTokenFromLocalStorage()) {
		loggedIn.set(false);
	} else {
		loggedIn.set(true);
	}
}
