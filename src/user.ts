// user.js
import { Peer } from 'peerjs';

// Create reactive proxy that updates real user metadata and saves it to session storage
export let metadata = new Proxy<{ [index: string]: unknown }>({}, {
    set(target, name, value, receiver) {
        if (typeof(name) === "string") {
            console.log(`Set ${name} to ${value}`);
            if (user) {
                let actual: { [index: string]: unknown }|undefined = (user.options as any).metadata;
                if (!actual) actual = {};
                actual[name] = value;
            }
        }

        saveUserData();
        return Reflect.set(target, name, value, receiver);
    },
});

let user: Peer;

/**
 * Gets PeerJS user and UUID.
 * @returns PeerJS Peer
 */
export async function initUser() {
    const raw = sessionStorage.getItem('user');

    if (raw) {
        const savedUser = JSON.parse(raw);
        user = new Peer(savedUser.id);

        // inefficient - change later
        for (const name in savedUser.metadata) {
            metadata[name] = savedUser[name];
        }
    } else {
        user = new Peer();
    }

    return new Promise<Peer>((resolve, reject) => {
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

/**
 * Saves metadata and UUID to session storage.
 */
function saveUserData() {
    const userData = {
        id: user.id,
        metadata: metadata || {}, // Ensure metadata is an object
    };
    sessionStorage.setItem('user', JSON.stringify(userData));
}