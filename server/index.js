{
  /*  



const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket)=>{
console.log("We have a new connection");

socket.on('disconnect', ()=>{
    console.log('User has disconnected');
})

});

app.use(router);

server.listen(PORT, () => console.log(`server has started on port ${PORT}`)); 








*/
}

const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const router = require('./router');

app.use(cors());
app.use(router);

io.on('connection', (socket) => {
  // ...

  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, added.!! Welcome to the room ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined.!!` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  //socket.on('chat', (payload) => {
  //console.log('What is a payload: ', payload);
  //io.emit('chat', payload);
  //});
});

//server.listen(5000, () => console.log(`server has started on port 5000`));

server.listen(process.env.PORT || 5000, function () {
  console.log('Express server listening on port %d in %s mode');
});
