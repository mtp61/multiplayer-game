// import other javascript
import { connect, play } from './networking';
import { downloadAssets } from './assets';
import { initState } from './state';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';

// import css
import './css/main.css';

Promise.all([
    connect(onGameOver),
    downloadAssets()
])
.then(() => {   
    play();
    initState();

    startCapturingInput();

    startRendering();
})

function onGameOver() {
    stopCapturingInput();

    stopRendering();
}