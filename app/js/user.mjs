// user.js
import * as PeerJS from './lib/peerjs/peerjs.min.js';

const userModule = (function () {
    let user;

    async function initUser(metadata) {
        const savedUser = JSON.parse(sessionStorage.getItem('user'));

        if (savedUser) {
            user = new Peer(savedUser.id, {
                metadata: savedUser.metadata,
            });
        } else {
            user = new Peer();
        }

        return new Promise((resolve, reject) => {
            user.on('open', (id) => {
                console.log('User initialized with ID:', id);
                saveUserData();
                resolve(user);
            });

            user.on('error', (error) => {
                console.error('Error initializing user:', error);
                reject(error);
            });
        });
    }

    function getUser() {
        return user;
    }

    function saveUserData() {
        const userData = {
            id: user.id,
            metadata: user.options.metadata || {}, // Ensure metadata is an object
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
    }

    function changeMetadata(key, value) {
        if (user && user.options.metadata) {
            user.options.metadata[key] = value;
            saveUserData();
        } else {
            console.error('User not initialized or metadata not available');
        }
    }

    return {
        initUser: initUser,
        getUser: getUser,
        changeMetadata: changeMetadata,
    };
})();

export { userModule };