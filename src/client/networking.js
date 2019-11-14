import { processGameUpdate } from './state';

import io from 'socket.io-client';

const Constants = require('../shared/constants');

const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
        console.log('Connected to server!');
        resolve();
    });
});

export const connect = onGameOver => ( // todo see if need onGameOver
    connectedPromise.then(() => {
        // Register callbacks
        socket.on(Constants.MSG.GAME_UPDATE, processGameUpdate);
        //socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    })
);

export const play = () => {
    socket.emit(Constants.MSG.GAME_JOIN, '');
};
