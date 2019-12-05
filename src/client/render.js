import { getCurrentState } from './state';
import { getAsset } from './assets';

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

const Constants = require('../shared/constants');

context.font = "10px Arial"; // set font

var img = new Image();

img.src = 'assets/grid.png';

var ptrn;

img.onload = function(){
    // create pattern
    ptrn = context.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
}

function render() {
    const game_state = getCurrentState();

    // check if game working
    if (game_state == null) { 
        console.log('null gamestate'); // log null gamestate to the console
        return; 
    }

    // Do the rendering
    drawBackground(game_state.me);

    drawBullets(game_state.bullets, game_state.me);

    drawPlayers(game_state.me, game_state.others);

    drawMinimap(game_state.me, game_state.others);
}

function drawBackground(me) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#1f306b';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(-me.x, -me.y);
    context.fillStyle = ptrn;
    context.fillRect(canvas.width/2 + Constants.MAP.MIN_X, canvas.height/2 + Constants.MAP.MIN_Y, 
        Constants.MAP.MAX_X - Constants.MAP.MIN_X, Constants.MAP.MAX_Y - Constants.MAP.MIN_Y); 
    context.restore();
}

function drawMinimap(me,others) {
    context.clearRect(canvas.width-140, canvas.height-140, 110, 110);
    context.beginPath();
    context.rect(canvas.width-140, canvas.height-140, 110, 110);
    context.stroke();

    //draw me on map
    context.drawImage(
        getAsset('dot.png'),
        canvas.width-140+me.x/(Constants.MAP.MAX_X - Constants.MAP.MIN_X)*100, 
        canvas.height-140+me.y/(Constants.MAP.MAX_Y - Constants.MAP.MIN_Y)*100,
        10, 
        10
    );

    //draw other ships on map
    others.forEach(other => {
        context.drawImage(
            getAsset('red_dot.png'),
            canvas.width-130+other.x/50, 
            canvas.height-130+other.y/50, 
            10, 
            10
        );
    });

    //draw healthbar
    if (me.hp > 70)
    {
        context.fillStyle = '#238823';
    }
    else if (me.hp > 30)
    {
        context.fillStyle = '#ffbf00'
    }
    else
    {
        context.fillStyle = '#d2222d';
    }

    context.clearRect(canvas.width-140, canvas.height-160, 110, 10);
    context.beginPath();
    context.rect(canvas.width-140, canvas.height-160, 110, 10);
    context.stroke();

    context.fillRect(canvas.width-140, canvas.height-160, Math.max(0,1.1*me.hp),10);
}

function drawPlayers(me, others) {
    // draw other ships
    others.forEach(other => {
        context.save();
        context.translate(canvas.width/2-me.x+other.x, canvas.height/2-me.y+other.y);
        context.rotate(other.direction);
        context.drawImage(
            getAsset('ship1.png'),
            -100/2, 
            -100/2, 
            100, 
            100
        );
        context.restore();
        // draw health bar
        if (other.hp > 70) {
            context.fillStyle = '#238823';
        }
        else if (other.hp > 30) {
            context.fillStyle = '#ffbf00'
        }
        else {
            context.fillStyle = '#d2222d';
        }
        context.clearRect(canvas.width/2-me.x+other.x - 27, canvas.height/2-me.y+other.y + 60, 55, 5);
        context.beginPath();
        context.rect(canvas.width/2-me.x+other.x - 27, canvas.height/2-me.y+other.y + 60, 55, 5);
        context.stroke();
        context.fillRect(canvas.width/2-me.x+other.x - 27, canvas.height/2-me.y+other.y + 60, Math.max(0,.55*other.hp),5);
        // draw name
        context.fillStyle = '#000000';
        context.font = '12px sans-serif';
        let textWidth = context.measureText(other.username).width;
        context.fillText(other.username, canvas.width/2-me.x+other.x - textWidth / 2, canvas.height/2-me.y+other.y - 60);
    });
    
    // draw me
    context.save();
    context.translate(canvas.width/2,canvas.height/2);
    context.rotate(me.direction);
    context.drawImage(
        getAsset('ship7.png'),
        -100/2,
        -100/2,
        100, 
        100
    );
    context.restore();
    // draw my healthbar
    if (me.hp > 70) {
        context.fillStyle = '#238823';
    }
    else if (me.hp > 30) {
        context.fillStyle = '#ffbf00'
    }
    else {
        context.fillStyle = '#d2222d';
    }
    context.clearRect(canvas.width/2 - 27, canvas.height/2 + 60, 55, 5);
    context.beginPath();
    context.rect(canvas.width/2 - 27, canvas.height/2 + 60, 55, 5);
    context.stroke();
    context.fillRect(canvas.width/2 - 27, canvas.height/2 + 60, Math.max(0,.55*me.hp),5);
    // draw name
    context.fillStyle = '#000000';
    context.font = '12px sans-serif';
    let textWidth = context.measureText(me.username).width;
    context.fillText(me.username, (canvas.width/2) - (textWidth / 2), canvas.height/2 - 60);
}

function drawBullets(bullets, me) {
    bullets.forEach(bullet => {
        context.save();
        context.translate(canvas.width/2-me.x+bullet.x, canvas.height/2-me.y+bullet.y);
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