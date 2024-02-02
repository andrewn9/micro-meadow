const keys: {[index: string]: boolean|undefined} = {};

window.addEventListener("keypress", (e)=>{
    if (!e.repeat) {
        keys[e.key] = true;
        setTimeout(() => {
            keys[e.key] = false;
        }, 16.7);
    }
});
window.addEventListener("keyup", (e)=>{
    delete keys[e.key];
});

/**
 * Returns true if a key is held down.
 * @param key Key to check.
 */
export function getKeyDown(key: string): boolean {
    return keys[key.toLowerCase()] !== undefined || keys[key.toUpperCase()] !== undefined;
}

/**
 * Returns true if a key is pressed for 1 frame (~16.7 ms).
 * @param key Key to check.
 */
export function getKeyPressed(key: string): boolean {
    return keys[key.toLowerCase()] === true || keys[key.toUpperCase()] === true;
}