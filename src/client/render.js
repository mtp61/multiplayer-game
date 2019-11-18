import { getCurrentState } from './state';
import { getAsset } from './assets';

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

context.font = "10px Arial"; // set font

function render() {
    const game_state = getCurrentState();

    // check if game working
    if (game_state == null) { 
        console.log('null gamestate'); // remove this later
        return; 
    }

    // Do the rendering
    drawBackground();

    drawBullets(game_state.bullets);

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
        getAsset('img_ship_me.png'),
        -30/2, 
        -30/2, 
        30, 
        30
    );
    context.restore();
    context.fillText('HP: '.concat(me.hp), me.x - 20, me.y + 25);

    // draw other ships
    others.forEach(other => {
        context.save();
        context.translate(other.x, other.y);
        context.rotate(other.direction);
        context.drawImage(
            getAsset('img_ship.png'),
            -30/2, 
            -30/2, 
            30, 
            30
        );
        context.restore();
        context.fillText('HP: '.concat(other.hp), other.x - 20, other.y + 25);
    });

}

function drawBullets(bullets) {
    bullets.forEach(bullet => {
        context.save();
        context.translate(bullet.x, bullet.y);
        context.rotate(bullet.direction);
        context.drawImage(
            getAsset('img_bullet.png'),
            -60/2, 
            -10/2, 
            60, 
            10
        );
        context.restore();
    });
}

var renderInterval = setInterval(render, 1000 / 60);

export function startRendering() {
    clearInterval(renderInterval);
    renderInterval = setInterval(render, 1000 / 60);
}

export function stopRendering() {
    clearInterval(renderInterval);
}