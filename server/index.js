const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP Server
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*", // allow front-end client during dev
    methods: ["GET", "POST"]
  }
});

// Real-time communication handlers
io.on('connection', (socket) => {
  console.log(`[Socket.IO] User connected: ${socket.id}`);

  // Add individual handlers here as real-time features expand
  // socket.on('event_name', (data) => { ... });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] User disconnected: ${socket.id}`);
  });
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Brawl.AI Multiplayer Backend with Socket.IO is running successfully.' });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server and Socket.IO are running on port ${PORT}`);
});
