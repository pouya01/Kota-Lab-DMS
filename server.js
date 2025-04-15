const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from "public" folder
app.use(express.static('public'));

// Initial state shared across all clients
let currentState = {
    x: 200,
    y: 200,
    path: []
};

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('🔌 A user connected:', socket.id);

    // Send current state to newly connected client
    socket.emit('positionUpdate', currentState);

    // Listen for movement updates from client
    socket.on('positionUpdate', (data) => {
        if (data && typeof data.x === 'number' && typeof data.y === 'number') {
            currentState = data;
            // Broadcast to all other clients (except sender)
            socket.broadcast.emit('positionUpdate', currentState);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ A user disconnected:', socket.id);
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
