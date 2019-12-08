import { updateLeaderboard } from './leaderboard';

var lastGameUpdate = null;

// Function that get called to process the game update
export function processGameUpdate(update) {
    updateLeaderboard(update.leaderboard);
    lastGameUpdate = update;
}

// Gets current state of game
export function getCurrentState() {
    return lastGameUpdate;
}

export function initState() {
    lastGameUpdate = null;
}
