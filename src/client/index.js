// import other javascript
import { connect, play } from './networking';
import { downloadAssets } from './assets';
import { initState } from './state';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { setLeaderboardHidden } from './leaderboard';

// import css
import './css/main.css';

// Gets the html elements from index.html
const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

// Asynchronous function call to run game
Promise.all([
    connect(),
    downloadAssets()
])
.then(() => {
    playMenu.classList.remove('hidden');
    usernameInput.focus();
    playButton.onclick = () => {
      playMenu.classList.add('hidden');
      play(usernameInput.value);
      initState();
      startCapturingInput();
      startRendering();
      setLeaderboardHidden(false);
    }

})

// Handles end of game scenario
function onGameOver() {
    stopCapturingInput();
    stopRendering();
    playMenu.classList.remove('hidden');
    setLeaderboardHidden(true);
}
