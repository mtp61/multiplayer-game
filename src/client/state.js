// shit implementation...

var lastGameUpdate = null;

export function processGameUpdate(update) {
    lastGameUpdate = update;
}

export function getCurrentState() {
    return lastGameUpdate;
}

export function initState() {
    lastGameUpdate = null;
}