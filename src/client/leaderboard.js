import escape from 'lodash/escape';

// Gets leaderboard element from index.html
const leaderboard = document.getElementById('leaderboard');
const rows = document.querySelectorAll('#leaderboard table tr');

export function updateLeaderboard(data) {
  // This is a bit of a hacky way to do this and can get potentially dangerous. We would probably use something like React or another front end web framework like EJS instead if this were a bigger project.
  for (let i = 0; i < data.length; i++) {
    rows[i + 1].innerHTML = `<td>${escape(data[i].username.slice(0, 15)) || 'Anonymous'}</td><td>${
      data[i].score
    }</td>`;
  }
  for (let i = data.length; i < 5; i++) {
    rows[i + 1].innerHTML = '<td>-</td><td>-</td>';
  }
}

// Sets leaderboard to hidden or unhidden depending on game state
export function setLeaderboardHidden(hidden) {
  if (hidden) {
    leaderboard.classList.add('hidden');
  } else {
    leaderboard.classList.remove('hidden');
  }
}
