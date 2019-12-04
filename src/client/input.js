import { sendInput } from './networking';

// define vars
var movement = {
    left: 0,
    right: 0,
    forward: 0,
    gun: false
}
var networkInterval;

export function startCapturingInput() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    networkInterval = setInterval(toNetwork, 1000 / 60);
}
    
export function stopCapturingInput() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);

    clearInterval(networkInterval);
}

function toNetwork() {
    sendInput({
        rotation: (movement.right - movement.left) * .05,
        throttle: movement.forward * 3,
        gun: movement.gun
    });
}

function onKeyDown(e) {
    switch (e.keyCode) {
        case 65: // A
            movement.left = 1;
            break;
        case 87: // W
            movement.forward = 1;
            break;
        case 68: // D
            movement.right = 1;
            break;
        case 32: // space
            movement.gun = true;
            break;
    }
}

function onKeyUp(e) {
    switch (e.keyCode) {
        case 65: // A
            movement.left = 0;
            break;
        case 87: // W
            movement.forward = 0;
            break;
        case 68: // D
            movement.right = 0;
            break;
        case 32: // space
            movement.gun = false;
            break;
    }
}