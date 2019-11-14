import io from 'socket.io-client';

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
        //socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
        //socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    })
);