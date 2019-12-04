// shit implementation...

import { updateLeaderboard } from './leaderboard';

var lastGameUpdate = null;

export function processGameUpdate(update) {
    updateLeaderboard(update.leaderboard);
    console.log(update.leaderboard);
    lastGameUpdate = update;
}

export function getCurrentState() {
    return lastGameUpdate;
}

export function initState() {
    lastGameUpdate = null;
}
