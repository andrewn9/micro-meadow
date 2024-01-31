// user.js
import { Peer, PeerOptions } from 'peerjs';

export let metadata: {[index: string]: unknown};

let user: Peer;

export async function initUser(metadata?: {[index: string]: unknown}) {
        const raw = sessionStorage.getItem('user');

        if (raw) {
            const savedUser = JSON.parse(raw);

            metadata = new Proxy<{[index: string]: unknown}>(savedUser.metadata, {
                set(target, name, value, receiver) {
                    console.log(`Set ${name} to ${value}`)
                    return Reflect.set(target, name, value, receiver);
                },
            });

            user = new Peer(savedUser.id, {
                host: "localhost",
                port: 5173,
                metadata: savedUser.metadata,
            } as PeerOptions);
            console.log(metadata);
        } else {
            metadata = new Proxy<{[index: string]: unknown}>({}, {
                set(target, name, value, receiver) {
                    console.log(`Set ${name} to ${value}`);
                    saveUserData();
                    return Reflect.set(target, name, value, receiver);
                },
            });

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

function saveUserData() {
    const userData = {
        id: user.id,
        metadata: metadata || {}, // Ensure metadata is an object
    };
    sessionStorage.setItem('user', JSON.stringify(userData));
}