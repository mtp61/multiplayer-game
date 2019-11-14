import { getCurrentState } from './state';
import { getAsset } from './assets';

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

function render() {
    const game_state = getCurrentState();

    // check if game working
    if (game_state == null) { 
        console.log('null gamestate'); // remove this later
        return; 
    }

    // Do the rendering
    // draw background
    drawBackground();

    drawPlayers(game_state.me, game_state.others);
}

function drawBackground() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayers(me, others) {
    // draw me
    context.save();
    context.translate(me.x, me.y);
    context.rotate(me.direction);
    context.drawImage(
        getAsset('img_ship.png'),
        -30/2, 
        -30/2, 
        30, 
        30
    );
    context.restore();

    // draw other ships
}

var renderInterval = setInterval(render, 1000 / 60);

export function startRendering() {
    clearInterval(renderInterval);
    renderInterval = setInterval(render, 1000 / 60);
}