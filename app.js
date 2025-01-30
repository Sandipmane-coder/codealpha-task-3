const socket = io();

let playerToken = '';
let playerName = '';

// Login
document.getElementById('login-button').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await axios.post('http://localhost:2121/login', { username, password });
    playerToken = response.data.token;
    playerName = username;
    
    document.getElementById('player-name').innerText = playerName;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('game').style.display = 'block';
  } catch (error) {
    alert('Login failed: ' + error.response.data.error);
  }
});

// Join a match
document.getElementById('join-match').addEventListener('click', () => {
  socket.emit('joinMatch', playerName);
});

// Listen for game updates
socket.on('gameUpdate', (data) => {
  const gameUpdates = document.getElementById('game-updates');
  gameUpdates.innerHTML = `<p>${data.message}</p>`;
});

// Match found event
socket.on('matchFound', (data) => {
  console.log(`Match found for player: ${data.playerId}`);
  alert('Match found!');
});
