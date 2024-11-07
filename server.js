const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

// Serve static files from the "public" folder
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle chat messages
    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data); // Broadcast message to all clients
    });

    // Handle typing indicator
    socket.on('typing', (username) => {
        if (username) {
            socket.broadcast.emit('typing', username);
        } else {
            socket.broadcast.emit('typing', "");
        }
    });

    // Add user to the user list
    users.push(socket.id);
    io.emit('userCount', users.length);

    // Handle user disconnect
    socket.on('disconnect', () => {
        users = users.filter(user => user !== socket.id);
        io.emit('userCount', users.length);
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
