const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../multiplayer-game/models/user-model');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());

// Connect to MongoDB (replace with your own MongoDB URI)
mongoose.connect('mongodb://localhost:27017/multiplayer_game', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Player authentication route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, 'secret_key');
  res.json({ token });
});

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Real-time game updates (e.g., game events)
  socket.on('gameEvent', (data) => {
    io.emit('gameUpdate', data);  // Broadcast to all clients
  });

  // Matchmaking logic (simplified)
  socket.on('joinMatch', (playerId) => {
    // Matchmaking logic (queue players, match them)
    io.emit('matchFound', { playerId });
  });
});

// Start server
server.listen(2121, () => {
  console.log('Server running on port 2121');
});
