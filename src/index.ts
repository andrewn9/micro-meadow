// index.js
import { initUser, metadata } from './user';
import { Peer } from 'peerjs';
import './style.css'

let user: Peer;

// pause testing
window.location.href = "game.html";

let usernameInput = document.querySelector("#usernameInput") as HTMLInputElement;
let uuid = document.querySelector("#uuid") as HTMLElement;
let userform = document.querySelector("#userform") as HTMLFormElement;

let modal = document.querySelector("#modal") as HTMLDialogElement;

userform.addEventListener("submit", (e)=>{
    e.preventDefault();
    let name = usernameInput.value;
    metadata.username = name;
    console.log(`Username changed to: ${name}`);
    (<HTMLElement> document.getElementById("username")).innerText = `Username: ${metadata.username}`;
});

window.onload = async function () {
    try {
        user = await initUser();
        console.log('Accessing peer from index.js:', user);
        uuid.innerText = `UUID: ${user.id}`;
    } catch (error) {
        console.error('Error initializing user:', error);
    }
};

(document.querySelector("#host") as HTMLButtonElement).addEventListener("click", ()=>{
    modal.showModal();
});