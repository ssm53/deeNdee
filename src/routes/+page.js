// backend

// 1) need to make into an endpoint, and put the whole function in there and return in to the frontend

// frontend
// set up new project using skeleton and lms - done
// copy all code. - done
// 1. have a let's play button right in the middle of the page - DONE
// once that is clicked, we do modal style! (follow clinicgp system) - DONE
// show the gameplay prologue! we do basic ai dungeon style! - DONE
// now when submits input, do a request to backend... now, need to make backend into an endpoint, and put the whole function in there and return in to the frontend. - DONE
// let save input and reply into arrays - DONE
// once response is given, we need to add it into the information div but with a space - DONE
// cannot play game if you are not logged in - DONE
// do sign up and login error thingy - DONE
// end game ensure input and reply array is empty, and brings you back to home page. - done
// do spinners - done
// do alerts - done
// do spacing between replies - done
// do image generation

// image generation
// first do button 'see Image' - done
// once that is clicked, we do request to image generation api. - sorta done
// for this request, the prompt will be all us telling the scenario + prologue + the inputs and the replies one after another - done
// then we do backend for this - done
// for each user do a database of images left - they all start with 5 images. - done
// need to calc prompts remaining response and backend
// need to reduce prompts remaining by 1 response and backend
// once there is a response, we do do hidden modal etc and show the image right in the middle of the page. also now, the images left reduces by 1.
// have a close button to close modal
// for each user do a database of images left - they all start with 3 images.
// do alerts just incase cant get image generated or all free ones have been used up

// allowing memory
// when user clicks get reply, a new file is added with the content, and they can play the game. - DONE
// now check if a user adds more replies, is another file getting added? if not, then nothng to do here - DONE
// but what is happening now, is each time a user replies, it is creating that new file. instead if there already is a file with that name, we should only append it! - DONE
// if they reload, the file still stays, but they need to be able to come back to the game. so for this just take away the start button la - DONE
// so they can reload and continue the game. great! - DONE
// now, when a user logs out or ends the game, then the file will be deleted

// FURTHER THINGS TO DO
// 1. forgot password
// 2. sendgrid email
// 3. styling
