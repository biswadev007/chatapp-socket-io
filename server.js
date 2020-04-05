const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getUser, removeUser, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connect
io.on('connection', socket => {

    // Join Room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome to an user
        socket.emit('message', formatMessage('', 'Welcome to ChatCord !'));

        // Brodcast when a user connect
        socket.broadcast.to(user.room).emit('message', formatMessage('', `${user.username} has join the Room`));

        //send User to room
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Listen for chat message
    socket.on('chatMessage', (msg) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when a user disconnect
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage('', `${user.username} has left the Room`));
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getUser(user.room)
            });
        }
    });


});


const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server running at: ${PORT}`));