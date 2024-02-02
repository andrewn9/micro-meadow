const keys: {[index: string]: boolean|undefined} = {};

window.addEventListener("keydown", (e)=>{
    if (!e.repeat) {
        keys[e.key.toLowerCase()] = true;
        setTimeout(() => {
            keys[e.key.toLowerCase()] = false;
        }, 16.7);
    }
});
window.addEventListener("keyup", (e)=>{
    delete keys[e.key.toLowerCase()];
});

/**
 * Returns true if a key is held down.
 * @param key Key to check.
 */
export function getKeyDown(key: string): boolean {
    return keys[key.toLowerCase()] !== undefined;
}

/**
 * Returns true if a key is pressed for 1 frame (~16.7 ms).
 * @param key Key to check.
 */
export function getKeyPressed(key: string): boolean {
    return keys[key.toLowerCase()] === true;
}