// index.js
import { userModule } from './user.mjs';

let user;

window.onload = async function () {
    try {
        user = await userModule.initUser();
        console.log('Accessing peer from index.js:', user);
        document.getElementById("UUID").innerText = 'UUID: ' + user.id;
    } catch (error) {
        console.error('Error initializing user:', error);
    }
};

function changeUsername() {
    var name = document.getElementById('usernameInput').value;
    userModule.changeMetadata('username', name);
    console.log('Username changed to: ' + name);
    document.getElementById("Username").innerText = 'Username: ' + user.options.metadata.username;
}
