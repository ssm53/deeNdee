import { writable } from 'svelte/store';

export const alertMessage = writable('');
export const warningAlert = writable(false);
export const successAlert = writable(false);

// create timeout to hide alerts
let timeoutId;

function resetTimeout() {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		const variable = [warningAlert, successAlert];
		variable.forEach((index) => index.set(false));
	}, 3000);
}

// create all alert functions

//signup alerts
// signup success
export function signUpSucAlert() {
	successAlert.set(true);
	alertMessage.set('sign up successful');
	resetTimeout();
}

// signup failed
export function signUpFailedAlert() {
	warningAlert.set(true);
	alertMessage.set('sign up failed');
	resetTimeout();
}

//login alerts
// login success
export function logInSucAlert() {
	successAlert.set(true);
	alertMessage.set('login successful');
	resetTimeout();
}

// login failed
export function logInFailedAlert() {
	warningAlert.set(true);
	alertMessage.set('login failed');
	resetTimeout();
}

// redirect alerts
// not allowed to play game. sign up or login first!
export function redirectAlert() {
	warningAlert.set(true);
	alertMessage.set('Login or signup first!');
	resetTimeout();
}

// reply alerts
// issue with reply alert
export function replyAlert() {
	warningAlert.set(true);
	alertMessage.set('Unable to give you a reply, sorry!');
	resetTimeout();
}

// image gen alerts
// limit reached
export function imageGenlimitReachedAlert() {
	warningAlert.set(true);
	alertMessage.set('Free image generation limit has been reached');
	resetTimeout();
}

// issue in generation
export function imageGenFailedAlert() {
	warningAlert.set(true);
	alertMessage.set('Unable to generate image');
	resetTimeout();
}
