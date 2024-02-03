const keys: {[index: string]: boolean|undefined} = {};

window.addEventListener("keydown", (e)=>{
    if (!e.repeat) {
        const key = e.key.toLowerCase();
        keys[key] = true;
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
 * Returns true if a key is pressed for 1 frame.
 * @param key Key to check.
 */
export function getKeyPressed(key: string): boolean {
    return keys[key.toLowerCase()] === true;
}

/**
 * Call at the end of a frame. Necesarry for getKeyPressed
 */
export function reset() {
    for (const key in keys) {
        keys[key] = false;
    }
}