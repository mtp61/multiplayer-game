// import other javascript
import { connect, play } from './networking';
import { downloadAssets } from './assets';
import { initState } from './state';
import { startRendering } from './render';

// import css
import './css/main.css';

Promise.all([
    connect(),
    downloadAssets()
])
.then(() => {
    console.log('connected and all assets loaded');
    play();
    initState();
    startRendering();
})